import React, { useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider } from "@web3auth/base";
import RPC from "../web3RPC.ts";

type UserInfo = Awaited<ReturnType<Web3Auth["getUserInfo"]>>;

const Ctx = React.createContext<{
  isConnected: boolean;
  provider: IProvider | null;
  data: {
    balance: number;
    address: string | null;
    chainId: string | null;
    userData: UserInfo | null;
  };
  login: () => void;
  logout: () => void;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
  setChainId: React.Dispatch<React.SetStateAction<string>>;
  getUserInfo: () => Promise<UserInfo | null>;
}>({
  isConnected: false,
  provider: null,
  data: {
    address: null,
    balance: 0,
    chainId: null,
    userData: null,
  },
  login: () => {},
  logout: () => {},
  setAddress: () => {},
  setChainId: () => {},
  getUserInfo: () => Promise.reject("Unable to retrieve user information"),
});

export function useWallet() {
  return React.useContext(Ctx);
}

export function SessionProvider(props: { children?: React.ReactNode }) {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [address, setAddress] = useState("");
  const [balance, setBalance] = useState(0);
  const [chainId, setChainId] = useState("");
  const [userData, setUserData] = useState<UserInfo | Record<string, never>>(
    {},
  );

  const [isConnected, setConnected] = React.useState(false);

  React.useEffect(() => {
    const init = async () => {
      try {
        const web3auth = new Web3Auth({
          clientId: import.meta.env.VITE_WEB3AUTH_CLIENT,
          chainConfig: {
            chainNamespace: CHAIN_NAMESPACES.EIP155,
            chainId: "0x14A33",
            rpcTarget: "https://goerli.base.org",
          },
        });
        setWeb3auth(web3auth);
        await web3auth.initModal();
        const connectedStatus = web3auth.status === "connected";
        if (connectedStatus) {
          setProvider(web3auth.provider);
          setConnected(true);
        } else {
          // wait for user to click on the Connect button
        }
      } catch (error) {
        console.error(error);
      }
    };
    init();
  }, []);

  const handleLogin = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }

    const web3authProvider = await web3auth.connect();

    if (!web3authProvider) {
      throw new Error("Connection to wallet provider unsuccessful");
    }

    setProvider(web3auth.provider);
    setConnected(true);
  };

  const handleLogout = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }

    await web3auth.logout();
    setConnected(false);
    setProvider(null);
    setBalance(0);
    setAddress("");
    setUserData({});
    setChainId("");
  };

  const getUserInfo = async () => {
    if (!web3auth) {
      console.log("web3auth not initialized yet");
      return;
    }
    const user = await web3auth.getUserInfo();
    setUserData(user);
    return user as UserInfo;
  };

  const rpc = React.useMemo(() => new RPC(provider), [provider]);

  const getChainId = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const chainId: string = await rpc.getChainId();
    setChainId(chainId);
  };

  const getAccounts = async () => {
    const address = await rpc.getAccounts();
    setAddress(address);
  };

  const getBalance = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const balance = await rpc.getBalance();
    setBalance(balance as number);

    return balance;
  };

  const sendTransaction = async () => {
    if (!provider) {
      console.log("provider not initialized yet");
      return;
    }
    const receipt = await rpc.sendTransaction();
    console.log(receipt);
  };

  React.useEffect(() => {
    if (!provider) return;
    if (!isConnected) return;

    (async () => {
      debugger;
      await Promise.all([
        getUserInfo(),
        getAccounts(),
        getBalance(),
        getChainId(),
      ]).then(console.info);
    })();
  }, [provider, isConnected]);

  return (
    <Ctx.Provider
      value={{
        isConnected,
        provider,
        data: {
          address,
          balance,
          chainId,
          userData,
        },
        getUserInfo,
        setAddress,
        setChainId,
        login: handleLogin,
        logout: handleLogout,
        sendTransaction,
        getAccounts,
        getBalance,
        getChainId,
      }}
    >
      {props.children}
    </Ctx.Provider>
  );
}
