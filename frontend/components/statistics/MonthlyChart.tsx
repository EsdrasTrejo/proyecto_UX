'use client';

import {
  Box,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import { LineChart } from '@mui/x-charts/LineChart';

import type {
  MonthlyProgress,
} from '@/services/statistics.service';

interface MonthlyChartProps {
  data: MonthlyProgress;
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

function getMonthName(
  year: number,
  month: number,
) {
  return new Intl.DateTimeFormat(
    'es-HN',
    {
      month: 'long',
      year: 'numeric',
    },
  ).format(
    new Date(year, month - 1, 1),
  );
}

export default function MonthlyChart({
  data,
}: MonthlyChartProps) {
  const chartData = data.days.map(
    (day) => ({
      day: formatDay(day.date),
      percentage: day.percentage,
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
      <Stack
        direction={{
          xs: 'column',
          sm: 'row',
        }}
        spacing={1}
        sx={{
          mb: 2,
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700 }}
          >
            Progreso mensual
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {getMonthName(
              data.year,
              data.month,
            )}
          </Typography>
        </Box>

        <Box
          sx={{
            textAlign: {
              xs: 'left',
              sm: 'right',
            },
          }}
        >
          <Typography
            color="primary.main"
            sx={{ fontWeight: 700 }}
          >
            {data.percentage}%
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {data.completed} de{' '}
            {data.scheduled} completados
          </Typography>
        </Box>
      </Stack>

      <Box
        sx={{
          width: '100%',
          overflowX: 'auto',
        }}
      >
        <LineChart
          dataset={chartData}
          xAxis={[
            {
              dataKey: 'day',
              scaleType: 'point',
            },
          ]}
          yAxis={[
            {
              min: 0,
              max: 100,
            },
          ]}
          series={[
            {
              dataKey: 'percentage',
              label: 'Cumplimiento (%)',
              showMark: false,
            },
          ]}
          height={340}
        />
      </Box>
    </Paper>
  );
}