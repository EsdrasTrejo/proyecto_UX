'use client';

import Link from 'next/link';

import {
  Box,
  Button,
  Paper,
  Typography,
} from '@mui/material';

import {
  ArrowBack,
} from '@mui/icons-material';

import HabitForm from '@/components/habit/HabitForm';

export default function NewHabitPage() {
  return (
    <Box
      sx={{
        maxWidth: 850,
        mx: 'auto',
      }}
    >
      <Button
        component={Link}
        href="/habits"
        startIcon={<ArrowBack />}
        sx={{
          mb: 2,
        }}
      >
        Volver a hábitos
      </Button>

      <Box
        sx={{
          mb: 4,
        }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            mb: 1,
            fontWeight: 700,
          }}
        >
          Crear hábito
        </Typography>

        <Typography
          color="text.secondary"
        >
          Define tu nuevo hábito y comienza a trabajar en él.
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
        <HabitForm />
      </Paper>
    </Box>
  );
}