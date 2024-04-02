import { createPublicClient, createWalletClient, http, type PublicClient, type WalletClient } from "viem";
import { create1155CreatorClient } from "@zoralabs/protocol-sdk";
import axios from "axios"
import { base, mainnet } from "viem/chains";



export async function create1155Contract(creator: `0x${string}`, tokenMetaDataUri: string, name: string) {

    const walletClient = createWalletClient({ transport: http("https://base-mainnet.g.alchemy.com/v2/47hMa2y_Ow1YLx3fAsb_VqRcbwrUd-Tx") });
    const publicClient = createPublicClient({
        chain: base,
        transport: http("https://base-mainnet.g.alchemy.com/v2/47hMa2y_Ow1YLx3fAsb_VqRcbwrUd-Tx")
    });

    console.log(publicClient, 'wats publicclient?')

    if (publicClient) {
        //TODO: we need to use Pinata here to upload the creators tokenmetadata

        // @ts-ignore
        const creatorClient = create1155CreatorClient({ publicClient });
        console.log(creatorClient, 'wats creatorclient?')

        const { request } = await creatorClient.createNew1155Token({
            contract: {
                name,
                uri: tokenMetaDataUri
            },
            tokenMetadataURI: tokenMetaDataUri,
            account: creator,
            mintToCreatorCount: 1,
        });
        console.log(console.log(request, 'wats request 1155?')
        )
        const { request: simulateRequest } = await publicClient.simulateContract(request);
        console.log(simulateRequest, 'what is simulated req?')
        const hash = await walletClient.writeContract(simulateRequest);
        console.log(hash, 'wat is hash?')
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        console.log(receipt, 'this should be nft reciept')
        return receipt;
    }

}
//Contract URI Format
type CollectionMetadata = {
    name?: string
    description?: string
    image?: string
    imageURI?: string

}

type TokenUriFormat = {
    "name": "Letter To My Scammer",
    "description": "",
    "image": "ipfs://bafkreih6yobhar5bjobwymzpuc27y3mbkosmz3acy5ouvf22iee3utjpcm"
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


