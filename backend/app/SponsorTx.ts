

export interface SponsorTxRequestBody {
    network: "testnet";
    txBytes: string;
    sender: string;
    allowedAddresses?: string[];
  }