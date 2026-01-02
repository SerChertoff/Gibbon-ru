/**
 * Компонент NetworkSwitcher - для переключения между блокчейн-сетями
 * 
 * Показывает текущую сеть и позволяет переключиться на другую
 */

import React from 'react';
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  Alert,
} from '@mui/material';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import { useWeb3 } from '../contexts/Web3Context';
import { SUPPORTED_NETWORKS } from '../utils/networks';

export const NetworkSwitcher: React.FC = () => {
  const { chainId, networkInfo, switchNetwork, isConnected } = useWeb3();

  const handleNetworkChange = async (event: any) => {
    const newChainId = event.target.value as number;
    if (newChainId !== chainId) {
      await switchNetwork(newChainId);
    }
  };

  if (!isConnected) {
    return (
      <Card sx={{ maxWidth: 500, mx: 'auto', mt: 2 }}>
        <CardContent>
          <Alert severity="info">Подключите кошелек для переключения сети</Alert>
        </CardContent>
      </Card>
    );
  }

  const isUnsupportedNetwork = chainId && !networkInfo;

  return (
    <Card sx={{ maxWidth: 500, mx: 'auto', mt: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <SwapHorizIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">Выбор сети</Typography>
        </Box>

        {isUnsupportedNetwork && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Текущая сеть (Chain ID: {chainId}) не поддерживается. Пожалуйста, переключитесь на
            поддерживаемую сеть.
          </Alert>
        )}

        <FormControl fullWidth>
          <InputLabel id="network-select-label">Блокчейн-сеть</InputLabel>
          <Select
            labelId="network-select-label"
            value={chainId || ''}
            onChange={handleNetworkChange}
            label="Блокчейн-сеть"
          >
            {Object.values(SUPPORTED_NETWORKS).map((network) => (
              <MenuItem key={network.chainId} value={network.chainId}>
                {network.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {networkInfo && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Текущая сеть: <strong>{networkInfo.name}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Валюта: <strong>{networkInfo.currencySymbol}</strong>
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Chain ID: <strong>{networkInfo.chainId}</strong>
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
