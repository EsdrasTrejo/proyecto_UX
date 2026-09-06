'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

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
  CalendarMonthOutlined,
  CheckCircleOutlined,
  ErrorOutlined,
  FormatListBulleted,
  Refresh,
} from '@mui/icons-material';

import {
  getHabits,
  Habit,
} from '@/services/habits.service';

function getFrequencyLabel(
  frequency: Habit['frequency'],
) {
  const labels = {
    DAILY: 'Diario',
    WEEKLY: 'Semanal',
    CUSTOM: 'Personalizada',
  };

  return labels[frequency];
}

export default function DashboardPage() {
  const router = useRouter();

  const [habits, setHabits] =
    useState<Habit[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const loadDashboard = useCallback(
    async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const data = await getHabits();

        setHabits(data);
      } catch (error) {
        console.error(
          'Error al cargar dashboard:',
          error,
        );

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          localStorage.removeItem(
            'access_token',
          );

          router.replace('/login');
          return;
        }

        setErrorMessage(
          'No se pudo cargar el resumen de tus hábitos.',
        );
      } finally {
        setLoading(false);
      }
    },
    [router],
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [loadDashboard]);

  const totalHabits =
    habits.length;

  const activeHabits =
    habits.filter(
      (habit) => habit.active,
    ).length;

  const inactiveHabits =
    habits.filter(
      (habit) => !habit.active,
    ).length;

  const highPriorityHabits =
    habits.filter(
      (habit) =>
        habit.priority === 'HIGH',
    ).length;

  const dailyHabits =
    habits.filter(
      (habit) =>
        habit.frequency === 'DAILY',
    ).length;

  const weeklyHabits =
    habits.filter(
      (habit) =>
        habit.frequency === 'WEEKLY',
    ).length;

  const customHabits =
    habits.filter(
      (habit) =>
        habit.frequency === 'CUSTOM',
    ).length;

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 350,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
            Dashboard
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Un resumen rápido de tus hábitos.
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
              onClick={loadDashboard}
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

      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
          },

          gap: 2,
          mb: 4,
        }}
      >
        <SummaryCard
          title="Total de hábitos"
          value={totalHabits}
          icon={<FormatListBulleted />}
        />

        <SummaryCard
          title="Hábitos activos"
          value={activeHabits}
          icon={<CheckCircleOutlined />}
        />

        <SummaryCard
          title="Hábitos inactivos"
          value={inactiveHabits}
          icon={<CalendarMonthOutlined />}
        />

        <SummaryCard
          title="Prioridad alta"
          value={highPriorityHabits}
          icon={<ErrorOutlined />}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr',
            lg: '0.8fr 1.2fr',
          },

          gap: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 0.5,
              fontWeight: 700,
            }}
          >
            Frecuencia
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
            }}
          >
            Cómo están distribuidos tus hábitos.
          </Typography>

          <Stack spacing={2}>
            <FrequencyRow
              label="Diarios"
              value={dailyHabits}
              total={totalHabits}
            />

            <FrequencyRow
              label="Semanales"
              value={weeklyHabits}
              total={totalHabits}
            />

            <FrequencyRow
              label="Personalizados"
              value={customHabits}
              total={totalHabits}
            />
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Stack
            direction="row"
            sx={{
              mb: 3,
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 700 }}
              >
                Tus hábitos
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Vista rápida de tus hábitos actuales.
              </Typography>
            </Box>

            <Button
              component={Link}
              href="/habits"
            >
              Ver todos
            </Button>
          </Stack>

          {habits.length === 0 ? (
            <Box
              sx={{
                py: 4,
                textAlign: 'center',
              }}
            >
              <Typography
                color="text.secondary"
                sx={{
                  mb: 2,
                }}
              >
                Todavía no tienes hábitos.
              </Typography>

              <Button
                component={Link}
                href="/habits/new"
                variant="contained"
                startIcon={<Add />}
              >
                Crear mi primer hábito
              </Button>
            </Box>
          ) : (
            <Stack spacing={1.5}>
              {habits
                .slice(0, 4)
                .map((habit) => (
                  <HabitSummary
                    key={
                      habit.id ??
                      habit._id ??
                      habit.name
                    }
                    habit={habit}
                  />
                ))}
            </Stack>
          )}
        </Paper>
      </Box>
    </Box>
  );
}

interface SummaryCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
}

function SummaryCard({
  title,
  value,
  icon,
}: SummaryCardProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,

        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 3,

        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
          }}
        >
          {value}
        </Typography>
      </Box>

      <Box
        sx={{
          width: 48,
          height: 48,

          borderRadius: 2,

          bgcolor: 'primary.light',
          color: 'primary.main',

          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {icon}
      </Box>
    </Paper>
  );
}

interface FrequencyRowProps {
  label: string;
  value: number;
  total: number;
}

function FrequencyRow({
  label,
  value,
  total,
}: FrequencyRowProps) {
  const percentage =
    total === 0
      ? 0
      : Math.round(
          (value / total) * 100,
        );

  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          mb: 0.75,
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="body2">
          {label}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {value} ({percentage}%)
        </Typography>
      </Stack>

      <Box
        sx={{
          height: 8,
          bgcolor: 'primary.light',
          borderRadius: 10,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            height: '100%',
            width: `${percentage}%`,
            bgcolor: 'primary.main',
            borderRadius: 10,
          }}
        />
      </Box>
    </Box>
  );
}

function HabitSummary({
  habit,
}: {
  habit: Habit;
}) {
  return (
    <Box
      sx={{
        py: 1.5,
        px: 2,

        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
      }}
    >
      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        spacing={1}
        sx={{
          justifyContent: 'space-between',
          alignItems: {
            xs: 'flex-start',
            sm: 'center',
          },
        }}
      >
        <Box>
          <Typography
            sx={{ fontWeight: 600 }}
          >
            {habit.name}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {getFrequencyLabel(
              habit.frequency,
            )}
          </Typography>
        </Box>

        <Chip
          label={
            habit.active
              ? 'Activo'
              : 'Inactivo'
          }
          size="small"
          color={
            habit.active
              ? 'success'
              : 'default'
          }
        />
      </Stack>
    </Box>
  );
}