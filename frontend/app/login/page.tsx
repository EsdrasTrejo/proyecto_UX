import {
  Box,
  Typography,
} from '@mui/material';

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography variant="h4">
        Iniciar sesión
      </Typography>
    </Box>
  );
}