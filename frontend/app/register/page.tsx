import {
  Box,
  Container,
  Paper,
  Typography,
} from '@mui/material';

import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        py: {
          xs: 4,
          md: 6,
        },
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            textAlign: 'center',
            mb: 4,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 3,
              backgroundColor: 'primary.light',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2,
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            HF
          </Box>

          <Typography
            variant="h4"
            component="h1"
            sx={{
              mb: 1,
              fontWeight: 700,
            }}
          >
            Crear una cuenta
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
          >
            Comienza a construir mejores hábitos con Habit Forge.
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 3,
              sm: 4,
            },
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <RegisterForm />
        </Paper>
      </Container>
    </Box>
  );
}