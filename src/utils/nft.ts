import { createPublicClient, createWalletClient, http, type PublicClient, type WalletClient } from "viem";
import { create1155CreatorClient } from "@zoralabs/protocol-sdk";
import { base } from "viem/chains";
import { mnemonicToAccount } from 'viem/accounts'

import axios from "axios";


export async function create1155Contract(tokenMetaDataUri: string, name: string) {
    if (process.env.OPERATOR_MNEMONIC && process.env.OPERATOR_ADDRESS) {
        const walletAccount = mnemonicToAccount(process.env.OPERATOR_MNEMONIC)

        console.log(walletAccount, 'walletaccount????')
        const walletClient = createWalletClient({
            account: walletAccount,
            chain: base,
            transport: http("https://base-mainnet.g.alchemy.com/v2/47hMa2y_Ow1YLx3fAsb_VqRcbwrUd-Tx")
        });
        const publicClient = createPublicClient({
            chain: base,
            transport: http("https://base-mainnet.g.alchemy.com/v2/47hMa2y_Ow1YLx3fAsb_VqRcbwrUd-Tx")
        });


        if (publicClient) {
            // @ts-ignore
            const creatorClient = create1155CreatorClient({ publicClient });

            //TODO: set the creator to the address that is connected with Farcaster instead of Liq OPERATOR
            //Liq operator should only pay for gas
            const { request } = await creatorClient.createNew1155Token({
                contract: {
                    name,
                    uri: tokenMetaDataUri
                },
                tokenMetadataURI: tokenMetaDataUri,
                account: process.env.OPERATOR_ADDRESS as `0x${string}`,
                mintToCreatorCount: 1,
            });

            const { request: simulateRequest } = await publicClient.simulateContract(request);
            const { abi, address, functionName, args } = simulateRequest
            const hash = await walletClient.writeContract({
                account: walletAccount,
                abi,
                address,
                functionName,
                args
            });
            console.log(hash, 'wat is hash?')
            const receipt = await publicClient.waitForTransactionReceipt({ hash });
            console.log(receipt, 'this should be nft reciept')
            return receipt;
        }

    }


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


    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
            headers: {
                // @ts-ignore
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
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


