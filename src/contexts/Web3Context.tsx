/**
 * Web3Context - Главный контекст для управления подключением к блокчейну
 * 
 * Этот контекст предоставляет:
 * - Подключение/отключение кошелька (MetaMask)
 * - Информацию о текущем аккаунте и сети
 * - Провайдер ethers.js для взаимодействия с блокчейном
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';
import type { NetworkInfo } from '../types';
import { getNetworkInfo, isNetworkSupported } from '../utils/networks';

// Объявляем глобальный тип для window.ethereum (MetaMask)
declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
      on: (event: string, callback: (...args: any[]) => void) => void;
      removeListener: (event: string, callback: (...args: any[]) => void) => void;
      isMetaMask?: boolean;
    };
  }
}

interface Web3ContextType {
  // Состояние подключения
  account: string | null;
  chainId: number | null;
  provider: ethers.providers.Web3Provider | null;
  networkInfo: NetworkInfo | null;
  isConnected: boolean;
  isConnecting: boolean;
  isMetaMaskInstalled: boolean;

  // Функции
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  switchNetwork: (chainId: number) => Promise<void>;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [chainId, setChainId] = useState<number | null>(null);
  const [provider, setProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Вычисляемые значения
  const networkInfo = chainId ? getNetworkInfo(chainId) : null;
  const isConnected = !!account && !!provider;
  const isMetaMaskInstalled = !!window.ethereum;

  /**
   * Подключение кошелька через MetaMask
   */
  const connectWallet = useCallback(async () => {
    // Проверяем, установлен ли MetaMask
    if (!window.ethereum) {
      // Возвращаем ошибку, которую обработает компонент
      throw new Error('METAMASK_NOT_INSTALLED');
    }

    setIsConnecting(true);
    try {
      // Запрашиваем доступ к аккаунтам
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error('Нет доступных аккаунтов');
      }

      // Создаем провайдер ethers.js
      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await web3Provider.getNetwork();
      const currentChainId = network.chainId;

      setAccount(accounts[0]);
      setChainId(currentChainId);
      setProvider(web3Provider);

      // Проверяем, поддерживается ли сеть
      if (!isNetworkSupported(currentChainId)) {
        console.warn(`Неподдерживаемая сеть: ${currentChainId}`);
      }
    } catch (error: any) {
      console.error('Ошибка подключения кошелька:', error);
      if (error.code === 4001) {
        alert('Подключение отклонено пользователем');
      } else {
        alert(`Ошибка подключения: ${error.message}`);
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  /**
   * Отключение кошелька
   */
  const disconnectWallet = useCallback(() => {
    setAccount(null);
    setChainId(null);
    setProvider(null);
  }, []);

  /**
   * Переключение сети
   */
  const switchNetwork = useCallback(async (targetChainId: number) => {
    if (!window.ethereum) {
      alert('MetaMask не установлен');
      return;
    }

    try {
      // Пытаемся переключить сеть
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${targetChainId.toString(16)}` }],
      });
    } catch (error: any) {
      // Если сеть не добавлена в MetaMask, добавляем её
      if (error.code === 4902) {
        const networkInfo = getNetworkInfo(targetChainId);
        if (networkInfo) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${targetChainId.toString(16)}`,
                  chainName: networkInfo.name,
                  rpcUrls: [networkInfo.rpcUrl],
                  nativeCurrency: {
                    name: networkInfo.currency,
                    symbol: networkInfo.currencySymbol,
                    decimals: 18,
                  },
                  blockExplorerUrls: [networkInfo.explorer],
                },
              ],
            });
          } catch (addError) {
            console.error('Ошибка добавления сети:', addError);
            alert('Не удалось добавить сеть в MetaMask');
          }
        }
      } else {
        console.error('Ошибка переключения сети:', error);
        alert(`Ошибка переключения сети: ${error.message}`);
      }
    }
  }, []);

  /**
   * Отслеживание изменений аккаунта в MetaMask
   */
  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // Пользователь отключил кошелек
        disconnectWallet();
      } else {
        // Пользователь переключил аккаунт
        setAccount(accounts[0]);
      }
    };

    const handleChainChanged = (chainIdHex: string) => {
      const newChainId = parseInt(chainIdHex, 16);
      setChainId(newChainId);
      // Перезагружаем страницу при смене сети (рекомендация MetaMask)
      window.location.reload();
    };

    // Подписываемся на события
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    // Проверяем, подключен ли уже кошелек
    const checkConnection = async () => {
      try {
        const accounts = await window.ethereum!.request({
          method: 'eth_accounts',
        });
        if (accounts.length > 0) {
          const web3Provider = new ethers.providers.Web3Provider(window.ethereum!);
          const network = await web3Provider.getNetwork();
          setAccount(accounts[0]);
          setChainId(network.chainId);
          setProvider(web3Provider);
        }
      } catch (error) {
        console.error('Ошибка проверки подключения:', error);
      }
    };

    checkConnection();

    // Очистка подписок при размонтировании
    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [disconnectWallet]);

  const value: Web3ContextType = {
    account,
    chainId,
    provider,
    networkInfo,
    isConnected,
    isConnecting,
    isMetaMaskInstalled,
    connectWallet,
    disconnectWallet,
    switchNetwork,
  };

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>;
};

/**
 * Хук для использования Web3Context
 * Используйте этот хук в компонентах для доступа к Web3 функциональности
 */
export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 должен использоваться внутри Web3Provider');
  }
  return context;
};

