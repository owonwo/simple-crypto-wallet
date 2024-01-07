import { useWallet } from "../contexts/wallet-provider.tsx";
import { useAsyncLoader } from "./use-async-loader.ts";
import React from "react";
import { ethers } from "ethers";
import { toast } from "sonner";
import { addressEqual, isValidEthValue, safeStr } from "../libs/utils.ts";
import { parseInt } from "lodash";
import RPC from "../libs/web3RPC.ts";
import { TxItem, TxLog } from "../types/transaction.ts";

export function useSendTransaction() {
  const { sendTransaction, provider } = useWallet();
  const [gasFee, setGasFee] = React.useState<string | undefined>();
  const { loading, attachLoader } = useAsyncLoader({
    estimatingFee: false,
    default: false,
  });

  return {
    loading,
    gasFee,
    sendTransaction: attachLoader("default", sendTransaction),
    getEstimatedGasFee: attachLoader(
      "estimatingFee",
      async function (...params: Parameters<RPC["getEstimatedGasFee"]>) {
        if (!provider) return;
        if (!isValidEthValue(params[0].amount)) return;

        const rpc = new RPC(provider);
        await rpc
          .getEstimatedGasFee(...params)
          .then(setGasFee)
          .catch(() => {
            toast.error("Unable to get estimated fee");
          });
      },
    ),
  };
}

export function useTransactionHistory() {
  const wallet = useWallet();
  const { loading, attachLoader } = useAsyncLoader({ transactions: false });
  const address = wallet?.data?.address ?? "";

  const [transations, setTransactions] = React.useState<TxItem[]>([]);

  function getTransactions({
    signal,
    address,
  }: {
    signal?: AbortSignal;
    address: string;
  }) {
    const query = new URLSearchParams({
      module: "account",
      action: "txlist",
      address: address,
      fromBlock: "0",
      toBlock: "12878196",
      page: "1",
      sort: "desc",
      offset: "1000",
      apikey: import.meta.env.VITE_BLOCK_EXPLORER_API_KEY,
    });

    return fetch(`https://api-goerli.basescan.org/api?${query.toString()}`, {
      signal,
    });
  }

  React.useEffect(() => {
    if (!ethers.utils.isAddress(address)) return;

    const abort = new AbortController();
    // setTransactions
    const getTrx = attachLoader("transactions", getTransactions);
    getTrx({ signal: abort.signal, address })
      .then((res) => res.json())
      .then((res) => {
        const TrxReceipt = makeTrxReceipt({ ownerAddress: address });
        return setTransactions(res.result.map(TrxReceipt));
      })
      .catch(() => {
        toast.error("Error: Unable to fetch wallet transactions.");
      });

    return () => abort.abort();
  }, [address]);

  return {
    isLoading: loading.transactions,
    data: transations,
  };
}

export function makeTrxReceipt({ ownerAddress }: { ownerAddress: string }) {
  return function TrxReceiptFactory(data: TxLog): TxItem {
    return {
      ...data,
      get type() {
        if (addressEqual(safeStr(data.to), ownerAddress)) return "receive";
        if (addressEqual(safeStr(data.from), ownerAddress)) return "send";
        return "unknown";
      },
      get valueInEther() {
        return ethers.utils.formatEther(data.value);
      },
      get localTimestamp() {
        const timestamp = parseInt(data.timeStamp, 10);
        return new Date(timestamp * 1000).toLocaleString();
      },
    };
  };
}
