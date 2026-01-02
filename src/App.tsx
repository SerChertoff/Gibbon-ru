/**
 * Главный компонент приложения Gibbon
 * 
 * Gibbon - Web3 Dashboard для взаимодействия со смарт-контрактами
 * 
 * Функциональность:
 * - Подключение!!! кошелька (MetaMask)
 * - Переключение между блокчейн-сетями
 * - Просмотр балансов
 * - Взаимодействие со смарт-контрактами (чтение/запись)
 */

import { ThemeProvider, createTheme, CssBaseline, Container, Box, Typography } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Web3Provider } from './contexts/Web3Context';
import { WalletConnector } from './components/WalletConnector';
import { NetworkSwitcher } from './components/NetworkSwitcher';
import { ContractInteraction } from './components/ContractInteraction';

// Создаем современную тему Material-UI
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6366f1', // Индиго цвет
      light: '#818cf8',
      dark: '#4f46e5',
    },
    secondary: {
      main: '#8b5cf6', // Фиолетовый
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 700,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Web3Provider>
        <Box
          sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4,
          }}
        >
          <Container maxWidth="lg">
            {/* Заголовок приложения */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  color: 'white',
                  fontWeight: 800,
                  mb: 1,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                🦍 Gibbon
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontWeight: 400,
                }}
              >
                Web3 Dashboard для работы со смарт-контрактами
              </Typography>
            </Box>

            {/* Основной контент */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Подключение кошелька */}
              <WalletConnector />

              {/* Переключение сети */}
              <NetworkSwitcher />

              {/* Взаимодействие с контрактами */}
              <ContractInteraction />
            </Box>
          </Container>
        </Box>

        {/* Уведомления (Toast) */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </Web3Provider>
    </ThemeProvider>
  );
}

export default App;
