// Глобальные TypeScript типы для проекта Gibbon

export interface NetworkInfo {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorer: string;
  currency: string;
  currencySymbol: string;
}

export interface ContractInfo {
  address: string;
  abi: any[];
  name: string;
}

export interface TransactionStatus {
  hash?: string;
  status: "idle" | "pending" | "success" | "error";
  message?: string;
}
