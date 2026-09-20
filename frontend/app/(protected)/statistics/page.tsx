'use client';

import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { useRouter } from 'next/navigation';
import axios from 'axios';

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';

import { Refresh } from '@mui/icons-material';

import {
  getMonthlyProgress,
  getStreaks,
  getTrend,
  getWeeklyProgress,
  MonthlyProgress,
  StreaksResponse,
  TrendResponse,
  WeeklyProgress,
} from '@/services/statistics.service';

import { authStorage } from '@/services/auth-storage';

import WeeklyChart from '@/components/dashboard/WeeklyChart';
import TrendChart from '@/components/dashboard/TrendChart';
import StreakCards from '@/components/dashboard/StreakCards';

import MonthlyChart from '@/components/statistics/MonthlyChart';

export default function StatisticsPage() {
  const router = useRouter();

  const [weekly, setWeekly] =
    useState<WeeklyProgress | null>(null);

  const [monthly, setMonthly] =
    useState<MonthlyProgress | null>(null);

  const [trend, setTrend] =
    useState<TrendResponse | null>(null);

  const [streaks, setStreaks] =
    useState<StreaksResponse | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const loadStatistics =
    useCallback(async () => {
      try {
        setLoading(true);
        setErrorMessage('');

        const [
          weeklyData,
          monthlyData,
          trendData,
          streakData,
        ] = await Promise.all([
          getWeeklyProgress(),
          getMonthlyProgress(),
          getTrend(),
          getStreaks(),
        ]);

        setWeekly(weeklyData);
        setMonthly(monthlyData);
        setTrend(trendData);
        setStreaks(streakData);
      } catch (error) {
        console.error(
          'Error cargando estadísticas:',
          error,
        );

        if (
          axios.isAxiosError(error) &&
          error.response?.status === 401
        ) {
          authStorage.removeToken();
          router.replace('/login');
          return;
        }

        setErrorMessage(
          'No se pudieron cargar las estadísticas.',
        );
      } finally {
        setLoading(false);
      }
    }, [router]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadStatistics();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadStatistics]);

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
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          component="h1"
          sx={{ fontWeight: 700 }}
        >
          Estadísticas
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Analiza tu constancia y cumplimiento
          a lo largo del tiempo.
        </Typography>
      </Box>

      {errorMessage && (
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              startIcon={<Refresh />}
              onClick={loadStatistics}
            >
              Reintentar
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {errorMessage}
        </Alert>
      )}

      <Stack spacing={3}>
        {weekly && (
          <WeeklyChart data={weekly} />
        )}

        {monthly && (
          <MonthlyChart data={monthly} />
        )}

        {trend && (
          <TrendChart data={trend} />
        )}

        {streaks && (
          <StreakCards data={streaks} />
        )}
      </Stack>
    </Box>
  );
}