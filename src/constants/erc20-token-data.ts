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
