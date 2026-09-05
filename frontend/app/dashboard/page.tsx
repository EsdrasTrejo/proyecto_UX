'use client';

import {
  Box,
  Button,
  Typography,
} from '@mui/material';

import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('access_token');

    router.push('/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',

        display: 'flex',
        flexDirection: 'column',

        alignItems: 'center',
        justifyContent: 'center',

        gap: 3,
      }}
    >
      <Typography variant="h3">
        Dashboard
      </Typography>

      <Typography color="text.secondary">
        Inicio de sesión exitoso.
      </Typography>

      <Button
        variant="outlined"
        onClick={handleLogout}
      >
        Cerrar sesión
      </Button>
    </Box>
  );
}