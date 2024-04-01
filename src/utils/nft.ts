import { createPublicClient, createWalletClient, http, type PublicClient, type WalletClient } from "viem";
import { create1155CreatorClient } from "@zoralabs/protocol-sdk";
import axios from "axios"
import fs from "fs"
import { base, mainnet } from "viem/chains";



export async function create1155Contract({

    creator,
}: {

    creator: `0x${string}`
}) {


    // Initialize public client
    const publicClient = await publicClient()

    //TODO: we need to use Pinata here to upload the creators tokenmetadata
    const demoTokenMetadataURI = "ipfs://DUMMY/token.json";
    const demoContractMetadataURI = "ipfs://DUMMY/contract.json";
    const creatorClient = create1155CreatorClient({ publicClient });
    const { request } = await creatorClient.createNew1155Token({
        contract: {
            name: "testContract",
            uri: demoContractMetadataURI,
        },
        tokenMetadataURI: demoTokenMetadataURI,
        account: creator,
        mintToCreatorCount: 1,
    });
    const { request: simulateRequest } = await publicClient.simulateContract(request);
    const hash = await walletClient.writeContract(simulateRequest);
    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    return receipt;
}


/* const pinFileToIPFS = async () => {
    const JWT = process.env.NEXT_PUBLIC_PINATA_API_KEY

    const formData = new FormData();
    const src = "path/to/file.png";

    const file = fs.createReadStream(src)
    formData.append('file', file)

    const pinataMetadata = JSON.stringify({
        name: 'File name',
    });
    formData.append('pinataMetadata', pinataMetadata);

    const pinataOptions = JSON.stringify({
        cidVersion: 0,
    })
    formData.append('pinataOptions', pinataOptions);

    try {
        const res = await axios.post("https://api.pinata.cloud/pinning/pinFileToIPFS", formData, {
            maxBodyLength: 500,
            headers: {
                'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
                'Authorization': `Bearer ${JWT}`
            }
        });
        console.log(res.data);
    } catch (error) {
        console.log(error);
    }
}
 */


async function walletClient() {
    if (process.env.RPC_URL) {
        return createWalletClient({ transport: http("https://base-mainnet.g.alchemy.com/v2/47hMa2y_Ow1YLx3fAsb_VqRcbwrUd-Tx") });

    } else {
        throw Error("You need to provide RPC URL")
    }

}

async function publicClient() {
    if (process.env.RPC_URL) {
        return createPublicClient({
            chain: base,
            transport: http()

        });
    } else {
        throw Error("You need to provide RPC URL")
    }

}