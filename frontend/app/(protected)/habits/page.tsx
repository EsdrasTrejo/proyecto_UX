'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import {
  Add,
  EditOutlined,
  Refresh,
} from '@mui/icons-material';

import {
  getHabits,
  Habit,
} from '@/services/habits.service';

function getFrequencyLabel(frequency: string) {
  const values: Record<string, string> = {
    DAILY: 'Diario',
    daily: 'Diario',

    WEEKLY: 'Semanal',
    weekly: 'Semanal',

    CUSTOM: 'Personalizada',
    custom: 'Personalizada',
  };

  return values[frequency] ?? frequency;
}

function getPriorityLabel(priority?: string | null) {
  if (!priority) {
    return null;
  }

  const values: Record<string, string> = {
    HIGH: 'Alta',
    high: 'Alta',

    MEDIUM: 'Media',
    medium: 'Media',

    LOW: 'Baja',
    low: 'Baja',
  };

  return values[priority] ?? priority;
}

export default function HabitsPage() {
  const router = useRouter();

  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const loadHabits = useCallback(async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const data = await getHabits();

      setHabits(data);
    } catch (error) {
      console.error(
        'Error al cargar hábitos:',
        error,
      );

      if (
        axios.isAxiosError(error) &&
        error.response?.status === 401
      ) {
        localStorage.removeItem('access_token');

        router.replace('/login');
        return;
      }

      setErrorMessage(
        'No se pudieron cargar tus hábitos. Inténtalo nuevamente.',
      );
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadHabits();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadHabits]);

  return (
    <Box>
      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        spacing={2}
        sx={{
          mb: 4,
          justifyContent: 'space-between',
          alignItems: {
            xs: 'stretch',
            sm: 'center',
          },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            component="h1"
            sx={{
              fontWeight: 700,
            }}
          >
            Mis hábitos
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Administra y da seguimiento a tus hábitos.
          </Typography>
        </Box>

        <Button
          component={Link}
          href="/habits/new"
          variant="contained"
          startIcon={<Add />}
        >
          Crear hábito
        </Button>
      </Stack>

      {errorMessage && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Refresh />}
              onClick={loadHabits}
            >
              Reintentar
            </Button>
          }
          sx={{
            mb: 3,
          }}
        >
          {errorMessage}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            minHeight: 250,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CircularProgress />
        </Box>
      ) : habits.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 4,
              sm: 6,
            },

            border: '1px dashed',
            borderColor: 'divider',
            borderRadius: 3,
            textAlign: 'center',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontWeight: 600,
            }}
          >
            Aún no tienes hábitos
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            Crea tu primer hábito y comienza a registrar tu progreso.
          </Typography>

          <Button
            component={Link}
            href="/habits/new"
            variant="contained"
            startIcon={<Add />}
          >
            Crear mi primer hábito
          </Button>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {habits.map((habit) => {
            const habitId =
              habit.id ??
              habit._id ??
              habit.name;

            const realHabitId =
              habit.id ?? habit._id;

            return (
              <Paper
                key={habitId}
                elevation={0}
                sx={{
                  p: {
                    xs: 2.5,
                    sm: 3,
                  },

                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 3,

                  transition:
                    'border-color 0.2s ease',

                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
              >
                <Stack
                  direction={{
                    xs: 'column',
                    sm: 'row',
                  }}
                  spacing={2}
                  sx={{
                    justifyContent: 'space-between',
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 0,
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{
                        mb: 1,
                        alignItems: 'center',
                        flexWrap: 'wrap',
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                        }}
                      >
                        {habit.name}
                      </Typography>

                      <Chip
                        label={
                          habit.active
                            ? 'Activo'
                            : 'Inactivo'
                        }
                        color={
                          habit.active
                            ? 'success'
                            : 'default'
                        }
                        size="small"
                      />
                    </Stack>

                    {habit.description && (
                      <Typography
                        color="text.secondary"
                        sx={{
                          mb: 2,
                        }}
                      >
                        {habit.description}
                      </Typography>
                    )}

                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{
                        flexWrap: 'wrap',
                      }}
                    >
                      <Chip
                        label={getFrequencyLabel(
                          habit.frequency,
                        )}
                        variant="outlined"
                        size="small"
                      />

                      {habit.category && (
                        <Chip
                          label={habit.category}
                          variant="outlined"
                          size="small"
                        />
                      )}

                      {habit.priority && (
                        <Chip
                          label={`Prioridad: ${
                            getPriorityLabel(
                              habit.priority,
                            )
                          }`}
                          variant="outlined"
                          size="small"
                        />
                      )}
                    </Stack>
                  </Box>

                  {realHabitId && (
                    <Box
                      sx={{
                        flexShrink: 0,
                      }}
                    >
                      <Button
                        component={Link}
                        href={`/habits/${realHabitId}/edit`}
                        variant="outlined"
                        startIcon={<EditOutlined />}
                      >
                        Editar
                      </Button>
                    </Box>
                  )}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
    </Box>
  );
}