"use client";

import { useCallback, useEffect, useState } from "react";

import Link from "next/link";


import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Checkbox,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import { Add, Refresh, CheckCircle, TodayOutlined } from "@mui/icons-material";

import {
  getTodayHabits,
  Habit,
  markHabitToday,
} from "@/services/habits.service";


import { getApiErrorMessage } from "@/services/api-error";

function getFrequencyLabel(frequency: Habit["frequency"]) {
  const labels = {
    DAILY: "Diario",
    WEEKLY: "Semanal",
    CUSTOM: "Personalizado",
  };

  return labels[frequency];
}

function getPriorityLabel(priority: Habit["priority"]) {
  const labels = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
  };

  return labels[priority];
}
interface TodayHabitsProps {
  onStatusChange?: () => void;
}

export default function TodayHabits({ onStatusChange }: TodayHabitsProps) {
  

  const [habits, setHabits] = useState<Habit[]>([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");
  const [updatingHabitId, setUpdatingHabitId] = useState<string | null>(null);

 const loadTodayHabits =
  useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage('');

      const data =
        await getTodayHabits();

      setHabits(data);
    } catch (error) {
      console.error(
        'Error al cargar hábitos de hoy:',
        error,
      );

      setErrorMessage(
        getApiErrorMessage(
          error,
          'No se pudieron cargar los hábitos de hoy.',
        ),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadTodayHabits();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadTodayHabits]);

  const handleToggleHabit = async (habit: Habit) => {
    const habitId = habit.id ?? habit._id;

    if (!habitId) {
      return;
    }

    const newCompletedValue = !habit.completedToday;

    try {
      setUpdatingHabitId(habitId);
      setErrorMessage("");

      await markHabitToday(habitId, newCompletedValue);

      setHabits((currentHabits) =>
        currentHabits.map((currentHabit) => {
          const currentId = currentHabit.id ?? currentHabit._id;

          if (currentId !== habitId) {
            return currentHabit;
          }

          return {
            ...currentHabit,

            completedToday: newCompletedValue,
          };
        }),
      );
      onStatusChange?.();
    } catch (error) {
      console.error("Error al actualizar hábito:", error);

      setErrorMessage(
        getApiErrorMessage(
          error,
          "No se pudo actualizar el estado del hábito.",
        ),
      );
    } finally {
      setUpdatingHabitId(null);
    }
  };


  return (
    <Paper
      elevation={0}
      sx={{
        p: {
          xs: 2.5,
          sm: 3,
        },

        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
      }}
    >
      <Stack
        direction={{
          xs: "column",
          sm: "row",
        }}
        spacing={2}
        sx={{
          mb: 3,
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
        }}
      >
        <Box>
          <Stack
            direction="row"
            spacing={1}
            sx={{
              alignItems: "center",
            }}
          >
            <TodayOutlined color="primary" />

            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
              }}
            >
              Hábitos de hoy
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Estos son los hábitos que te corresponden hoy.
          </Typography>
        </Box>

        <Button component={Link} href="/habits/new" startIcon={<Add />}>
          Nuevo hábito
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
              onClick={loadTodayHabits}
            >
              Reintentar
            </Button>
          }
        >
          {errorMessage}
        </Alert>
      )}

      {loading ? (
        <Box
          sx={{
            py: 6,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : habits.length === 0 ? (
        <Box
          sx={{
            py: 5,
            textAlign: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontWeight: 600,
            }}
          >
            No tienes hábitos para hoy
          </Typography>

          <Typography color="text.secondary">
            Tu agenda de hábitos está libre por hoy.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1.5}>
          {habits.map((habit) => (
            <Box
              key={habit.id ?? habit._id ?? habit.name}
              sx={{
                p: 2,

                border: "1px solid",
                borderColor: habit.completedToday ? "success.light" : "divider",

                borderRadius: 2,

                bgcolor: habit.completedToday
                  ? "success.50"
                  : "background.paper",

                transition: "all 0.2s ease",

                "&:hover": {
                  borderColor: habit.completedToday
                    ? "success.main"
                    : "primary.main",
                },
              }}
            >
              <Stack
                direction="row"
                spacing={2}
                sx={{ alignItems: "flex-start" }}
              >
                <Checkbox
                  checked={habit.completedToday ?? false}
                  disabled={updatingHabitId === (habit.id ?? habit._id)}
                  onChange={() => handleToggleHabit(habit)}
                  color="success"
                  sx={{
                    mt: -0.5,
                  }}
                />

                <Box
                  sx={{
                    flexGrow: 1,
                    minWidth: 0,
                  }}
                >
                  <Stack
                    direction={{
                      xs: "column",
                      sm: "row",
                    }}
                    spacing={1}
                    sx={{
                      justifyContent: "space-between",
                      alignItems: {
                        xs: "flex-start",
                        sm: "center",
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 700,
                        textDecoration: habit.completedToday
                          ? "line-through"
                          : "none",

                        color: habit.completedToday
                          ? "text.secondary"
                          : "text.primary",
                      }}
                    >
                      {habit.name}
                    </Typography>

                    <Chip
                      size="small"
                      icon={habit.completedToday ? <CheckCircle /> : undefined}
                      color={habit.completedToday ? "success" : "default"}
                      label={habit.completedToday ? "Completado" : "Pendiente"}
                    />
                  </Stack>

                  {habit.description && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        mt: 0.5,
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
                      mt: 1.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      size="small"
                      variant="outlined"
                      label={getFrequencyLabel(habit.frequency)}
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
                      variant="outlined"
                      label={`Prioridad: ${getPriorityLabel(habit.priority)}`}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      )}
    </Paper>
  );
}
