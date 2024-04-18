import { createPublicClient, createWalletClient, http, encodeFunctionData, HDAccount } from "viem";
import { create1155CreatorClient, createMintClient } from "@zoralabs/protocol-sdk";
import { base } from "viem/chains";
import { mnemonicToAccount } from 'viem/accounts'
import { ethers } from "ethers";
import { ERC20Minter__factory } from "../../contracts/typechain-types/factories/contracts/minters/erc20/ERC20Minter__factory"
import axios from "axios";
import { COLLECTIVE_ABI, C_WALLET_ABI, ERC1155ABI, ERC20MINTER_ABI, ERC20_ABI, ERC20_MINTER_ADDRESS, ETH_CURRENCY_ADDRESS, OPERATOR_ADDRESS } from "./constants";
import { MintParam, NFTData, Transaction, WriteContractParam } from "@/types";
import { collectiveBatchExecuteData, getProvider, getRecordPoolMintCallData } from "./collective";
import { get } from "http";

export async function create1155Contract(c_address: `0x${string}`, honeyPot: `0x${string}`, nftData: NFTData) {

    if (process.env.OPERATOR_MNEMONIC) {
        let tokenDecimal = 18;
        const walletAccount = mnemonicToAccount(process.env.OPERATOR_MNEMONIC)
        const walletClient = createWalletClient({
            account: walletAccount,
            chain: base,
            transport: http(process.env.RPC_URL!)
        });
        const publicClient = createPublicClient({
            chain: base,
            transport: http(process.env.RPC_URL!)
        });

        if (publicClient) {
            // Get the current timestamp in milliseconds
            const currentTimestamp = Date.now(); const hundredYearsInMilliseconds = 100 * 365.25 * 24 * 60 * 60 * 1000;
            const futureTimestamp = currentTimestamp + hundredYearsInMilliseconds;
            const futureUnixTimestamp = Math.floor(futureTimestamp / 1000);

            // @ts-ignore
            const creatorClient = create1155CreatorClient({ publicClient });

            const { request } = await creatorClient.createNew1155Token({
                contract: {
                    name: nftData.name,
                    uri: nftData.tokenMetaDataUri,
                    defaultAdmin: OPERATOR_ADDRESS as `0x${string}`,
                },
                tokenMetadataURI: nftData.tokenMetaDataUri,
                account: OPERATOR_ADDRESS as `0x${string}`,// This should be the creator address
                mintToCreatorCount: 1,
                salesConfig: {
                    saleStart: BigInt(Math.floor(Date.now() / 1000)),
                    saleEnd: BigInt(futureUnixTimestamp),
                    pricePerToken: toTokenNativeAmount(nftData.pricePerMintETH, tokenDecimal), // Price in Wei
                    fundsRecipient: honeyPot as `0x${string}` // collective wallet
                },
                createReferral: honeyPot as `0x${string}`,
            });

            const { request: simulateRequest } = await publicClient.simulateContract(request);
            const { abi, address, functionName, args } = simulateRequest;
            let writeContract = await getWriteContractParam(walletAccount, abi, address, functionName, args)
            const hash = await walletClient.writeContract(writeContract);
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            let nftContractAddress = receipt.logs[0].address;
            console.log(receipt, ' deployed NFT receipt')

            // If the payment currency is not ETH (Meaning, creator supports additional token currency), set the ERC20Minter as additional minter
            if (nftData.paymentCurrency != ETH_CURRENCY_ADDRESS) {

                // Set the ERC20Minter in ERC1155 CONTRACT to permissiont_bit_minter using addPermission
                writeContract = await getWriteContractParam(walletAccount, ERC1155ABI, nftContractAddress, 'addPermission', [
                    0, ERC20_MINTER_ADDRESS as `0x${string}`, 2 ** 1
                ])
                const erc20MinterPermissionHash = await walletClient.writeContract(writeContract);
                const addERC20MinterPermissionReceipt = await publicClient.waitForTransactionReceipt({ hash: erc20MinterPermissionHash });
                console.log(addERC20MinterPermissionReceipt, ' added permission to mint ERC20 tokens receipt')

                // Get currency decimal
                tokenDecimal = await getCurrencyDecimal(nftData.paymentCurrency);
                // setSale data from ERC20Minter contract
                let setSalesData = getSetSalesData(futureUnixTimestamp, nftData.pricePerMintToken!, honeyPot, nftData.paymentCurrency, tokenDecimal);

                // set sales on ERC20Minter                 
                writeContract = await getWriteContractParam(walletAccount, ERC1155ABI, nftContractAddress, 'callSale', [
                    1, ERC20_MINTER_ADDRESS, setSalesData
                ])
                const salesHash = await walletClient.writeContract(writeContract);
                console.log(salesHash, ' set sales on ERC20 Minter')
                const setSalesReceipt = await publicClient.waitForTransactionReceipt({ hash: salesHash });
                console.log(setSalesReceipt, ' set sales on ERC20 Minter receipt')
            }

            // Whitelist nft & currency contract on collective wallet
            writeContract = await getWriteContractParam(walletAccount, COLLECTIVE_ABI, c_address, 'whitelistTargets', [
                [nftData.paymentCurrency, nftContractAddress as `0x${string}`]
            ])
            const whitelistHash = await walletClient.writeContract(writeContract);
            const whitelistReceipt = await publicClient.waitForTransactionReceipt({ hash: whitelistHash });
            console.log(whitelistReceipt, ' whitelisted currency receipt')

            // Add permission to creator on nft contract
            writeContract = await getWriteContractParam(walletAccount, ERC1155ABI, nftContractAddress as `0x${string}`, 'addPermission', [
                0, // Token id
                nftData.creator, // creator address
                2 ** 1 // Permission bit
            ])
            const addPermissionCreatorHash = await walletClient.writeContract(writeContract);
            const addPermissionCreatorReceipt = await publicClient.waitForTransactionReceipt({ hash: addPermissionCreatorHash });
            console.log(addPermissionCreatorReceipt, ' added permission to creator receipt')

            // Set the creator as the owner of the contract            
            writeContract = await getWriteContractParam(walletAccount, ERC1155ABI, nftContractAddress as `0x${string}`, 'setOwner', [
                nftData.creator
            ])
            const setCreatorToOwnerHash = await walletClient.writeContract(writeContract);
            const setOwnerReceipt = await publicClient.waitForTransactionReceipt({ hash: setCreatorToOwnerHash });
            console.log(setOwnerReceipt, ' set creator as owner receipt')

            return {
                nftContractAddress,
                tokenId: 1,
                currency: nftData.paymentCurrency,
                currencyDecimal: tokenDecimal,
            };
        }
    } else throw Error("No .env variables for operator")
}


export async function erc20PreMint(c_wallet: `0x${string}`, mintParam: MintParam): Promise<Transaction> {

    const totalValue = toTokenNativeAmount(mintParam.totalValue, mintParam.tokenDecimal)
    // transaction data for ERC20 transfer by minter to collective
    const erc20TransferData = new ethers.Contract(mintParam.currency, ERC20_ABI).interface.encodeFunctionData(
        'transfer',
        [c_wallet, totalValue] // TODO: Update to use Per value or unbounded
    )
    const transferData = {
        abi: ERC20_ABI,
        to: mintParam.currency,
        data: erc20TransferData,
        value: BigInt(0)
    }

    return transferData

}

export async function mint(c_wallet: `0x${string}`, c_address: `0x${string}`, poolAddress: `0x${string}`, mintParam: MintParam): Promise<Transaction> {

    console.log(mintParam.currency == ETH_CURRENCY_ADDRESS, 'is eth??')
    if (mintParam.currency == ETH_CURRENCY_ADDRESS) {
        // ETH Mint
        return await ethMint(c_wallet, c_address, poolAddress, mintParam)
    }
    // ERC20 Mint
    return await erc20Mint(c_wallet, c_address, poolAddress, mintParam);

}

async function ethMint(c_wallet: `0x${string}`, c_address: `0x${string}`, poolAddress: `0x${string}`, mintParam: MintParam): Promise<Transaction> {
    // data for minting NFT on ERC20Minter by collective

    console.log(mintParam, 'mint param')
    const mintData = await getETHMintData(c_wallet, mintParam)
    const totalValue = toTokenNativeAmount(mintParam.totalValue, 18)

    // data for recording creator participation on pool
    let poolRecordData = getRecordPoolMintCallData(
        poolAddress,
        mintParam.creator,
        mintParam.tokenID,
        mintParam.quantity,
        totalValue,
    )

    let data: string[] = [
        mintData,
        poolRecordData
    ]
    let value: bigint[] = [
        totalValue,
        BigInt(0)
    ]
    let dest: string[] = [
        mintParam.tokenAddress,
        c_address
    ]
    // data for executeBatchWithPay on collective wallet
    let batchData = collectiveBatchExecuteData(value, data, dest, c_wallet)
    let batchTransactionData = {
        abi: C_WALLET_ABI,
        to: c_wallet,
        data: batchData,
        value: totalValue
    }

    return batchTransactionData

}

async function erc20Mint(c_wallet: `0x${string}`, c_address: `0x${string}`, poolAddress: `0x${string}`, mintParam: MintParam): Promise<Transaction> {
    const totalValue = toTokenNativeAmount(mintParam.totalValue, mintParam.tokenDecimal)

    // data for approval of ERC20Minter on collective wallet
    const erc20ApprovalData = new ethers.Contract(mintParam.currency, ERC20_ABI).interface.encodeFunctionData(
        'approve',
        [ERC20_MINTER_ADDRESS as `0x${string}`, totalValue] // TODO: Update to use Per value or unbounded
    )
    const mintData = ERC20Minter__factory.createInterface().encodeFunctionData('mint', [
        mintParam.recipient,
        mintParam.quantity,
        mintParam.tokenAddress,
        mintParam.tokenID,
        totalValue,
        mintParam.currency,
        mintParam.mintReferral,
        mintParam.comment
    ])
    // data for recording creator participation on pool
    let poolRecordData = getRecordPoolMintCallData(
        poolAddress,
        mintParam.creator,
        mintParam.tokenID,
        mintParam.quantity,
        totalValue,
    )

    let data: string[] = [
        erc20ApprovalData,
        mintData,
        poolRecordData
    ]
    let value: bigint[] = []
    let dest: string[] = [
        mintParam.currency,
        ERC20_MINTER_ADDRESS as `0x${string}`,
        c_address
    ]
    // data for executeBatchWithPay on collective wallet
    let batchData = collectiveBatchExecuteData(value, data, dest, c_wallet)
    let batchTransactionData = {
        abi: C_WALLET_ABI,
        to: c_wallet,
        data: batchData,
        value: BigInt(0)
    }

    return batchTransactionData
}

export async function pinFileToIPFS(file: any, name: string, description: string) {
    const JWT = process.env.PINATA_API_KEY

    const formData = new FormData();
    const pinataMetadata = JSON.stringify({ name, description });
    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    })
    formData.append('file', file)
    formData.append('pinataMetadata', pinataMetadata);
    formData.append('pinataOptions', pinataOptions);

    // @ts-ignore
    console.log('PINATA CALL:', formData, formData._boundary)
    try {
        const res = await axios.post(`https://api.pinata.cloud/pinning/pinFileToIPFS`, formData, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
                // @ts-ignore
                'Content-Type': `multipart/form-data`,
                'Authorization': `Bearer ${JWT}`
            }
        });
        console.log(res.data, 'RESULT FROM PINATA API CALL');
        const ipfsImageUrl = `ipfs://${res.data.IpfsHash}`
        return { ipfsImageUrl, ipfsGatewayUrl: `https://ipfs.io/ipfs/${res.data.IpfsHash}` }
    } catch (error) {
        console.log(error);
    }
}

export function toTokenNativeAmount(amount: string, decimals: number) {
    return ethers.parseUnits(amount, decimals);
}

function getSetSalesData(saleEnd: number, pricePerToken: string, fundsRecipient: `0x${string}`, paymentCurrency: `0x${string}`, currencyDecimal: number): string {
    let setSalesData = new ethers.Contract(ERC20_MINTER_ADDRESS as `0x${string}`, ERC20MINTER_ABI).interface.encodeFunctionData("setSale", [
        BigInt(1), // tokenId
        [
            BigInt(Math.floor(Date.now() / 1000)), // saleStart
            BigInt(saleEnd),  // saleEnd
            BigInt(0), // maxTokensPerAddress
            toTokenNativeAmount(pricePerToken, currencyDecimal), // Price in Wei
            fundsRecipient, // fundsRecipient - collective wallet
            paymentCurrency // paymentCurrency
        ]
    ]);
    return setSalesData;
}

async function getETHMintData(c_wallet: `0x${string}`, mintParam: MintParam) {

    const mintClient = createMintClient({ chain: base });
    const prepared = await mintClient.makePrepareMintTokenParams({
        minterAccount: mintParam.recipient,
        tokenAddress: mintParam.tokenAddress,
        tokenId: mintParam.tokenID,
        mintArguments: {
            // address that will receive the token
            mintToAddress: mintParam.recipient,
            // quantity of tokens to mint
            quantityToMint: Number(mintParam.quantity),
            // comment to include with the mint
            mintComment: mintParam.comment,
            // optional address that will receive a mint referral reward
            mintReferral: mintParam.mintReferral,
        },
    });
    console.log('prepared mint data', prepared.functionName, "function name", prepared.args, ' << args')
    const mintData = encodeFunctionData({
        abi: prepared.abi,
        functionName: prepared.functionName,
        args: [...(prepared.args as Array<any>)]
    })

    return mintData;
}

export async function getETHMintPrice(tokenAddress: `0x${string}`) : Promise<bigint>{
    const mintFee = new ethers.Contract(tokenAddress, ERC1155ABI, getProvider())
    const mintFeeAmount: bigint = await mintFee.mintFee()
    console.log(mintFeeAmount, 'mintFeeAmount')
    return mintFeeAmount;
}

async function getWriteContractParam(walletAccount: HDAccount, abi: readonly any[], address: `0x${string}`, functionName: string, args: unknown,): Promise<WriteContractParam> {
    const maxFessPerGas = (await getProvider().getFeeData()).maxFeePerGas
    let writeContract: WriteContractParam = {
        account: walletAccount,
        abi,
        address,
        functionName,
        args: args as Array<any>,
        nonce: await getProvider().getTransactionCount(walletAccount.address, 'latest')
    }
    if (maxFessPerGas) {
        writeContract.maxFeePerGas = (await getProvider().getFeeData()).maxFeePerGas as bigint | undefined
    }

    // const runner = new ethers.Wallet(walletAccount.getHdKey().privateKey?.toString()!, getProvider())
    // const contract = new ethers.Contract(address, abi, runner)
    // contract[functionName](...args)

    return writeContract
}

async function getCurrencyDecimal(currency: `0x${string}`) : Promise<number> {
    const erc20Contract = new ethers.Contract(currency, ERC20_ABI, getProvider())
    const decimal = Number(await erc20Contract.decimals())
    return decimal;
}