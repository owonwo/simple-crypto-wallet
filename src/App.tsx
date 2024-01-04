import { Toaster } from "@/components/ui/sonner";
import { Test } from "./Web3Demo.tsx";
import { Button } from "@/components/ui/button.tsx";
import { LogInIcon, Wallet } from "lucide-react";
import { SessionProvider, useWallet } from "./contexts/session-provider.tsx";

import { UserInfo } from "./components/UserInfo.tsx";

function App() {
  return (
    <SessionProvider>
      <div
        className={"bg-gray-800 text-white min-h-screen"}
        style={{ colorScheme: "dark" }}
      >
        <header
          className={"flex justify-between items-center container mx-auto py-5"}
        >
          <span className={"tracking-[4px] font-bold italic text-2xl"}>
            SHAPP
          </span>

          <AuthSection />
        </header>

        <Test />
      </div>
      <Toaster />
    </SessionProvider>
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
          </Button>{" "}
        </>
      ) : (
        <UserInfo />
      )}
    </nav>
  );
}

export default App;
