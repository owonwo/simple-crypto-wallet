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
