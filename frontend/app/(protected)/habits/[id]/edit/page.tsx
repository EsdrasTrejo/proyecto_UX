'use client';

import {
  useEffect,
  useState,
} from 'react';

import Link from 'next/link';

import {
  useParams,
  useRouter,
} from 'next/navigation';

import axios from 'axios';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from '@mui/material';

import {
  ArrowBack,
} from '@mui/icons-material';

import HabitForm from '@/components/habit/HabitForm';

import {
  getHabitById,
  Habit,
} from '@/services/habits.service';

export default function EditHabitPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [habit, setHabit] =
    useState<Habit | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  useEffect(() => {
    const loadHabit = async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const data =
          await getHabitById(id);

        setHabit(data);
      } catch (error) {
        console.error(
          'Error al cargar hábito:',
          error,
        );

        if (
          axios.isAxiosError(error)
        ) {
          if (
            error.response?.status ===
            401
          ) {
            localStorage.removeItem(
              'access_token',
            );

            router.replace('/login');
            return;
          }

          if (
            error.response?.status ===
            404
          ) {
            setErrorMessage(
              'El hábito no existe o ya fue eliminado.',
            );
            return;
          }
        }

        setErrorMessage(
          'No se pudo cargar el hábito.',
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadHabit();
    }
  }, [id, router]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (errorMessage || !habit) {
    return (
      <Box>
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {errorMessage ||
            'No se encontró el hábito.'}
        </Alert>

        <Button
          component={Link}
          href="/habits"
          startIcon={<ArrowBack />}
        >
          Volver a hábitos
        </Button>
      </Box>
    );
  }

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
          Editar hábito
        </Typography>

        <Typography
          color="text.secondary"
        >
          Modifica la información de tu hábito.
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
        <HabitForm
          mode="edit"
          habitId={
            habit.id ??
            habit._id ??
            id
          }
          initialValues={{
            name: habit.name,

            description:
              habit.description ?? '',

            category:
              habit.category ?? '',

            frequency:
              habit.frequency,

            weeklyDay:
              habit.weeklyDay ??
              undefined,

            customDays:
              habit.customDays ?? [],

            priority:
              habit.priority,

            startDate:
              habit.startDate
                ? habit.startDate.slice(
                    0,
                    10,
                  )
                : '',

            endDate:
              habit.endDate
                ? habit.endDate.slice(
                    0,
                    10,
                  )
                : '',
          }}
        />
      </Paper>
    </Box>
  );
}