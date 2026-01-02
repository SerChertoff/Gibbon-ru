/**
 * Компонент WalletConnector - для подключения и отображения информации о кошельке
 * 
 * Показывает:
 * - Кнопку подключения, если кошелек не подключен
 * - Адрес кошелька и баланс, если подключен
 * - Кнопку отключения
 */

import React, { useState } from 'react';
import {
  Button,
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Chip,
} from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LogoutIcon from '@mui/icons-material/Logout';
import { useWeb3 } from '../contexts/Web3Context';
import { useBalance } from '../hooks/useBalance';
import { formatAddress } from '../utils/web3Utils';
import { MetaMaskInstallDialog } from './MetaMaskInstallDialog';

export const WalletConnector: React.FC = () => {
  const {
    account,
    isConnected,
    isConnecting,
    connectWallet,
    disconnectWallet,
    networkInfo,
    isMetaMaskInstalled,
  } = useWeb3();
  const { balance, loading: balanceLoading } = useBalance();
  const [showInstallDialog, setShowInstallDialog] = useState(false);

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error: any) {
      if (error.message === 'METAMASK_NOT_INSTALLED' || !isMetaMaskInstalled) {
        setShowInstallDialog(true);
      }
    }
  };

  if (!isConnected) {
    return (
      <>
        <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
          <CardContent>
            <Box sx={{ textAlign: 'center' }}>
              <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Подключите кошелек
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Подключите MetaMask для начала работы с приложением Gibbon
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleConnect}
                disabled={isConnecting}
                startIcon={isConnecting ? <CircularProgress size={20} /> : <AccountBalanceWalletIcon />}
                fullWidth
              >
                {isConnecting ? 'Подключение...' : 'Подключить кошелек'}
              </Button>
            </Box>
          </CardContent>
        </Card>
        <MetaMaskInstallDialog
          open={showInstallDialog}
          onClose={() => setShowInstallDialog(false)}
        />
      </>
    );
  }

  return (
    <>
      <Card sx={{ maxWidth: 500, mx: 'auto', mt: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">Кошелек подключен</Typography>
            <Chip
              label={networkInfo?.name || 'Неизвестная сеть'}
              color={networkInfo ? 'success' : 'warning'}
              size="small"
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Адрес:
            </Typography>
            <Typography variant="body1" sx={{ fontFamily: 'monospace', wordBreak: 'break-all' }}>
              {account ? formatAddress(account) : 'Не подключен'}
            </Typography>
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Баланс:
            </Typography>
            <Typography variant="h6" color="primary">
              {balanceLoading ? (
                <CircularProgress size={20} />
              ) : (
                `${balance} ${networkInfo?.currencySymbol || 'ETH'}`
              )}
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="error"
            onClick={disconnectWallet}
            startIcon={<LogoutIcon />}
            fullWidth
          >
            Отключить кошелек
          </Button>
        </CardContent>
      </Card>

      <MetaMaskInstallDialog
        open={showInstallDialog}
        onClose={() => setShowInstallDialog(false)}
      />
    </>
  );
};
