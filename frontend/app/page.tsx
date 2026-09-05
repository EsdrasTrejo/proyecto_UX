import { Box, Button, Typography } from '@mui/material';

export default function Home() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Typography variant="h3">
        Habit Forge
      </Typography>

      <Typography color="text.secondary">
        Build better habits, one day at a time.
      </Typography>

      <Button variant="contained">
        Get Started
      </Button>
    </Box>
  );
}