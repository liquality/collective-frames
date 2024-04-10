import { createPublicClient, createWalletClient, http, type Client, HDAccount, PublicClient, WalletClient, Abi, Chain} from "viem";
import { create1155CreatorClient} from "@zoralabs/protocol-sdk";
import { base } from "viem/chains";
import { mnemonicToAccount } from 'viem/accounts'
import { ethers } from "ethers";
import {ERC20Minter__factory} from "../../contracts/typechain-types/factories/contracts/minters/erc20/ERC20Minter__factory"
import axios from "axios";
import { ERC1155ABI, ERC20MINTER_ABI, ERC20_ABI, ETH_CURRENCY_ADDRESS } from "./constants";
import { MintParam, NFTData, Transaction } from "@/types";
import { min } from "drizzle-orm";
import { token } from "../../contracts/typechain-types/@openzeppelin/contracts";
import { collectiveBatchExecuteData, getRecordPoolMintCallData } from "./collective";

export async function create1155Contract(c_wallet: `0x${string}`, nftData : NFTData ) {
    
    if (process.env.OPERATOR_MNEMONIC && process.env.OPERATOR_ADDRESS) {
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
            const currentTimestamp = Date.now();const hundredYearsInMilliseconds = 100 * 365.25 * 24 * 60 * 60 * 1000;
            const futureTimestamp = currentTimestamp + hundredYearsInMilliseconds;
            const futureUnixTimestamp = Math.floor(futureTimestamp / 1000);

            // @ts-ignore
            const creatorClient = create1155CreatorClient({ publicClient });

            const { request } = await creatorClient.createNew1155Token({
                contract: {
                    name: nftData.name,
                    uri: nftData.tokenMetaDataUri,
                    defaultAdmin: process.env.OPERATOR_ADDRESS as `0x${string}`,
                },
                tokenMetadataURI: nftData.tokenMetaDataUri,
                account: process.env.OPERATOR_ADDRESS as `0x${string}`,// This should be the creator address
                mintToCreatorCount: 1,
                salesConfig: {
                    saleStart: BigInt(Math.floor(Date.now() / 1000)), 
                    saleEnd: BigInt(futureUnixTimestamp), 
                    pricePerToken: ethers.parseEther(nftData.pricePerMintETH), // Price in Wei
                    fundsRecipient: c_wallet as `0x${string}` // collective wallet
                }
            });

            const { request: simulateRequest } = await publicClient.simulateContract(request);
            const { abi, address, functionName, args } = simulateRequest
            let nftContractAddress = address;
            const hash = await walletClient.writeContract({
                account: walletAccount,
                abi,
                address,
                functionName,
                args
            } );
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            console.log(receipt, ' deployed NFT receipt')

            // If the payment currency is not ETH (Meaning, creator supports additional token currency), set the ERC20Minter as additional minter
            if (nftData.paymentCurrency != ETH_CURRENCY_ADDRESS) {

                // Set the ERC20Minter in ERC1155 CONTRACT to permissiont_bit_minter using addPermission
                const erc20MinterPermissionHash = await walletClient.writeContract({
                    account: walletAccount,
                    abi: ERC1155ABI,
                    address: nftContractAddress,
                    functionName: 'addPermission',
                    args:
                    [
                        0, // permission bit
                        process.env.ERC20_MINTER_ADDRESS as `0x${string}`, // minter address
                        2**1
                    ]
                });
                const addERC20MinterPermissionReceipt = await publicClient.waitForTransactionReceipt({hash: erc20MinterPermissionHash});
                console.log(addERC20MinterPermissionReceipt, ' added permission to mint ERC20 tokens receipt')

                // Get currency decimal
                tokenDecimal = Number(await publicClient.readContract({
                    abi: ERC20_ABI,
                    address: nftData.paymentCurrency,
                    functionName: 'decimals',
                    args: []
                }));

                // setSale data from ERC20Minter contract
                let setSalesData = getSetSalesData(futureUnixTimestamp, nftData.pricePerMintETH, c_wallet, nftData.paymentCurrency, tokenDecimal);

                // set sales on ERC20Minter 
                const salesHash = await walletClient.writeContract({
                    account: walletAccount,
                    abi: ERC1155ABI,
                    address: `0x${"8b8d1007101b58071ef46810f206041a7ed0acc9"}`,//nftContractAddress,
                    functionName: 'callSale',
                    args: [
                        1,
                        process.env.ERC20_MINTER_ADDRESS as `0x${string}`,
                        setSalesData
                    ]
                });
                console.log(salesHash, ' set sales on ERC20 Minter')
                const setSalesReceipt = await publicClient.waitForTransactionReceipt({hash: salesHash});
                console.log(setSalesReceipt, ' set sales on ERC20 Minter receipt')
            }

            // Add permission to creator on nft contract
            const addPermissionCreatorHash = await walletClient.writeContract({
                account: walletAccount,
                abi: ERC1155ABI,
                address: nftContractAddress,
                functionName: 'addPermission',
                args:
                [
                    0, // Token id
                    nftData.creator, // creator address
                    2**1 // Permission bit
                ]
            });
            const addPermissionCreatorReceipt = await publicClient.waitForTransactionReceipt({hash: addPermissionCreatorHash});
            console.log(addPermissionCreatorReceipt, ' added permission to creator receipt')

            // Set the creator as the owner of the contract
            const setCreatorToOwnerHash = await walletClient.writeContract({
                account: walletAccount,
                abi: ERC1155ABI,
                address: nftContractAddress,
                functionName: 'setOwner',
                args:
                [
                    nftData.creator
                ]
            });
            const setOwnerReceipt = await publicClient.waitForTransactionReceipt({hash: setCreatorToOwnerHash});
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

export async function mint(c_wallet: `0x${string}`, poolAddress: `0x${string}`,  tokenAddress: `0x${string}`, tokenId: number, mintParam: MintParam): Promise<Transaction[]> {

    if (mintParam.currency == ETH_CURRENCY_ADDRESS) {
        // ETH Mint
        return await ethMint(c_wallet, poolAddress, tokenAddress, tokenId, mintParam)
    } 
    // ERC20 Mint
    return await erc20Mint(c_wallet, poolAddress, tokenAddress, tokenId, mintParam);

}

async function ethMint(c_wallet: `0x${string}`, poolAddress: `0x${string}`,  tokenAddress: `0x${string}`, tokenId: number, mintParam: MintParam): Promise<Transaction[]> {
     // - User sends ERC20 to collective wallet for minting
    // - Calls executeBatch on the collective wallet, passing in the mint data to mint
    //     - Collective wallet approves ERC20Minter to spend the total value of the token, provided is less than user's balance
    //     -  Collective calls mint on ERC20Minter to mint the NFT,
    //     - Collective records creator participation on pool A, and records user participation on pool B

    // data for minting NFT on ERC20Minter by collective
    const mintData = ERC20Minter__factory.createInterface().encodeFunctionData('mint', [
        mintParam.recipient, 
        mintParam.quantity, 
        tokenAddress, 
        tokenId, 
        toTokenNativeAmount(mintParam.totalValue, mintParam.tokenDecimal), 
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
        BigInt( mintParam.totalValue),
    )

    let data: string[] = [
        mintData,
        poolRecordData
    ]
    let value: bigint[] = [
        toTokenNativeAmount(mintParam.totalValue, mintParam.tokenDecimal),
        BigInt(0)
    ]
    let dest: string[] = [
        process.env.ERC20_MINTER_ADDRESS as `0x${string}`,
        poolAddress
    ]
    // data for executeBatchWithPay on collective wallet
    let batchData = collectiveBatchExecuteData(value, data, dest, c_wallet)
    let batchTransactionData = {
        to: c_wallet,
        data: batchData,
        value: toTokenNativeAmount(mintParam.totalValue, mintParam.tokenDecimal)
    }

    return [
        batchTransactionData
    ]
}

async function erc20Mint(c_wallet: `0x${string}`, poolAddress: `0x${string}`,  tokenAddress: `0x${string}`, tokenId: number, mintParam: MintParam): Promise<Transaction[]> {
    // - User sends ERC20 to collective wallet for minting
    // - Calls executeBatch on the collective wallet, passing in the mint data to mint
    //     - Collective wallet approves ERC20Minter to spend the total value of the token, provided is less than user's balance
    //     -  Collective calls mint on ERC20Minter to mint the NFT,
    //     - Collective records creator participation on pool A, and records user participation on pool B

    // transaction data for ERC20 transfer by minter to collective
    const erc20TransferData = new ethers.Contract(mintParam.currency, ERC20_ABI).interface.encodeFunctionData(
        'transfer', 
        [c_wallet, toTokenNativeAmount(mintParam.totalValue, mintParam.tokenDecimal)] // TODO: Update to use Per value or unbounded
    )
    const transferData = {
        to: mintParam.currency,
        data: erc20TransferData,
        value: BigInt(0)
    }
    
    // data for approval of ERC20Minter on collective wallet
    const erc20ApprovalData = new ethers.Contract(mintParam.currency, ERC20_ABI).interface.encodeFunctionData(
        'approve', 
        [process.env.ERC20_MINTER_ADDRESS as `0x${string}`, toTokenNativeAmount(mintParam.totalValue, mintParam.tokenDecimal)] // TODO: Update to use Per value or unbounded
    )
    // data for minting NFT on ERC20Minter by collective
    const mintData = ERC20Minter__factory.createInterface().encodeFunctionData('mint', [
        mintParam.recipient, 
        mintParam.quantity, 
        tokenAddress, 
        tokenId, 
        toTokenNativeAmount(mintParam.totalValue, mintParam.tokenDecimal), 
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
        BigInt( mintParam.totalValue),
    )

    let data: string[] = [
        erc20ApprovalData,
        mintData,
        poolRecordData
    ]
    let value: bigint[] = []
    let dest: string[] = [
        mintParam.currency,
        process.env.ERC20_MINTER_ADDRESS as `0x${string}`,
        poolAddress
    ]
    // data for executeBatchWithPay on collective wallet
    let batchData = collectiveBatchExecuteData(value, data, dest, c_wallet)
    let batchTransactionData = {
        to: c_wallet,
        data: batchData,
        value: BigInt(0)
    }

    return [
        transferData,
        batchTransactionData
    ]
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

function toTokenNativeAmount(amount: string, decimals: number) {
    return ethers.parseUnits(amount, decimals);
}

function getSetSalesData(saleEnd: number, pricePerToken: string, fundsRecipient: `0x${string}`, paymentCurrency: `0x${string}`, currencyDecimal: number) : string {
    let setSalesData = new ethers.Contract(process.env.ERC20_MINTER_ADDRESS as `0x${string}`, ERC20MINTER_ABI).interface.encodeFunctionData("setSale", [ 
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

async function directMint(tokenAddress: `0x${string}`, tokenId: number, mintParam: MintParam) {
    const walletAccount = mnemonicToAccount(process.env.OPERATOR_MNEMONIC!)
    const walletClient = createWalletClient({
        account: walletAccount,
        chain: base,
        transport: http(process.env.RPC_URL!)
    });

    const publicClient = createPublicClient({
        chain: base,
        transport: http(process.env.RPC_URL!)
    });
    
    const hash = await walletClient.writeContract({
        account: walletAccount,
        abi: ERC20MINTER_ABI,
        address: process.env.ERC20_MINTER_ADDRESS as `0x${string}`,
        functionName: 'mint',
        args: [
                mintParam.recipient, 
                mintParam.quantity, 
                tokenAddress, 
                tokenId, 
                toTokenNativeAmount(mintParam.totalValue, mintParam.tokenDecimal), 
                mintParam.currency, 
                mintParam.mintReferral, 
                mintParam.comment]
    });
    console.log(hash, ' mint hash')
    const receipt = await publicClient.waitForTransactionReceipt({hash});
    console.log(receipt, 'mint receipt')
    return receipt;
}
