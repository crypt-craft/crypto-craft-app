declare module '@tonconnect/sdk' {
  export interface TonConnectOptions {
    manifestUrl: string;
  }

  export enum CHAIN {
    MAINNET = 'mainnet',
    TESTNET = 'testnet'
  }

  export interface SendTransactionRequest {
    validUntil: number;
    messages: {
      address: string;
      amount: string;
      payload?: string;
      stateInit?: string;
    }[];
  }

  export default class TonConnect {
    constructor(options: TonConnectOptions);
    connect(): Promise<any>;
    disconnect(): Promise<void>;
    onStatusChange(callback: (wallet: any) => void): () => void;
    sendTransaction(transaction: SendTransactionRequest): Promise<any>;
  }
}
