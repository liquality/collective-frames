import { TokenInfo } from "@/types";
import { ERC20_ABI, ETH_CURRENCY_ADDRESS } from "@/utils/constants";

export const erc20TokenData: TokenInfo[] =
    [
        {
            ticker: "DEGEN",
            contractAddress: "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed",
            decimal: 18,
            coinGeckoId: "degen"
        },
        {
            ticker: "USDC",
            contractAddress: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
            decimal: 6,
            coinGeckoId: "usd-coin"

        },
        {
            ticker: "ETH",
            contractAddress: ETH_CURRENCY_ADDRESS,
            decimal: 18,
            coinGeckoId: "eth"

        }
    ]


//All communities & their memecoins below:
/* 

• Mochi: 0xF6e932Ca12afa26665dC4dDE7e27be02A7c02e50
• Toshi: 0xAC1Bd2486aAf3B5C0fc3Fd868558b082a531B2B4
• TYBG or Base God: 0x0d97F261b1e88845184f678e2d1e7a98D9FD38dE
• Brett: 0x532f27101965dd16442E59d40670FaF5eBB142E4
• Normie: 0x7F12d13B34F5F4f0a9449c16Bcd42f0da47AF200
• mfer: 0xE3086852A4B125803C815a158249ae468A3254Ca
• DEGEN: 0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed
• doginme: 0x6921B130D297cc43754afba22e5EAc0FBf8Db75b
• Benji: 0xBC45647eA894030a4E9801Ec03479739FA2485F0 
• Higher: 0x0578d8A44db98B23BF096A382e016e29a5Ce0ffe


• Mochi
• Toshi
• TYBG or Thank You Base God 
• Brett
• Normie
• mfer
• DEGEN
• doginme 
• Bloo 
• Higher

*/
