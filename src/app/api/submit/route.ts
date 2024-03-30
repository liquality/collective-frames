import type { PublicClient, WalletClient } from "viem";
import { create1155CreatorClient } from "@zoralabs/protocol-sdk";


export async function POST(req: Request) {
    const body = await req.json();
    console.log(body, 'wat body?')



    return Response.json({ data: "HI" })
}

export async function create1155Contract({
    publicClient,
    walletClient,
    creator,
}: {
    publicClient: PublicClient;
    walletClient: WalletClient;
    creator: `0x${string}`
}) {
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