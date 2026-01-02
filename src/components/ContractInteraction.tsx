/**
 * Компонент ContractInteraction - для взаимодействия со смарт-контрактами
 * 
 * Функциональность:
 * - Чтение данных из контракта (view функции)
 * - Отправка транзакций (write функции)
 * - Отображение статуса транзакций
 */

import React, { useState } from 'react';
import { ethers } from 'ethers';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  CircularProgress,
  Divider,
  Chip,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ReadMoreIcon from '@mui/icons-material/ReadMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { useWeb3 } from '../contexts/Web3Context';
import { useContract } from '../hooks/useContract';
import type { TransactionStatus } from '../types';
import { getExplorerTxUrl } from '../utils/web3Utils';
import { formatBalance } from '../utils/web3Utils';
import ERC20_ABI from '../contracts/abis/ERC20.json';

export const ContractInteraction: React.FC = () => {
  const { account, chainId, isConnected } = useWeb3();
  const [contractAddress, setContractAddress] = useState<string>('');
  const [tokenInfo, setTokenInfo] = useState<{
    name: string;
    symbol: string;
    decimals: number;
    totalSupply: string;
    balance: string;
  } | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [txStatus, setTxStatus] = useState<TransactionStatus>({ status: 'idle' });

  const contract = useContract(contractAddress || null, ERC20_ABI, false);

  const readTokenInfo = async () => {
    if (!contract || !account || !contractAddress) {
      alert('Введите адрес контракта и убедитесь, что кошелек подключен');
      return;
    }

    setLoading(true);
    setTokenInfo(null);

    try {
      const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
        contract.name(),
        contract.symbol(),
        contract.decimals(),
        contract.totalSupply(),
        contract.balanceOf(account),
      ]);

      setTokenInfo({
        name,
        symbol,
        decimals: decimals,
        totalSupply: formatBalance(totalSupply.toString(), decimals),
        balance: formatBalance(balance.toString(), decimals),
      });
    } catch (error: any) {
      console.error('Ошибка чтения контракта:', error);
      alert(`Ошибка: ${error.message || 'Не удалось прочитать данные контракта'}`);
    } finally {
      setLoading(false);
    }
  };

  const sendTransfer = async () => {
    if (!contract || !account || !recipientAddress || !transferAmount) {
      alert('Заполните все поля');
      return;
    }

    if (!contractAddress) {
      alert('Введите адрес контракта');
      return;
    }

    setLoading(true);
    setTxStatus({ status: 'pending', message: 'Подготовка транзакции...' });

    try {
      const decimals = tokenInfo?.decimals || 18;
      const amount = ethers.utils.parseUnits(transferAmount, decimals);

      const gasEstimate = await contract.estimateGas.transfer(recipientAddress, amount);
      console.log('Оценка газа:', gasEstimate.toString());

      setTxStatus({ status: 'pending', message: 'Отправка транзакции...' });
      const tx = await contract.transfer(recipientAddress, amount);

      setTxStatus({
        status: 'pending',
        message: 'Ожидание подтверждения...',
        hash: tx.hash,
      });

      const receipt = await tx.wait();

      setTxStatus({
        status: 'success',
        message: 'Транзакция успешно выполнена!',
        hash: receipt.transactionHash,
      });

      if (tokenInfo) {
        const newBalance = await contract.balanceOf(account);
        setTokenInfo({
          ...tokenInfo,
          balance: formatBalance(newBalance.toString(), tokenInfo.decimals),
        });
      }

      setRecipientAddress('');
      setTransferAmount('');
    } catch (error: any) {
      console.error('Ошибка отправки транзакции:', error);
      let errorMessage = 'Не удалось отправить транзакцию';

      if (error.code === 4001) {
        errorMessage = 'Транзакция отклонена пользователем';
      } else if (error.message) {
        errorMessage = error.message;
      }

      setTxStatus({
        status: 'error',
        message: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <Card sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
        <CardContent>
          <Alert severity="info">Подключите кошелек для взаимодействия с контрактами</Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', mt: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Взаимодействие со смарт-контрактом
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Введите адрес ERC-20 контракта для чтения данных и отправки транзакций
        </Typography>

        {/* Ввод адреса контракта */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            label="Адрес контракта (ERC-20)"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            placeholder="0x..."
            variant="outlined"
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={readTokenInfo}
            disabled={!contractAddress || loading}
            startIcon={loading ? <CircularProgress size={20} /> : <ReadMoreIcon />}
            fullWidth
          >
            Прочитать информацию о токене
          </Button>
        </Box>

        {/* Информация о токене */}
        {tokenInfo && (
          <Box sx={{ mb: 3 }}>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Информация о токене
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
              <Chip label={`Название: ${tokenInfo.name}`} variant="outlined" />
              <Chip label={`Символ: ${tokenInfo.symbol}`} variant="outlined" />
              <Chip label={`Всего: ${tokenInfo.totalSupply}`} variant="outlined" />
              <Chip
                label={`Ваш баланс: ${tokenInfo.balance} ${tokenInfo.symbol}`}
                color="primary"
                variant="outlined"
              />
            </Box>
          </Box>
        )}

        {/* Форма отправки транзакции */}
        {tokenInfo && (
          <Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" gutterBottom>
              Отправить токены
            </Typography>
            <TextField
              fullWidth
              label="Адрес получателя"
              value={recipientAddress}
              onChange={(e) => setRecipientAddress(e.target.value)}
              placeholder="0x..."
              variant="outlined"
              sx={{ mb: 2, mt: 2 }}
            />
            <TextField
              fullWidth
              label={`Количество (${tokenInfo.symbol})`}
              value={transferAmount}
              onChange={(e) => setTransferAmount(e.target.value)}
              type="number"
              variant="outlined"
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={sendTransfer}
              disabled={!recipientAddress || !transferAmount || loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
              fullWidth
            >
              {loading ? 'Отправка...' : 'Отправить'}
            </Button>
          </Box>
        )}

        {/* Статус транзакции */}
        {txStatus.status !== 'idle' && (
          <Box sx={{ mt: 3 }}>
            <Divider sx={{ mb: 2 }} />
            {txStatus.status === 'pending' && (
              <Alert
                severity="info"
                icon={<CircularProgress size={20} />}
                action={
                  txStatus.hash && chainId ? (
                    <Button
                      size="small"
                      href={getExplorerTxUrl(txStatus.hash, chainId)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Открыть в эксплорере
                    </Button>
                  ) : null
                }
              >
                {txStatus.message}
              </Alert>
            )}
            {txStatus.status === 'success' && (
              <Alert
                severity="success"
                icon={<CheckCircleIcon />}
                action={
                  txStatus.hash && chainId ? (
                    <Button
                      size="small"
                      href={getExplorerTxUrl(txStatus.hash, chainId)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Открыть в эксплорере
                    </Button>
                  ) : null
                }
              >
                {txStatus.message}
              </Alert>
            )}
            {txStatus.status === 'error' && (
              <Alert severity="error" icon={<ErrorIcon />}>
                {txStatus.message}
              </Alert>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
