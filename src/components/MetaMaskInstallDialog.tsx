/**
 * Компонент MetaMaskInstallDialog - красивое модальное окно для установки MetaMask
 * 
 * Показывается, когда пользователь пытается подключить кошелек, но MetaMask не установлен
 */

import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

interface MetaMaskInstallDialogProps {
  open: boolean;
  onClose: () => void;
}

export const MetaMaskInstallDialog: React.FC<MetaMaskInstallDialogProps> = ({ open, onClose }) => {
  const handleDownload = () => {
    window.open('https://metamask.io/download/', '_blank', 'noopener,noreferrer');
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        },
      }}
    >
      <DialogTitle sx={{ color: 'white', textAlign: 'center', pt: 3 }}>
        <Typography variant="h5" component="div" fontWeight={700}>
          MetaMask не установлен
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ color: 'white' }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Для работы с приложением Gibbon необходимо установить кошелек MetaMask.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, p: 2, mb: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Что такое MetaMask?
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            MetaMask — это криптовалютный кошелек и шлюз в блокчейн-приложения. Он позволяет
            безопасно хранить криптовалюту и взаимодействовать с децентрализованными приложениями.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, p: 2 }}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom>
            Как установить:
          </Typography>
          <List dense sx={{ py: 0 }}>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Перейдите на официальный сайт MetaMask"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Установите расширение для вашего браузера"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Создайте кошелек или импортируйте существующий"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
            <ListItem sx={{ px: 0 }}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary="Вернитесь на эту страницу и подключите кошелек"
                primaryTypographyProps={{ variant: 'body2' }}
              />
            </ListItem>
          </List>
        </Box>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Link
            href="https://metamask.io/download/"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: 'white',
              textDecoration: 'underline',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              '&:hover': { opacity: 0.8 },
            }}
          >
            Официальный сайт MetaMask
            <OpenInNewIcon sx={{ fontSize: 16 }} />
          </Link>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} sx={{ color: 'white', mr: 1 }}>
          Закрыть
        </Button>
        <Button
          variant="contained"
          onClick={handleDownload}
          startIcon={<DownloadIcon />}
          sx={{
            bgcolor: 'white',
            color: '#667eea',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 0.9)',
            },
          }}
        >
          Скачать MetaMask
        </Button>
      </DialogActions>
    </Dialog>
  );
};

