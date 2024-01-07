export type TxReceipt = {
  blockHash: string;
  blockNumber: number;
  contractAddress: string | null;
  cumulativeGasUsed: number;
  from: string;
  gasUsed: number;
  logsBloom: string;
  status: boolean;
  to: string;
  timeStamp: string;
  transactionHash: string;
  transactionIndex: number;
  type: string; // "0x0"
};

export type TxLog = {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  nonce: string;
  blockHash: string;
  transactionIndex: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  isError: string;
  txreceipt_status: "0" | "1";
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  gasUsed: string;
  confirmations: string;
  methodId: string;
  functionName: string;
};

export type TxItem = TxLog & {
  type: "send" | "receive" | "unknown";
  valueInEther: string;
  localTimestamp: string;
};
