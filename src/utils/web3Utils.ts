// Вспомогательные функции для работы с Web3
import { ethers } from 'ethers';

/**
 * Форматирует адрес кошелька для отображения
 * Пример: 0x1234567890abcdef... -> 0x1234...cdef
 */
export const formatAddress = (address: string, startLength = 6, endLength = 4): string => {
  if (!address) return '';
  if (address.length <= startLength + endLength) return address;
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
};

/**
 * Форматирует баланс ETH/MATIC в читаемый вид
 * Конвертирует из Wei (наименьшая единица) в ETH
 */
export const formatBalance = (balance: string, decimals = 18, precision = 4): string => {
  try {
    const formatted = ethers.utils.formatUnits(balance, decimals);
    const num = parseFloat(formatted);
    return num.toFixed(precision);
  } catch (error) {
    return '0.0000';
  }
};

/**
 * Конвертирует строку в Wei (для отправки транзакций)
 */
export const parseUnits = (value: string, decimals = 18): ethers.BigNumber => {
  return ethers.utils.parseUnits(value, decimals);
};

/**
 * Проверяет, является ли строка валидным адресом Ethereum
 */
export const isValidAddress = (address: string): boolean => {
  return ethers.utils.isAddress(address);
};

/**
 * Получить ссылку на транзакцию в блок-эксплорере
 */
export const getExplorerTxUrl = (txHash: string, chainId: number): string => {
  const explorers: { [key: number]: string } = {
    1: 'https://etherscan.io/tx/',
    5: 'https://goerli.etherscan.io/tx/',
    11155111: 'https://sepolia.etherscan.io/tx/',
    137: 'https://polygonscan.com/tx/',
    80001: 'https://mumbai.polygonscan.com/tx/',
  };
  return `${explorers[chainId] || explorers[1]}${txHash}`;
};

/**
 * Получить ссылку на адрес в блок-эксплорере
 */
export const getExplorerAddressUrl = (address: string, chainId: number): string => {
  const explorers: { [key: number]: string } = {
    1: 'https://etherscan.io/address/',
    5: 'https://goerli.etherscan.io/address/',
    11155111: 'https://sepolia.etherscan.io/address/',
    137: 'https://polygonscan.com/address/',
    80001: 'https://mumbai.polygonscan.com/address/',
  };
  return `${explorers[chainId] || explorers[1]}${address}`;
};

