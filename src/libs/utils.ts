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

export function safeNum(a: number | string | undefined, fallback: number = 0) {
  if (!a) return fallback;
  return !Object.is(NaN, +a) ? parseFloat(a) : fallback;
}
