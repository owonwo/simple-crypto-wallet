import Web3 from "web3";
import { ethers } from "ethers";
import { IProvider } from "@web3auth/base";

export default class RPC {
  public provider: IProvider | undefined;

  constructor(provider: IProvider | undefined) {
    this.provider = provider;
  }

  async getChainId() {
    const web3 = new Web3(this.provider);

    // Get the connected Chain's ID
    const chainId = await web3.eth.getChainId();

    return chainId.toString();
  }

  async getAccounts(): Promise<string> {
    const web3 = new Web3(this.provider);

    // Get user's Ethereum public address
    return (await web3.eth.getAccounts())[0];
  }

  async getBalance() {
    const web3 = new Web3(this.provider);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    return ethers.utils.formatEther(
      await web3.eth.getBalance(address), // Balance is in wei
    );
  }

  async sendTransaction({
    amount,
    destination,
  }: {
    destination: string;
    amount: string;
  }) {
    const web3 = new Web3(this.provider);

    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];
    const amountInWei = ethers.utils.parseEther(amount); // Convert from ether to wei

    // Submit transaction to the blockchain and wait for it to be mined
    return await web3.eth.sendTransaction({
      from: fromAddress,
      to: destination,
      value: amountInWei.toString(),
      // maxPriorityFeePerGas: "5000000000", // Max priority fee per gas
      // maxFeePerGas: "6000000000000", // Max fee per gas
    });
  }

  async getPrivateKey() {
    if (!this.provider) return Promise.reject("No provider set");

    return await this.provider.request({
      method: "eth_private_key",
    });
  }
}
