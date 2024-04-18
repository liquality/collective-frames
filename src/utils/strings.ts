import { ethers } from "ethers";
import { ERC1155ABI, FIXED_PRICE_MINTER_ADDRESS } from "./constants";

export function slugify(str: string): string {
  return String(str)
    .normalize("NFKD") // split accented characters into their base characters and diacritical marks
    .replace(/[\u0300-\u036f]/g, "") // remove all the accents, which happen to be all in the \u03xx UNICODE block.
    .trim() // trim leading or trailing whitespace
    .toLowerCase() // convert to lowercase
    .replace(/[^a-z0-9 -]/g, "") // remove non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
}


export function shortenAddress(address: string) {
  const prefix = address.startsWith("0x") ? "0x" : "";
  const isTerra = address.startsWith("terra");
  return `${prefix}${address
    .replace("0x", "")
    .substring(0, prefix ? 4 : 6)}...${address.substring(
      isTerra ? address.length - 6 : address.length - 4
    )}`;
}


