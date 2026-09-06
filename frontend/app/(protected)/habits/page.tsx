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
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Snackbar,
  Stack,
  Typography,
} from '@mui/material';

import {
  Add,
  DeleteOutlined,
  EditOutlined,
  Refresh,
} from '@mui/icons-material';

import {
  deleteHabit,
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
  const [
  habitToDelete,
  setHabitToDelete,
] = useState<Habit | null>(null);

const [
  deleting,
  setDeleting,
] = useState(false);

const [
  successMessage,
  setSuccessMessage,
] = useState('');

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
  const handleDelete = async () => {
  if (!habitToDelete) {
    return;
  }

  const habitId =
    habitToDelete.id ??
    habitToDelete._id;

  if (!habitId) {
    setErrorMessage(
      'No se pudo identificar el hábito.',
    );

    setHabitToDelete(null);
    return;
  }

  try {
    setDeleting(true);
    setErrorMessage('');

    await deleteHabit(habitId);

    setHabits((currentHabits) =>
      currentHabits.filter(
        (habit) =>
          (habit.id ?? habit._id) !==
          habitId,
      ),
    );

    setSuccessMessage(
      'Hábito eliminado correctamente',
    );

    setHabitToDelete(null);
  } catch (error) {
    console.error(
      'Error al eliminar hábito:',
      error,
    );

    if (axios.isAxiosError(error)) {
      if (
        error.response?.status === 401
      ) {
        localStorage.removeItem(
          'access_token',
        );

        router.replace('/login');
        return;
      }

      if (
        error.response?.status === 404
      ) {
        setErrorMessage(
          'El hábito ya no existe.',
        );

        setHabitToDelete(null);
        return;
      }

      const message =
        error.response?.data?.message;

      if (typeof message === 'string') {
        setErrorMessage(message);
        return;
      }
    }

    setErrorMessage(
      'No se pudo eliminar el hábito. Inténtalo nuevamente.',
    );
  } finally {
    setDeleting(false);
  }
};

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
  <Stack
    direction={{
      xs: 'column',
      sm: 'row',
    }}
    spacing={1}
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

    <Button
      variant="outlined"
      color="error"
      startIcon={<DeleteOutlined />}
      onClick={() =>
        setHabitToDelete(habit)
      }
    >
      Eliminar
    </Button>
  </Stack>
  
)}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      )}
      <Dialog
  open={Boolean(habitToDelete)}
  onClose={() => {
    if (!deleting) {
      setHabitToDelete(null);
    }
  }}
>
  <DialogTitle>
    ¿Eliminar hábito?
  </DialogTitle>

  <DialogContent>
    <DialogContentText>
      {habitToDelete
        ? `Vas a eliminar "${habitToDelete.name}". Esta acción no se puede deshacer.`
        : ''}
    </DialogContentText>
  </DialogContent>

  <DialogActions
    sx={{
      px: 3,
      pb: 2,
    }}
  >
    <Button
      onClick={() =>
        setHabitToDelete(null)
      }
      disabled={deleting}
    >
      Cancelar
    </Button>

    <Button
      color="error"
      variant="contained"
      onClick={handleDelete}
      disabled={deleting}
      startIcon={
        deleting
          ? undefined
          : <DeleteOutlined />
      }
    >
      {deleting ? (
        <CircularProgress
          size={22}
          color="inherit"
        />
      ) : (
        'Eliminar'
      )}
    </Button>
  </DialogActions>
</Dialog>

<Snackbar
  open={Boolean(successMessage)}
  autoHideDuration={2500}
  onClose={() =>
    setSuccessMessage('')
  }
  anchorOrigin={{
    vertical: 'bottom',
    horizontal: 'center',
  }}
>
  <Alert
    severity="success"
    variant="filled"
    onClose={() =>
      setSuccessMessage('')
    }
  >
    {successMessage}
  </Alert>
</Snackbar>

    </Box>
  );
}