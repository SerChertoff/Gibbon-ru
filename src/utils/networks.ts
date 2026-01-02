// Конфигурация поддерживаемых блокчейн-сетей
import type { NetworkInfo } from '../types';

/**
 * Список поддерживаемых сетей в приложении Gibbon
 * Каждая сеть имеет свой chainId, RPC URL и блок-эксплорер
 */
export const SUPPORTED_NETWORKS: { [chainId: number]: NetworkInfo } = {
  // Ethereum Mainnet
  1: {
    name: 'Ethereum Mainnet',
    chainId: 1,
    rpcUrl: 'https://eth.llamarpc.com',
    explorer: 'https://etherscan.io',
    currency: 'ETH',
    currencySymbol: 'ETH',
  },
  // Goerli Testnet (устаревший, но оставим для примера)
  5: {
    name: 'Goerli Testnet',
    chainId: 5,
    rpcUrl: 'https://goerli.infura.io/v3/',
    explorer: 'https://goerli.etherscan.io',
    currency: 'ETH',
    currencySymbol: 'ETH',
  },
  // Sepolia Testnet (актуальный тестовый сеть)
  11155111: {
    name: 'Sepolia Testnet',
    chainId: 11155111,
    rpcUrl: 'https://sepolia.infura.io/v3/',
    explorer: 'https://sepolia.etherscan.io',
    currency: 'ETH',
    currencySymbol: 'ETH',
  },
  // Polygon Mainnet
  137: {
    name: 'Polygon Mainnet',
    chainId: 137,
    rpcUrl: 'https://polygon-rpc.com',
    explorer: 'https://polygonscan.com',
    currency: 'MATIC',
    currencySymbol: 'MATIC',
  },
  // Mumbai Testnet (Polygon)
  80001: {
    name: 'Mumbai Testnet',
    chainId: 80001,
    rpcUrl: 'https://rpc-mumbai.maticvigil.com',
    explorer: 'https://mumbai.polygonscan.com',
    currency: 'MATIC',
    currencySymbol: 'MATIC',
  },
};

/**
 * Получить информацию о сети по chainId
 */
export const getNetworkInfo = (chainId: number): NetworkInfo | null => {
  return SUPPORTED_NETWORKS[chainId] || null;
};

/**
 * Проверить, поддерживается ли сеть
 */
export const isNetworkSupported = (chainId: number): boolean => {
  return chainId in SUPPORTED_NETWORKS;
};

