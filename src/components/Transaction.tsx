import { useTransactionHistory } from "../hooks/use-transaction";
import {
  ArrowDownLeft,
  ArrowUpRight,
  ExternalLink,
  FileQuestion,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { blockExplorerUrl, shortenAddress } from "../libs/utils.ts";
import { useWallet } from "../contexts/wallet-provider.tsx";

const icon_map = {
  send: ArrowUpRight,
  receive: ArrowDownLeft,
  unknown: FileQuestion,
} as const;

export function TransactionHistory() {
  const { isConnected } = useWallet();
  const { data, isLoading } = useTransactionHistory();

  return (
    <div
      className={cn(
        "flex items-center transition duration-200 flex-col w-full",
        {
          "opacity-0 translate-y-8 pointer-events-none": !isConnected,
          "opacity-100 translate-y-0": isConnected,
        },
      )}
    >
      <hgroup className={"flex w-full justify-between items-center "}>
        <h4 className={"font-semibold"}>All Transactions</h4>
        {isLoading ? (
          <div
            className={
              "p-2 border border-white/[0.04] inline-flex items-center space-x-2 rounded-full"
            }
          >
            <Loader2 className={"animate-spin"} />
            <span className={"pr-4"}>Loading</span>
          </div>
        ) : null}
      </hgroup>

      {!isLoading && data.length === 0 ? (
        <div className={"flex w-full py-8 flex-col space-y-2"}>
          <h6>No transactions</h6>
          <p className={"text-muted-foreground"}>
            You don't have any transaction yet. Send or receive ETH to see
            transactions logs
          </p>
        </div>
      ) : null}

      <ul className={"flex flex-col w-full space-y-2 mt-4"}>
        {data.map((tx) => {
          const { type } = tx;
          if (type === "unknown") return null;
          const Icon = icon_map[type];

          return (
            <li
              key={tx.hash}
              className={"block rounded-xl w-full bg-[#181f2a] p-3"}
            >
              <div className={"flex justify-between items-center space-x-3"}>
                <div className={"inline-flex items-center space-x-2 flex-1"}>
                  <div
                    className={cn(
                      "bg-gray-800 w-8 inline-flex justify-center rounded-full items-center aspect-square",
                      {
                        "text-cyan-500": type === "receive",
                        "text-orange-500": type === "send",
                      },
                    )}
                  >
                    <Icon />
                  </div>

                  <div className={"flex flex-col"}>
                    <div>
                      {type === "receive" ? (
                        <div>
                          <p>{shortenAddress(tx.from)}</p>
                        </div>
                      ) : type === "send" ? (
                        <div>
                          <p>{shortenAddress(tx.to)}</p>
                        </div>
                      ) : null}
                    </div>

                    <p className={"text-xs text-muted-foreground"}>
                      {tx.localTimestamp}
                    </p>
                  </div>
                </div>

                <p className={"font-bold font-numeric text-right"}>
                  {tx.valueInEther} ETH
                </p>

                <a
                  href={blockExplorerUrl(tx.hash)}
                  target={"_blank"}
                  title={"See in explorer"}
                  className={
                    "hover:bg-gray-800 w-8 text-muted-foreground inline-flex justify-center rounded-full items-center aspect-square"
                  }
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
