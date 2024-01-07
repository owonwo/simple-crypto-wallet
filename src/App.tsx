import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button.tsx";
import { LogInIcon, Wallet } from "lucide-react";
import { WalletProvider, useWallet } from "./contexts/wallet-provider.tsx";

import { UserInfo } from "./components/UserInfo.tsx";
import { SendToken } from "./components/SendToken.tsx";
import { TransactionHistory } from "./components/Transaction.tsx";

function App() {
  return (
    <WalletProvider>
      <div
        className={"bg-gray-800 text-white min-h-screen"}
        style={{ colorScheme: "dark" }}
      >
        <header
          className={"flex justify-between items-center container mx-auto py-2"}
        >
          <span className={"tracking-[4px] font-bold italic text-2xl"}>
            SHAPP
          </span>

          <AuthSection />
        </header>

        <main>
          <div className={"max-w-md container mx-auto"}>
            <SendToken />
            <TransactionHistory />
          </div>
        </main>
      </div>
      <Toaster />
    </WalletProvider>
  );
}

function AuthSection() {
  const { isConnected, login } = useWallet();

  return (
    <nav className={"flex space-x-4"}>
      {!isConnected ? (
        <>
          <Button variant="ghost" className={"flex space-x-2"}>
            <Wallet />
            <span>Create account</span>
          </Button>
          <Button className={"flex space-x-2"} onClick={login}>
            <LogInIcon />
            <span>Login</span>
          </Button>
        </>
      ) : (
        <UserInfo />
      )}
    </nav>
  );
}

export default App;
