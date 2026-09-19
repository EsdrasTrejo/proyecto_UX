'use client';

import {
  Box,
  Paper,
  Typography,
} from '@mui/material';

import { LineChart } from '@mui/x-charts/LineChart';

import type {
  TrendResponse,
} from '@/services/statistics.service';

interface TrendChartProps {
  data: TrendResponse;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(
    'es-HN',
    {
      day: '2-digit',
      month: 'short',
    },
  ).format(new Date(date));
}

export default function TrendChart({
  data,
}: TrendChartProps) {
  const chartData = data.days.map(
    (day) => ({
      date: formatDate(day.date),
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
      <Typography
        variant="h6"
        sx={{ fontWeight: 700 }}
      >
        Tendencia de cumplimiento
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        Porcentaje de cumplimiento durante
        los últimos 30 días.
      </Typography>

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
              dataKey: 'date',
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
          height={320}
        />
      </Box>
    </Paper>
  );
}