'use client';

import {
  Box,
  Chip,
  Paper,
  Stack,
  Typography,
} from '@mui/material';

import {
  EmojiEventsOutlined,
  LocalFireDepartmentOutlined,
} from '@mui/icons-material';

import type {
  StreaksResponse,
} from '@/services/statistics.service';

interface StreakCardsProps {
  data: StreaksResponse;
}

export default function StreakCards({
  data,
}: StreakCardsProps) {
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
        Rachas
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Constancia acumulada en tus hábitos.
      </Typography>

      <Box
        sx={{
          display: 'grid',

          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
          },

          gap: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            p: 2,

            bgcolor: 'background.default',
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <LocalFireDepartmentOutlined
              color="primary"
            />

            <Typography
              color="text.secondary"
              variant="body2"
            >
              Racha actual más larga
            </Typography>
          </Box>

          <Typography
            variant="h4"
            sx={{
              mt: 1,
              fontWeight: 700,
            }}
          >
            {data.longestCurrentStreak}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            días
          </Typography>
        </Box>

        <Box
          sx={{
            p: 2,

            bgcolor: 'background.default',
            borderRadius: 2,
          }}
        >
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: 'center',
            }}
          >
            <EmojiEventsOutlined
              color="primary"
            />

            <Typography
              color="text.secondary"
              variant="body2"
            >
              Mejor racha
            </Typography>
          </Stack>

          <Typography
            variant="h4"
            sx={{
              mt: 1,
              fontWeight: 700,
            }}
          >
            {data.bestStreak}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            días
          </Typography>
        </Box>
      </Box>

      {data.habits.length > 0 && (
        <Stack spacing={1}>
          {data.habits
            .slice(0, 5)
            .map((habit) => (
              <Stack
                key={habit.habitId}
                direction="row"
                spacing={2}
                sx={{
                  py: 1,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Box>
                  <Typography
                    sx={{ fontWeight: 600 }}
                  >
                    {habit.name}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Racha actual:{' '}
                    {habit.currentStreak}
                  </Typography>
                </Box>

                <Chip
                  size="small"
                  label={`Mejor: ${habit.bestStreak}`}
                />
              </Stack>
            ))}
        </Stack>
      )}
    </Paper>
  );
}