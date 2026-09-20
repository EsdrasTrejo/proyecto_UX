'use client';

import {
  Box,
  Paper,
  Typography,
} from '@mui/material';

import { BarChart } from '@mui/x-charts/BarChart';

import type {
  WeeklyProgress,
} from '@/services/statistics.service';

interface WeeklyChartProps {
  data: WeeklyProgress;
}

function formatDay(date: string) {
  return new Intl.DateTimeFormat(
    'es-HN',
    {
      day: '2-digit',
      timeZone: 'UTC',
    },
  ).format(new Date(date));
}
export default function WeeklyChart({
  data,
}: WeeklyChartProps) {
  const chartData = data.days.map(
    (day) => ({
      day: formatDay(day.date),
      scheduled: day.scheduled,
      completed: day.completed,
    }),
  );

  return (
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
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          flexDirection: {
            xs: 'column',
            sm: 'row',
          },
          justifyContent: 'space-between',
          gap: 1,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            Cumplimiento semanal
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            Hábitos programados y completados
            durante la semana.
          </Typography>
        </Box>

        <Typography
          color="primary.main"
          sx={{ fontWeight: 700 }}
        >
          {data.percentage}%
        </Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <BarChart
          dataset={chartData}
          xAxis={[
            {
              scaleType: 'band',
              dataKey: 'day',
            },
          ]}
          series={[
            {
              dataKey: 'scheduled',
              label: 'Programados',
            },
            {
              dataKey: 'completed',
              label: 'Completados',
            },
          ]}
          height={320}
        />
      </Box>
    </Paper>
  );
}