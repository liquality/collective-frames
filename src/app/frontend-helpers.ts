import { ERC1155ABI, FIXED_PRICE_MINTER_ADDRESS } from "@/utils/constants";
import { ethers } from "ethers";


export const getDisplayValue = (number: string) => {
    const value = Number(number).toFixed(20)
    const [integerPart, decimalPart] = value.split('.');

    if (!decimalPart || decimalPart === '') {
        return integerPart;
    }

    // Remove trailing zeros from the decimal part
    const trimmedDecimalPart = decimalPart.replace(/0+$/, '');

    // If there are no non-zero digits left in the decimal part, return only the integer part
    if (trimmedDecimalPart === '') {
        return integerPart;
    }

    // Otherwise, return the number with the trimmed decimal part
    return `${integerPart}.${trimmedDecimalPart}`;
};


export function getProvider() {
    const provider = new ethers.JsonRpcProvider(
        "https://base-mainnet.g.alchemy.com/v2/47hMa2y_Ow1YLx3fAsb_VqRcbwrUd-Tx"
    );
    return provider;
}
export async function getETHMintPrice(
    tokenAddress: `0x${string}`
): Promise<bigint> {
    const mintFee = new ethers.Contract(tokenAddress, ERC1155ABI, getProvider());
    const mintFeeAmount: bigint = await mintFee.mintFee();
    return mintFeeAmount;
}

export const convertToEthPrice = async (priceInToken: string) => {
    const mintPriceWei = await getETHMintPrice(FIXED_PRICE_MINTER_ADDRESS);
    const additionalEther = ethers.parseEther(priceInToken); // Convert 0.00001 ether to wei
    const totalValueWei = mintPriceWei + additionalEther; // Add in wei for precision
    const totalValueEther = ethers.formatEther(totalValueWei); // Convert back to ether string if needed
    return totalValueEther;
};

