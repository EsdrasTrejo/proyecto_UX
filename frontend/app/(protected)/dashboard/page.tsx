"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";


import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

import {
  Add,
  CheckCircleOutlined,
  DonutLargeOutlined,
  EventAvailableOutlined,
  FormatListBulleted,
  PendingActionsOutlined,
  Refresh,
  TaskAltOutlined,
} from "@mui/icons-material";

import {
  getStreaks,
  getSummary,
  getTrend,
  getWeeklyProgress,
  StreaksResponse,
  SummaryStatistics,
  TrendResponse,
  WeeklyProgress,
} from "@/services/statistics.service";
import {
  getApiErrorMessage,
} from '@/services/api-error';


import SummaryCard from "@/components/dashboard/SummaryCard";
import TodayHabits from "@/components/dashboard/TodayHabits";
import WeeklyChart from "@/components/dashboard/WeeklyChart";
import TrendChart from "@/components/dashboard/TrendChart";
import StreakCards from "@/components/dashboard/StreakCards";

export default function DashboardPage() {
  

  const [summary, setSummary] = useState<SummaryStatistics | null>(null);

  const [weekly, setWeekly] = useState<WeeklyProgress | null>(null);

  const [trend, setTrend] = useState<TrendResponse | null>(null);

  const [streaks, setStreaks] = useState<StreaksResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const refreshDashboard =
  useCallback(async () => {
    try {
      const [
        summaryData,
        weeklyData,
        trendData,
        streaksData,
      ] = await Promise.all([
        getSummary(),
        getWeeklyProgress(),
        getTrend(),
        getStreaks(),
      ]);

      setSummary(summaryData);
      setWeekly(weeklyData);
      setTrend(trendData);
      setStreaks(streaksData);
    } catch (error) {
      console.error(
        'Error actualizando dashboard:',
        error,
      );
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const [summaryData, weeklyData, trendData, streakData] =
        await Promise.all([
          getSummary(),
          getWeeklyProgress(),
          getTrend(),
          getStreaks(),
        ]);

      setSummary(summaryData);
      setWeekly(weeklyData);
      setTrend(trendData);
      setStreaks(streakData);
    } catch (error) {
      console.error("Error al cargar dashboard:", error);

       setErrorMessage(
    getApiErrorMessage(
      error,
      'No se pudo cargar la información del dashboard..',
    ),
  );} finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadDashboard]);

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: 400,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
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
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{
          mb: 4,
          justifyContent: "space-between",
          alignItems: {
            xs: "stretch",
            sm: "center",
          },
        }}
      >
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Dashboard
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Resumen de tu progreso y actividad.
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
          sx={{ mb: 3 }}
        >
          {errorMessage}
        </Alert>
      )}

      {summary && (
        <Box
          sx={{
            display: "grid",

            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
            },

            gap: 2,
            mb: 4,
          }}
        >
          <SummaryCard
            title="Total de hábitos"
            value={summary.totalHabits}
            icon={<FormatListBulleted />}
          />

          <SummaryCard
            title="Hábitos activos"
            value={summary.activeHabits}
            icon={<TaskAltOutlined />}
          />

          <SummaryCard
            title="Finalizados"
            value={summary.finishedHabits}
            icon={<EventAvailableOutlined />}
          />

          <SummaryCard
            title="Completados hoy"
            value={summary.completedToday}
            subtitle={`de ${summary.habitsToday} programados`}
            icon={<CheckCircleOutlined />}
          />

          <SummaryCard
            title="Pendientes hoy"
            value={summary.pendingToday}
            icon={<PendingActionsOutlined />}
          />

          <SummaryCard
            title="Cumplimiento hoy"
            value={`${summary.completionPercentage}%`}
            icon={<DonutLargeOutlined />}
          />
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        <TodayHabits onStatusChange={refreshDashboard} />
      </Box>

      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
        Estadísticas
      </Typography>

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            xl: "repeat(2, minmax(0, 1fr))",
          },

          gap: 3,
          mb: 3,
        }}
      >
        {weekly && <WeeklyChart data={weekly} />}

        {trend && <TrendChart data={trend} />}
      </Box>

      {streaks && <StreakCards data={streaks} />}
    </Box>
  );
}
