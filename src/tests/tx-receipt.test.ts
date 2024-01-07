import { makeTrxReceipt } from "../hooks/use-transaction.tsx";
import { expect, it, describe } from "vitest";

describe("should return correct transaction type", () => {
  it("should have TYPE of SEND", () => {
    const tx = makeTrxReceipt({ ownerAddress: "0x1" })({
      to: "0x0",
      from: "0x1",
    } as any);

    expect(tx.type).toBe("send");
  });

  it("should have TYPE of RECEIVE", () => {
    const tx = makeTrxReceipt({ ownerAddress: "0x1" })({
      to: "0x1",
      from: "0x0",
    } as any);

    expect(tx.type).toBe("receive");
  });

  it("should have TYPE of UNKNOWN", () => {
    const tx = makeTrxReceipt({ ownerAddress: "0x1" })({
      to: "0x10",
      from: "0x00",
    } as any);

    expect(tx.type).toBe("unknown");
  });
});
