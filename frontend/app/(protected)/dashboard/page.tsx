import {
  Box,
  Paper,
  Typography,
} from '@mui/material';

export default function DashboardPage() {
  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          mb: 1,
          fontWeight: 700,
        }}
      >
        Dashboard
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mb: 4,
        }}
      >
        Aquí podrás visualizar el resumen de tus hábitos.
      </Typography>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 3,
        }}
      >
        <Typography>
          Dashboard básico de Habit Forge.
        </Typography>
      </Paper>
    </Box>
  );
}