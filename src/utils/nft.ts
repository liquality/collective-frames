import { createPublicClient, createWalletClient, http, type PublicClient, type WalletClient } from "viem";
import { create1155CreatorClient } from "@zoralabs/protocol-sdk";
import { base } from "viem/chains";
import { mnemonicToAccount } from 'viem/accounts'


export async function create1155Contract(creator: `0x${string}`, tokenMetaDataUri: string, name: string) {
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

        const { request } = await creatorClient.createNew1155Token({
            contract: {
                name,
                uri: tokenMetaDataUri
            },
            tokenMetadataURI: tokenMetaDataUri,
            account: creator,
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


//0x777777C338d93e2C7adf08D102d45CA7CC4Ed021 //base
//0x777777C338d93e2C7adf08D102d45CA7CC4Ed021 //eth


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

/* 

{
  abi: [
    {
      stateMutability: 'nonpayable',
      type: 'constructor',
      inputs: [Array]
    },
    {
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [],
      name: 'acceptOwnership',
      outputs: []
    },
    {
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [],
      name: 'cancelOwnershipTransfer',
      outputs: []
    },
    {
      stateMutability: 'pure',
      type: 'function',
      inputs: [],
      name: 'contractName',
      outputs: [Array]
    },
    {
      stateMutability: 'pure',
      type: 'function',
      inputs: [],
      name: 'contractURI',
      outputs: [Array]
    },
    {
      stateMutability: 'pure',
      type: 'function',
      inputs: [],
      name: 'contractVersion',
      outputs: [Array]
    },
    {
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [Array],
      name: 'createContract',
      outputs: [Array]
    },
    {
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [Array],
      name: 'createContractDeterministic',
      outputs: [Array]
    },
    {
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'defaultMinters',
      outputs: [Array]
    },
    {
      stateMutability: 'view',
      type: 'function',
      inputs: [Array],
      name: 'deterministicContractAddress',
      outputs: [Array]
    },
    {
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'fixedPriceMinter',
      outputs: [Array]
    },
    {
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'implementation',
      outputs: [Array]
    },
    {
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [Array],
      name: 'initialize',
      outputs: []
    },
    {
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'merkleMinter',
      outputs: [Array]
    },
    {
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'owner',
      outputs: [Array]
    },
    {
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'pendingOwner',
      outputs: [Array]
    },
    {
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'proxiableUUID',
      outputs: [Array]
    },
    {
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'redeemMinterFactory',
      outputs: [Array]
    },
    {
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [],
      name: 'resignOwnership',
      outputs: []
    },
    {
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [Array],
      name: 'safeTransferOwnership',
      outputs: []
    },
    {
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [Array],
      name: 'transferOwnership',
      outputs: []
    },
    {
      stateMutability: 'nonpayable',
      type: 'function',
      inputs: [Array],
      name: 'upgradeTo',
      outputs: []
    },
    {
      stateMutability: 'payable',
      type: 'function',
      inputs: [Array],
      name: 'upgradeToAndCall',
      outputs: []
    },
    {
      stateMutability: 'view',
      type: 'function',
      inputs: [],
      name: 'zora1155Impl',
      outputs: [Array]
    },
    {
      type: 'event',
      anonymous: false,
      inputs: [Array],
      name: 'AdminChanged'
    },
    {
      type: 'event',
      anonymous: false,
      inputs: [Array],
      name: 'BeaconUpgraded'
    },
    {
      type: 'event',
      anonymous: false,
      inputs: [],
      name: 'FactorySetup'
    },
    {
      type: 'event',
      anonymous: false,
      inputs: [Array],
      name: 'Initialized'
    },
    {
      type: 'event',
      anonymous: false,
      inputs: [Array],
      name: 'OwnerCanceled'
    },
    {
      type: 'event',
      anonymous: false,
      inputs: [Array],
      name: 'OwnerPending'
    },
    {
      type: 'event',
      anonymous: false,
      inputs: [Array],
      name: 'OwnerUpdated'
    },
    {
      type: 'event',
      anonymous: false,
      inputs: [Array],
      name: 'SetupNewContract'
    },
    {
      type: 'event',
      anonymous: false,
      inputs: [Array],
      name: 'Upgraded'
    },
    {
      type: 'error',
      inputs: [],
      name: 'ADDRESS_DELEGATECALL_TO_NON_CONTRACT'
    },
    {
      type: 'error',
      inputs: [],
      name: 'ADDRESS_LOW_LEVEL_CALL_FAILED'
    },
    { type: 'error', inputs: [], name: 'Constructor_ImplCannotBeZero' },
    {
      type: 'error',
      inputs: [],
      name: 'ERC1967_NEW_IMPL_NOT_CONTRACT'
    },
    { type: 'error', inputs: [], name: 'ERC1967_NEW_IMPL_NOT_UUPS' },
    {
      type: 'error',
      inputs: [],
      name: 'ERC1967_UNSUPPORTED_PROXIABLEUUID'
    },
    {
      type: 'error',
      inputs: [],
      name: 'FUNCTION_MUST_BE_CALLED_THROUGH_ACTIVE_PROXY'
    },
    {
      type: 'error',
      inputs: [],
      name: 'FUNCTION_MUST_BE_CALLED_THROUGH_DELEGATECALL'
    },
    {
      type: 'error',
      inputs: [],
      name: 'INITIALIZABLE_CONTRACT_ALREADY_INITIALIZED'
    },
    {
      type: 'error',
      inputs: [],
      name: 'INITIALIZABLE_CONTRACT_IS_NOT_INITIALIZING'
    },
    { type: 'error', inputs: [], name: 'ONLY_OWNER' },
    { type: 'error', inputs: [], name: 'ONLY_PENDING_OWNER' },
    { type: 'error', inputs: [], name: 'OWNER_CANNOT_BE_ZERO_ADDRESS' },
    {
      type: 'error',
      inputs: [],
      name: 'UUPS_UPGRADEABLE_MUST_NOT_BE_CALLED_THROUGH_DELEGATECALL'
    },
    {
      type: 'error',
      inputs: [Array],
      name: 'UpgradeToMismatchedContractName'
    }
  ],
  address: '0x777777C338d93e2C7adf08D102d45CA7CC4Ed021',
  args: [
    'https://tnadjt2kpodqd17b.public.blob.vercel-storage.com/metadata_uri-hGN4CSx1W7kdVsijGOYa1a3lfErQx9',
    'johannas test name',
    {
      royaltyMintSchedule: 0,
      royaltyBPS: 1000,
      royaltyRecipient: '0x229ef326FE08C8b2423B786052D7E1a1AdDaD226'
    },
    '0x229ef326FE08C8b2423B786052D7E1a1AdDaD226',
    [
      '0xe72878b40000000000000000000000000000000000000000000000000000000000000000',
      '0xd258609a0000000000000000000000000000000000000000000000000000000000000040000000000000000000000000000000000000000000000000ffffffffffffffff000000000000000000000000000000000000000000000000000000000000006368747470733a2f2f746e61646a74326b706f6471643137622e7075626c69632e626c6f622e76657263656c2d73746f726167652e636f6d2f6d657461646174615f7572692d68474e344353783157376b645673696a474f59613161336c6645725178390000000000000000000000000000000000000000000000000000000000',
      '0x8ec998a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004e2516a2c207e84a1839755675dfd8ef6302f0a0000000000000000000000000000000000000000000000000000000000000004',
      '0xd904b94a000000000000000000000000000000000000000000000000000000000000000100000000000000000000000004e2516a2c207e84a1839755675dfd8ef6302f0a000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c434db7eee00000000000000000000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000ffffffffffffffff00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
      '0xc238d1ee000000000000000000000000229ef326fe08c8b2423b786052d7e1a1addad2260000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000800000000000000000000000000000000000000000000000000000000000000000'
    ]
  ],
  dataSuffix: undefined,
  functionName: 'createContractDeterministic',
  account: '0x229ef326FE08C8b2423B786052D7E1a1AdDaD226'
}
*/


