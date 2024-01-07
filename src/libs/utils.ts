import { ethers } from "ethers";

export const shortenAddress = (address: string, start = 4, end = 5) => {
  try {
    const addressArr = (address || "").split("");
    const firstPart = addressArr.splice(0, start).join("");
    const secondPart = addressArr
      .splice(addressArr.length - end, addressArr.length - 1)
      .join("");

    return `${firstPart}...${secondPart}`;
  } catch (error) {
    return "--";
  }
};

export function safeNum(
  value: number | string | undefined,
  fallback: number = 0,
) {
  if (!value) return fallback;
  return !Object.is(NaN, +value) ? parseFloat(String(value)) : fallback;
}

export function standardAmount(amount: string) {
  return safeNum(amount, 0).toFixed(8);
}

export function safeStr(value: string | undefined, fallback = ""): string {
  return typeof value !== "string" ? fallback : value;
}

export function addressEqual(a: string, b: string) {
  return a.toLowerCase() === b.toLowerCase();
}

export function blockExplorerUrl(txHash: string) {
  return import.meta.env.VITE_BLOCK_EXPLORER_URL + `/tx/${txHash}`;
}

export function isValidEthValue(value: string) {
  try {
    // Check if value is a valid non-negative integer
    ethers.utils.parseUnits(value.toString(), "ether");
    return true;
  } catch (error) {
    // @ts-expect-error Error can be any
    console.error("Invalid ETH value:", error.message);
    return false;
  }
}
