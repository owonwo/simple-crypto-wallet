import {ethers} from "ethers";

export function createWallet() {
    console.log(ethers.Wallet.createRandom());
}


export function recoverWallet(seed_phrase: string) {
    console.log(ethers.Wallet.fromMnemonic(seed_phrase));
}

export function sendFunds(amountInEther = '0.01') {
    // network: using the Rinkeby testnet
    let network = 'goerli'
    // provider: Infura or Etherscan will be automatically chosen
    let provider = ethers.getDefaultProvider(network)
    const gasPrice = await provider.getGasPrice();

    // Sender private key:
    // correspondence address 0xb985d345c4bb8121cE2d18583b2a28e98D56d04b
    let privateKey = '0xbeec661400825442d8318724c550d895930d3012894beda4449c91f144ed71ea'
    // Create a wallet instance
    let wallet = new ethers.Wallet(privateKey, provider)
    // Receiver Address which receives Ether
    let receiverAddress = '0xF02c1c8e6114b1Dbe8937a39260b5b0a374432bB'
    // Ether amount to send
    // Create a transaction object
    let tx = {
        to: receiverAddress,
        // Convert currency unit from ether to wei
        value: ethers.utils.parseEther(amountInEther),
        gasPrice
    }
    // Send a transaction
    wallet.sendTransaction(tx)
    .then((txObj) => {
        console.log('txHash', txObj.hash)
        // => 0x9c172314a693b94853b49dc057cf1cb8e529f29ce0272f451eea8f5741aa9b58
        // A transaction result can be checked in a etherscan with a transaction hash which can be obtained here.
    }).catch(console.trace)
}
