'use client';

import {
  useCallback,
  useEffect,
  useMemo,
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
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import {
  ArrowBack,
  CheckCircleOutlined,
  EditOutlined,
  HistoryOutlined,
  RadioButtonUnchecked,
  Refresh,
} from '@mui/icons-material';

import {
  getHabitById,
  getHabitRecords,
  Habit,
  HabitRecord,
} from '@/services/habits.service';

import { authStorage } from '@/services/auth-storage';

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    'es-HN',
    {
      day: '2-digit',
      month: 'long',
      year: 'numeric',

      // Muy importante para nuestras fechas
      // normalizadas a medianoche UTC.
      timeZone: 'UTC',
    },
  ).format(new Date(date));
}

function getFrequencyLabel(
  frequency: Habit['frequency'],
) {
  const labels = {
    DAILY: 'Diario',
    WEEKLY: 'Semanal',
    CUSTOM: 'Personalizado',
  };

  return labels[frequency];
}

export default function HabitHistoryPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [habit, setHabit] =
    useState<Habit | null>(null);

  const [records, setRecords] =
    useState<HabitRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const loadHistory =
    useCallback(async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const [
          habitData,
          recordsData,
        ] = await Promise.all([
          getHabitById(id),
          getHabitRecords(id),
        ]);

        setHabit(habitData);

        // Ordenamos del registro más reciente
        // al más antiguo.
        setRecords(
          [...recordsData].sort(
            (a, b) =>
              new Date(b.date).getTime() -
              new Date(a.date).getTime(),
          ),
        );
      } catch (error) {
        console.error(
          'Error cargando historial:',
          error,
        );

        if (
          axios.isAxiosError(error)
        ) {
          if (
            error.response?.status ===
            401
          ) {
            authStorage.removeToken();

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
          'No se pudo cargar el historial del hábito.',
        );
      } finally {
        setLoading(false);
      }
    }, [id, router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadHistory();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadHistory]);

  const completedRecords =
    useMemo(
      () =>
        records.filter(
          (record) =>
            record.completed,
        ).length,
      [records],
    );

 

  const percentage =
    records.length === 0
      ? 0
      : Math.round(
          (completedRecords /
            records.length) *
            100,
        );

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
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
          <Button
            component={Link}
            href="/habits"
            startIcon={<ArrowBack />}
            size="small"
            sx={{ mb: 1 }}
          >
            Volver a hábitos
          </Button>

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <HistoryOutlined
              color="primary"
            />

            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: 700 }}
            >
              Historial
            </Typography>
          </Box>

          {habit && (
            <Typography
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {habit.name}
            </Typography>
          )}
        </Box>

        {habit && (
          <Button
            component={Link}
            href={`/habits/${id}/edit`}
            variant="outlined"
            startIcon={
              <EditOutlined />
            }
          >
            Editar hábito
          </Button>
        )}
      </Stack>

      {errorMessage && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Refresh />}
              onClick={loadHistory}
            >
              Reintentar
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {errorMessage}
        </Alert>
      )}

      {habit && (
        <Paper
          elevation={0}
          sx={{
            p: 3,

            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,

            mb: 3,
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            {habit.name}
          </Typography>

          {habit.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              {habit.description}
            </Typography>
          )}

          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ mt: 2, flexWrap: 'wrap' }}
          >
            <Chip
              size="small"
              label={getFrequencyLabel(
                habit.frequency,
              )}
            />

            {habit.category && (
              <Chip
                size="small"
                variant="outlined"
                label={habit.category}
              />
            )}

            <Chip
              size="small"
              color={
                habit.active
                  ? 'success'
                  : 'default'
              }
              label={
                habit.active
                  ? 'Activo'
                  : 'Inactivo'
              }
            />
          </Stack>
        </Paper>
      )}

      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(3, 1fr)',
          },

          gap: 2,
          mb: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Registros
          </Typography>

          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
          >
            {records.length}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Completados
          </Typography>

          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
          >
            {completedRecords}
          </Typography>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 3,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Cumplimiento registrado
          </Typography>

          <Typography
            variant="h4"
            sx={{ fontWeight: 700 }}
          >
            {percentage}%
          </Typography>
        </Paper>
      </Box>

      <Paper
        elevation={0}
        sx={{
          p: {
            xs: 2,
            sm: 3,
          },

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
          Registros de actividad
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Historial almacenado para este hábito.
        </Typography>

        {records.length === 0 ? (
          <Box
            sx={{
              py: 5,
              textAlign: 'center',
            }}
          >
            <HistoryOutlined
              sx={{
                fontSize: 45,
                color: 'text.disabled',
                mb: 1,
              }}
            />

            <Typography
              sx={{ fontWeight: 600 }}
            >
              No hay registros todavía
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5 }}
            >
              Los registros aparecerán cuando
              interactúes con este hábito.
            </Typography>
          </Box>
        ) : (
          <Stack spacing={1.5}>
            {records.map(
              (record) => (
                <Box
                  key={record.id}
                  sx={{
                    p: 2,

                    border: '1px solid',
                    borderColor:
                      'divider',

                    borderRadius: 2,
                  }}
                >
                  <Stack
                    direction={{
                      xs: 'column',
                      sm: 'row',
                    }}
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: {
                        xs: 'flex-start',
                        sm: 'center',
                      },
                    }}
                    spacing={1}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{ alignItems: 'center' }}
                    >
                      {record.completed ? (
                        <CheckCircleOutlined
                          color="success"
                        />
                      ) : (
                        <RadioButtonUnchecked
                          color="disabled"
                        />
                      )}

                      <Typography
                        sx={{ fontWeight: 600 }}
                      >
                        {formatDate(
                          record.date,
                        )}
                      </Typography>
                    </Stack>

                    <Chip
                      size="small"
                      color={
                        record.completed
                          ? 'success'
                          : 'default'
                      }
                      label={
                        record.completed
                          ? 'Completado'
                          : 'No completado'
                      }
                    />
                  </Stack>
                </Box>
              ),
            )}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}