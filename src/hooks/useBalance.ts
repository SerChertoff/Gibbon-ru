/**
 * Хук useBalance - для получения баланса нативной валюты (ETH, MATIC и т.д.)
 * 
 * Использование:
 * const { balance, loading, error, refresh } = useBalance();
 */

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';
import { formatBalance } from '../utils/web3Utils';

interface UseBalanceReturn {
  balance: string;
  balanceRaw: ethers.BigNumber | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export const useBalance = (): UseBalanceReturn => {
  const { account, provider, isConnected } = useWeb3();
  const [balance, setBalance] = useState<string>('0.0000');
  const [balanceRaw, setBalanceRaw] = useState<ethers.BigNumber | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = async () => {
    if (!account || !provider || !isConnected) {
      setBalance('0.0000');
      setBalanceRaw(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const balanceWei = await provider.getBalance(account);
      setBalanceRaw(balanceWei);
      setBalance(formatBalance(balanceWei.toString()));
    } catch (err: any) {
      console.error('Ошибка получения баланса:', err);
      setError(err.message || 'Не удалось получить баланс');
      setBalance('0.0000');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBalance();

    // Обновляем баланс каждые 10 секунд
    const interval = setInterval(fetchBalance, 10000);

    return () => clearInterval(interval);
  }, [account, provider, isConnected]);

  return {
    balance,
    balanceRaw,
    loading,
    error,
    refresh: fetchBalance,
  };
};

