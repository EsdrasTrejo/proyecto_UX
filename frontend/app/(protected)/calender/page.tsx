"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import {
  ArrowBackIosNew,
  ArrowForwardIos,
  CalendarMonthOutlined,
  Refresh,
} from "@mui/icons-material";

import { getHabits, Habit, HabitDay } from "@/services/habits.service";

import { getApiErrorMessage } from "@/services/api-error";

const DAY_NAMES = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

const HABIT_DAYS: HabitDay[] = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];

function normalizeCalendarDate(date: Date) {
  return new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()),
  );
}

function normalizeHabitDate(value: string) {
  const date = new Date(value);

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}

function getMonday(date: Date) {
  const normalized = normalizeCalendarDate(date);

  const day = normalized.getUTCDay();

  const difference = day === 0 ? -6 : 1 - day;

  normalized.setUTCDate(normalized.getUTCDate() + difference);

  return normalized;
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);

  result.setUTCDate(result.getUTCDate() + amount);

  return result;
}

function isSameDay(first: Date, second: Date) {
  return (
    first.getUTCFullYear() === second.getUTCFullYear() &&
    first.getUTCMonth() === second.getUTCMonth() &&
    first.getUTCDate() === second.getUTCDate()
  );
}

function isHabitScheduled(habit: Habit, date: Date) {
  if (!habit.active) {
    return false;
  }

  const startDate = normalizeHabitDate(habit.startDate);

  if (date < startDate) {
    return false;
  }

  if (habit.endDate) {
    const endDate = normalizeHabitDate(habit.endDate);

    if (date > endDate) {
      return false;
    }
  }

  const habitDay = HABIT_DAYS[date.getUTCDay()];

  if (habit.frequency === "DAILY") {
    return true;
  }

  if (habit.frequency === "WEEKLY") {
    return habit.weeklyDay === habitDay;
  }

  if (habit.frequency === "CUSTOM") {
    return habit.customDays?.includes(habitDay) ?? false;
  }

  return false;
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat("es-HN", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

function formatWeekRange(monday: Date) {
  const sunday = addDays(monday, 6);

  const start = new Intl.DateTimeFormat("es-HN", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(monday);

  const end = new Intl.DateTimeFormat("es-HN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(sunday);

  return `${start} - ${end}`;
}

function getPriorityLabel(priority: Habit["priority"]) {
  const labels = {
    LOW: "Baja",
    MEDIUM: "Media",
    HIGH: "Alta",
  };

  return labels[priority];
}
const CATEGORY_COLORS: Record<string, string> = {
  Salud: "#2e7d32",
  Estudio: "#1565c0",
  Ejercicio: "#ef6c00",
  Nutrición: "#00897b",
  Trabajo: "#6a1b9a",
  Finanzas: "#455a64",
  Lectura: "#5d4037",
  Bienestar: "#c2185b",
};

function getCategoryColor(category?: string | null) {
  if (!category) {
    return "#607d8b";
  }

  return CATEGORY_COLORS[category] ?? "#7e57c2";
}

export default function CalendarPage() {
  const [habits, setHabits] = useState<Habit[]>([]);

  const [loading, setLoading] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  const [weekOffset, setWeekOffset] = useState(0);

  const today = useMemo(() => normalizeCalendarDate(new Date()), []);

  const currentMonday = useMemo(() => {
    const monday = getMonday(new Date());

    monday.setUTCDate(monday.getUTCDate() + weekOffset * 7);

    return monday;
  }, [weekOffset]);

  const weekDays = useMemo(
    () =>
      Array.from({ length: 7 }, (_, index) => addDays(currentMonday, index)),
    [currentMonday],
  );

  const loadHabits = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMessage("");

      const data = await getHabits();

      setHabits(data);
    } catch (error) {
      console.error("Error cargando calendario:", error);

      setErrorMessage(
        getApiErrorMessage(error, "No se pudo cargar el calendario."),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadHabits();
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loadHabits]);

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
            xs: "flex-start",
            sm: "center",
          },
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <CalendarMonthOutlined color="primary" />

            <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
              Calendario
            </Typography>
          </Stack>

          <Typography color="text.secondary" sx={{ mt: 0.5 }}>
            Consulta tus hábitos programados durante la semana.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          onClick={() => setWeekOffset(0)}
          disabled={weekOffset === 0}
        >
          Semana actual
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
          sx={{ mb: 3 }}
        >
          {errorMessage}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          px: 2,
          py: 1.5,

          borderRadius: 3,

          background:
            "linear-gradient(90deg, rgba(0,137,104,0.06), rgba(103,58,183,0.06))",

          border: "1px solid",

          borderColor: "divider",

          mb: 3,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <IconButton
            onClick={() => setWeekOffset((current) => current - 1)}
            aria-label="Semana anterior"
          >
            <ArrowBackIosNew />
          </IconButton>

          <Box
            sx={{
              textAlign: "center",
            }}
          >
            <Typography
              sx={{
                fontWeight: 700,
              }}
              variant="h6"
            >
              {formatWeekRange(currentMonday)}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {weekOffset === 0
                ? "Semana actual"
                : weekOffset < 0
                  ? "Semana anterior"
                  : "Semana siguiente"}
            </Typography>
          </Box>

          <IconButton
            onClick={() => setWeekOffset((current) => current + 1)}
            aria-label="Semana siguiente"
          >
            <ArrowForwardIos />
          </IconButton>
        </Stack>
      </Paper>

      <Box
        sx={{
          display: "grid",

          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(7, minmax(0, 1fr))",
          },

          gap: 2,
        }}
      >
        {weekDays.map((date) => {
          const dayHabits = habits.filter((habit) =>
            isHabitScheduled(habit, date),
          );

          const isToday = isSameDay(date, today);
          const isWeekend = date.getUTCDay() === 0 || date.getUTCDay() === 6;

          return (
            <Paper
              key={date.toISOString()}
              elevation={0}
              sx={{
                minHeight: 390,
                overflow: "hidden",

                border: "1px solid",

                borderColor: isToday ? "primary.main" : "divider",

                borderRadius: 4,

                bgcolor: isWeekend
                  ? "rgba(126, 87, 194, 0.025)"
                  : "background.paper",

                boxShadow: isToday
                  ? "0 10px 28px rgba(0, 137, 104, 0.14)"
                  : "0 4px 14px rgba(0,0,0,0.05)",

                transition: "transform 0.2s ease, box-shadow 0.2s ease",

                "&:hover": {
                  transform: "translateY(-3px)",

                  boxShadow: "0 8px 22px rgba(0,0,0,0.08)",
                },
              }}
            >
              <Stack
                direction="row"
                sx={{
                  px: 2,
                  py: 1.5,
                  justifyContent: "space-between",
                  alignItems: "center",

                  bgcolor: isToday
                    ? "primary.main"
                    : isWeekend
                      ? "rgba(126, 87, 194, 0.08)"
                      : "rgba(0, 0, 0, 0.035)",

                  color: isToday ? "primary.contrastText" : "text.primary",

                  borderBottom: "1px solid",
                  borderColor: "divider",
                }}
              >
                <Box>
                  <Typography sx={{ fontWeight: 800, fontSize: "0.95rem" }}>
                    {DAY_NAMES[date.getUTCDay()]}
                  </Typography>

                  <Typography
                    variant="caption"
                    sx={{
                      opacity: isToday ? 0.85 : 0.65,
                    }}
                  >
                    {formatShortDate(date)}
                  </Typography>
                </Box>

                <Stack spacing={0.5} sx={{ alignItems: "flex-end" }}>
                  {isToday && (
                    <Chip
                      label="Hoy"
                      size="small"
                      sx={{
                        bgcolor: "background.paper",

                        color: "primary.main",

                        fontWeight: 700,
                      }}
                    />
                  )}

                  <Typography
                    variant="caption"
                    sx={{
                      opacity: isToday ? 0.9 : 0.6,
                    }}
                  >
                    {dayHabits.length}{" "}
                    {dayHabits.length === 1 ? "hábito" : "hábitos"}
                  </Typography>
                </Stack>
              </Stack>

              {dayHabits.length === 0 ? (
                <Box
                  sx={{
                    minHeight: 260,

                    display: "flex",
                    flexDirection: "column",

                    justifyContent: "center",
                    alignItems: "center",

                    textAlign: "center",

                    color: "text.secondary",

                    px: 2,
                  }}
                >
                  <CalendarMonthOutlined
                    sx={{
                      fontSize: 32,
                      opacity: 0.25,
                      mb: 1,
                    }}
                  />

                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    Día libre
                  </Typography>

                  <Typography variant="caption">
                    No tienes hábitos programados.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.25}>
                  {dayHabits.map((habit) => {
                    const categoryColor = getCategoryColor(habit.category);
                    return (
                      <Box
                        key={habit.id ?? habit._id}
                        sx={{
                          position: "relative",

                          p: 1.5,
                          pl: 2,

                          borderRadius: 2.5,

                          border: "1px solid",

                          borderColor: `${categoryColor}40`,

                          bgcolor: `${categoryColor}0D`,

                          overflow: "hidden",

                          transition:
                            "transform 0.15s ease, box-shadow 0.15s ease",

                          "&:hover": {
                            transform: "translateY(-2px)",

                            boxShadow: "0 5px 14px rgba(0,0,0,0.08)",
                          },

                          "&::before": {
                            content: '""',

                            position: "absolute",

                            left: 0,
                            top: 0,
                            bottom: 0,

                            width: 5,

                            backgroundColor: categoryColor,
                          },
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {habit.name}
                        </Typography>

                        <Stack
                          direction="row"
                          spacing={0.5}
                          useFlexGap
                          sx={{
                            mt: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          {habit.category && (
                            <Chip
                              size="small"
                              variant="outlined"
                              label={habit.category}
                              sx={{
                                color: categoryColor,

                                borderColor: categoryColor,

                                bgcolor: `${categoryColor}14`,

                                fontWeight: 600,
                              }}
                            />
                          )}

                          <Chip
                            size="small"
                            variant="outlined"
                            label={getPriorityLabel(habit.priority)}
                          />
                        </Stack>
                      </Box>
                    );
                  })}
                </Stack>
              )}
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
