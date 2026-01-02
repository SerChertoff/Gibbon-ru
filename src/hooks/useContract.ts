/**
 * Хук useContract - для создания экземпляра контракта ethers.js
 * 
 * Использование:
 * const contract = useContract(CONTRACT_ADDRESS, CONTRACT_ABI);
 * 
 * Затем можно вызывать методы:
 * - contract.readMethod() - для чтения
 * - contract.writeMethod() - для записи (требует signer)
 */

import { useMemo } from 'react';
import { ethers } from 'ethers';
import { useWeb3 } from '../contexts/Web3Context';

/**
 * Создает экземпляр контракта для чтения и записи
 * @param address - Адрес смарт-контракта
 * @param abi - ABI (Application Binary Interface) контракта
 * @param readOnly - Если true, создает контракт только для чтения (без signer)
 */
export const useContract = (
  address: string | null | undefined,
  abi: any[],
  readOnly: boolean = false
): ethers.Contract | null => {
  const { provider, account, isConnected } = useWeb3();

  return useMemo(() => {
    if (!address || !provider || !abi || abi.length === 0) {
      return null;
    }

    try {
      if (readOnly || !isConnected || !account) {
        // Контракт только для чтения
        return new ethers.Contract(address, abi, provider);
      } else {
        // Контракт с возможностью записи (требует signer)
        const signer = provider.getSigner();
        return new ethers.Contract(address, abi, signer);
      }
    } catch (error) {
      console.error('Ошибка создания контракта:', error);
      return null;
    }
  }, [address, abi, provider, account, isConnected, readOnly]);
};

