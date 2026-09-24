"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { getApiErrorMessage } from "@/services/api-error";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Snackbar,
  Stack,
  TextField,
  Typography,
  FormControl,
  FormHelperText,
  ToggleButton,
  ToggleButtonGroup,
  Autocomplete,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { habitSchema, HabitFormData } from "@/schemas/habit.schema";

import { createHabit, updateHabit } from "@/services/habits.service";

const BASIC_CATEGORIES = ["Salud", "Estudio", "Ejercicio"] as const;

const OTHER_CATEGORY_SUGGESTIONS = [
  "Nutrición",
  "Trabajo",
  "Finanzas",
  "Lectura",
  "Productividad",
  "Bienestar",
  "Hogar",
  "Meditación",
  "Deporte",
  "Desarrollo personal",
];
const DAYS = [
  {
    value: "MONDAY",
    label: "Lun",
  },
  {
    value: "TUESDAY",
    label: "Mar",
  },
  {
    value: "WEDNESDAY",
    label: "Mié",
  },
  {
    value: "THURSDAY",
    label: "Jue",
  },
  {
    value: "FRIDAY",
    label: "Vie",
  },
  {
    value: "SATURDAY",
    label: "Sáb",
  },
  {
    value: "SUNDAY",
    label: "Dom",
  },
] as const;
interface HabitFormProps {
  mode?: "create" | "edit";
  habitId?: string;
  initialValues?: Partial<HabitFormData>;
}

export default function HabitForm({
  mode = "create",
  habitId,
  initialValues,
}: HabitFormProps) {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<HabitFormData>({
    resolver: zodResolver(habitSchema),

    defaultValues: {
      name: initialValues?.name ?? "",

      description: initialValues?.description ?? "",

      category: initialValues?.category ?? "",

      frequency: initialValues?.frequency ?? "DAILY",

      weeklyDay: initialValues?.weeklyDay,

      customDays: initialValues?.customDays ?? [],

      priority: initialValues?.priority ?? "MEDIUM",

      startDate: initialValues?.startDate ?? "",

      endDate: initialValues?.endDate ?? "",
    },
  });

  const initialCategory = initialValues?.category ?? "";

  const [categoryOption, setCategoryOption] = useState<string>(() => {
    if (
      BASIC_CATEGORIES.includes(
        initialCategory as (typeof BASIC_CATEGORIES)[number],
      )
    ) {
      return initialCategory;
    }

    if (initialCategory) {
      return "OTHER";
    }

    return "";
  });

  const [customCategory, setCustomCategory] = useState(() => {
    if (
      initialCategory &&
      !BASIC_CATEGORIES.includes(
        initialCategory as (typeof BASIC_CATEGORIES)[number],
      )
    ) {
      return initialCategory;
    }

    return "";
  });

  const selectedFrequency = watch("frequency");
  useEffect(() => {
    if (selectedFrequency === "DAILY") {
      setValue("weeklyDay", undefined);

      setValue("customDays", []);
    }

    if (selectedFrequency === "WEEKLY") {
      setValue("customDays", []);
    }

    if (selectedFrequency === "CUSTOM") {
      setValue("weeklyDay", undefined);
    }
  }, [selectedFrequency, setValue]);

  const onSubmit = async (data: HabitFormData) => {
    setErrorMessage("");
    setSuccessMessage("");

    const habitData = {
      name: data.name.trim(),

      description: data.description?.trim() || undefined,

      category: data.category?.trim() || undefined,

      frequency: data.frequency,

      weeklyDay: data.frequency === "WEEKLY" ? data.weeklyDay : undefined,

      customDays: data.frequency === "CUSTOM" ? data.customDays : undefined,

      priority: data.priority,

      startDate: data.startDate,
    };

    try {
  if (mode === "edit") {
    if (!habitId) {
      setErrorMessage(
        "No se pudo identificar el hábito.",
      );
      return;
    }

    await updateHabit(
      habitId,
      {
        ...habitData,

        endDate:
          data.endDate || null,
      },
    );

    setSuccessMessage(
      "Hábito actualizado correctamente",
    );
  } else {
    await createHabit({
      ...habitData,

      endDate:
        data.endDate || undefined,
    });

    setSuccessMessage(
      "Hábito creado correctamente",
    );
  }

  setTimeout(() => {
    router.push("/habits");
  }, 1000);
} catch (error) {
  console.error(
    mode === "edit"
      ? "Error al actualizar hábito:"
      : "Error al crear hábito:",
    error,
  );

  setErrorMessage(
    getApiErrorMessage(
      error,
      mode === "edit"
        ? "No se pudo actualizar el hábito. Inténtalo nuevamente."
        : "No se pudo crear el hábito. Inténtalo nuevamente.",
      {
        404:
          "El hábito no existe o ya fue eliminado.",
      },
    ),
  );
}
  };

  return (
    <>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack spacing={3}>
          <Box>
            <Typography
              variant="h6"
              sx={{
                mb: 0.5,
                fontWeight: 700,
              }}
            >
              Información básica
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Define qué hábito quieres incorporar a tu rutina.
            </Typography>
          </Box>

          <TextField
            label="Nombre del hábito"
            placeholder="Ej. Leer 30 minutos"
            fullWidth
            disabled={isSubmitting}
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            {...register("name")}
          />

          <TextField
            label="Descripción"
            placeholder="Describe brevemente tu hábito"
            fullWidth
            multiline
            minRows={3}
            disabled={isSubmitting}
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
            {...register("description")}
          />

          <FormControl fullWidth error={!!errors.category}>
            <FormLabel>Categoría</FormLabel>

            <RadioGroup
              row
              value={categoryOption}
              onChange={(event) => {
                const value = event.target.value;

                setCategoryOption(value);

                if (value === "OTHER") {
                  setValue("category", customCategory, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });

                  return;
                }

                setValue("category", value, {
                  shouldDirty: true,
                  shouldValidate: true,
                });
              }}
              sx={{
                mt: 1,
                gap: {
                  xs: 0,
                  sm: 1,
                },
              }}
            >
              <FormControlLabel
                value="Salud"
                control={<Radio />}
                label="Salud"
              />

              <FormControlLabel
                value="Estudio"
                control={<Radio />}
                label="Estudio"
              />

              <FormControlLabel
                value="Ejercicio"
                control={<Radio />}
                label="Ejercicio"
              />

              <FormControlLabel
                value="OTHER"
                control={<Radio />}
                label="Otro"
              />
            </RadioGroup>

            {categoryOption === "OTHER" && (
              <Autocomplete
                freeSolo
                options={OTHER_CATEGORY_SUGGESTIONS}
                value={customCategory}
                onChange={(_event, newValue) => {
                  const value = newValue ?? "";

                  setCustomCategory(value);

                  setValue("category", value, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                onInputChange={(_event, newInputValue) => {
                  setCustomCategory(newInputValue);

                  setValue("category", newInputValue, {
                    shouldDirty: true,
                    shouldValidate: true,
                  });
                }}
                sx={{
                  mt: 2,
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Otra categoría"
                    placeholder="Ej. Nutrición"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                  />
                )}
              />
            )}
          </FormControl>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <Controller
              name="frequency"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? "DAILY"}
                  label="Frecuencia"
                  select
                  fullWidth
                  disabled={isSubmitting}
                  error={Boolean(errors.frequency)}
                  helperText={errors.frequency?.message}
                >
                  <MenuItem value="DAILY">Diario</MenuItem>

                  <MenuItem value="WEEKLY">Semanal</MenuItem>

                  <MenuItem value="CUSTOM">Personalizada</MenuItem>
                </TextField>
              )}
            />
            {selectedFrequency === "WEEKLY" && (
              <Controller
                name="weeklyDay"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    value={field.value ?? ""}
                    label="Día de la semana"
                    select
                    fullWidth
                    disabled={isSubmitting}
                    error={Boolean(errors.weeklyDay)}
                    helperText={
                      errors.weeklyDay?.message ??
                      "Selecciona el día en que realizarás este hábito"
                    }
                  >
                    {DAYS.map((day) => (
                      <MenuItem key={day.value} value={day.value}>
                        {day.label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
            )}

            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  value={field.value ?? "MEDIUM"}
                  label="Prioridad"
                  select
                  fullWidth
                  disabled={isSubmitting}
                  error={Boolean(errors.priority)}
                  helperText={errors.priority?.message}
                >
                  <MenuItem value="LOW">Baja</MenuItem>

                  <MenuItem value="MEDIUM">Media</MenuItem>

                  <MenuItem value="HIGH">Alta</MenuItem>
                </TextField>
              )}
            />
            {selectedFrequency === "CUSTOM" && (
              <FormControl error={Boolean(errors.customDays)}>
                <Typography
                  variant="body2"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                  }}
                >
                  Días de la semana
                </Typography>

                <Controller
                  name="customDays"
                  control={control}
                  render={({ field }) => (
                    <ToggleButtonGroup
                      value={field.value ?? []}
                      onChange={(_event, newDays) => {
                        field.onChange(newDays);
                      }}
                      aria-label="Días personalizados"
                      disabled={isSubmitting}
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,

                        "& .MuiToggleButtonGroup-grouped": {
                          borderRadius: "10px !important",
                          border: "1px solid",
                          borderColor: "divider",
                        },
                      }}
                    >
                      {DAYS.map((day) => (
                        <ToggleButton
                          key={day.value}
                          value={day.value}
                          aria-label={day.label}
                          sx={{
                            minWidth: 52,
                          }}
                        >
                          {day.label}
                        </ToggleButton>
                      ))}
                    </ToggleButtonGroup>
                  )}
                />

                <FormHelperText>
                  {errors.customDays?.message ?? "Selecciona uno o varios días"}
                </FormHelperText>
              </FormControl>
            )}
            <TextField
              label="Fecha de inicio"
              type="date"
              fullWidth
              disabled={isSubmitting}
              error={Boolean(errors.startDate)}
              helperText={errors.startDate?.message}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              {...register("startDate")}
            />

            <TextField
              label="Fecha de finalización"
              type="date"
              fullWidth
              disabled={isSubmitting}
              error={Boolean(errors.endDate)}
              helperText={errors.endDate?.message ?? "Opcional"}
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              {...register("endDate")}
            />
          </Stack>

          {errorMessage && <Alert severity="error">{errorMessage}</Alert>}

          <Stack
            direction={{
              xs: "column-reverse",
              sm: "row",
            }}
            spacing={2}
            sx={{
              justifyContent: "flex-end",
            }}
          >
            <Button
              type="button"
              variant="outlined"
              disabled={isSubmitting}
              onClick={() => router.push("/habits")}
            >
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                minWidth: 150,
              }}
            >
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : mode === "edit" ? (
                "Guardar cambios"
              ) : (
                "Crear hábito"
              )}
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Snackbar
        open={Boolean(successMessage)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert severity="success" variant="filled">
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
