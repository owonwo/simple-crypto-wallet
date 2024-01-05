import { useWallet } from "../contexts/wallet-provider.tsx";
import { shortenAddress } from "../libs/utils.ts";
import { Button } from "@/components/ui/button.tsx";
import { LogOutIcon } from "lucide-react";

export function UserInfo() {
  const wallet = useWallet();

  return (
    <div className={"flex space-x-2 items-center"}>
      <div
        className={
          "border border-white/[0.2] shadow-2xl rounded-full gap-x-2 items-center py-1 px-2 flex"
        }
      >
        <div
          className={
            "w-8 h-8 flex-shrink-0 rounded-full bg-gradient-to-bl from-cyan-400 to-blue-500 aspect-square"
          }
        />
        <div className={"flex-1 pr-3"}>
          <p className={"text-sm"}>{wallet.data.userData?.name}</p>
          <p className={"text-muted-foreground text-sm"}>
            {shortenAddress(wallet.data.address)}
          </p>
        </div>
      </div>
      <Button size={"icon"} className={"rounded-full"} onClick={wallet.logout}>
        <LogOutIcon />
      </Button>
    </div>
  );
}
