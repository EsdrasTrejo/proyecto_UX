'use client';

import { useState,useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';


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
} from '@mui/material';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  habitSchema,
  HabitFormData,
} from '@/schemas/habit.schema';

import { createHabit } from '@/services/habits.service';
const DAYS = [
  {
    value: 'MONDAY',
    label: 'Lun',
  },
  {
    value: 'TUESDAY',
    label: 'Mar',
  },
  {
    value: 'WEDNESDAY',
    label: 'Mié',
  },
  {
    value: 'THURSDAY',
    label: 'Jue',
  },
  {
    value: 'FRIDAY',
    label: 'Vie',
  },
  {
    value: 'SATURDAY',
    label: 'Sáb',
  },
  {
    value: 'SUNDAY',
    label: 'Dom',
  },
] as const;

export default function HabitForm() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    control,
     watch,
  setValue,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm<HabitFormData>({
    
    resolver: zodResolver(habitSchema),

   defaultValues: {
  name: '',
  description: '',
  category: '',
  frequency: 'DAILY',
  weeklyDay: undefined,
  customDays: [],
  priority: 'MEDIUM',
  startDate: '',
  endDate: '',
},
  });
  const selectedFrequency = watch('frequency');
  useEffect(() => {
  if (selectedFrequency === 'DAILY') {
    setValue(
      'weeklyDay',
      undefined,
    );

    setValue(
      'customDays',
      [],
    );
  }

  if (selectedFrequency === 'WEEKLY') {
    setValue(
      'customDays',
      [],
    );
  }

  if (selectedFrequency === 'CUSTOM') {
    setValue(
      'weeklyDay',
      undefined,
    );
  }
}, [
  selectedFrequency,
  setValue,
]);

  const onSubmit = async (
    data: HabitFormData,
  ) => {
    setErrorMessage('');
    setSuccessMessage('');

    try {
        console.log('DATOS DEL FORMULARIO:', data);
      await createHabit({
  name: data.name.trim(),

  description:
    data.description?.trim() || undefined,

  category:
    data.category?.trim() || undefined,

  frequency: data.frequency,

  weeklyDay:
    data.frequency === 'WEEKLY'
      ? data.weeklyDay
      : undefined,

  customDays:
    data.frequency === 'CUSTOM'
      ? data.customDays
      : undefined,

  priority: data.priority,

  startDate: data.startDate,

  endDate:
    data.endDate || undefined,
});

      setSuccessMessage(
        'Hábito creado correctamente',
      );

      setTimeout(() => {
        router.push('/habits');
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
  console.log('STATUS:', error.response?.status);
  console.log('RESPUESTA BACKEND:', error.response?.data);
}

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message =
          error.response?.data?.message;

        if (status === 401) {
          localStorage.removeItem(
            'access_token',
          );

          router.replace('/login');
          return;
        }

        if (Array.isArray(message)) {
          setErrorMessage(
            message.join(', '),
          );
          return;
        }

        if (typeof message === 'string') {
          setErrorMessage(message);
          return;
        }
      }

      setErrorMessage(
        'No se pudo crear el hábito. Inténtalo nuevamente.',
      );
    }
  };

  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
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

            <Typography
              variant="body2"
              color="text.secondary"
            >
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
            {...register('name')}
          />

          <TextField
            label="Descripción"
            placeholder="Describe brevemente tu hábito"
            fullWidth
            multiline
            minRows={3}
            disabled={isSubmitting}
            error={Boolean(
              errors.description,
            )}
            helperText={
              errors.description?.message
            }
            {...register('description')}
          />

          <TextField
            label="Categoría"
            placeholder="Ej. Salud, Estudio, Ejercicio"
            fullWidth
            disabled={isSubmitting}
            error={Boolean(errors.category)}
            helperText={
              errors.category?.message
            }
            {...register('category')}
          />

          <Stack
            direction={{
              xs: 'column',
              sm: 'row',
            }}
            spacing={2}
          >
            <Controller
  name="frequency"
  control={control}
  render={({ field }) => (
    <TextField
      {...field}
      value={field.value ?? 'DAILY'}
      label="Frecuencia"
      select
      fullWidth
      disabled={isSubmitting}
      error={Boolean(errors.frequency)}
      helperText={errors.frequency?.message}
    >
      <MenuItem value="DAILY">
        Diario
      </MenuItem>

      <MenuItem value="WEEKLY">
        Semanal
      </MenuItem>

      <MenuItem value="CUSTOM">
        Personalizada
      </MenuItem>
    </TextField>
  )
}
  
/>
{selectedFrequency === 'WEEKLY' && (
  <Controller
    name="weeklyDay"
    control={control}
    render={({ field }) => (
      <TextField
        {...field}
        value={field.value ?? ''}
        label="Día de la semana"
        select
        fullWidth
        disabled={isSubmitting}
        error={Boolean(errors.weeklyDay)}
        helperText={
          errors.weeklyDay?.message ??
          'Selecciona el día en que realizarás este hábito'
        }
      >
        {DAYS.map((day) => (
          <MenuItem
            key={day.value}
            value={day.value}
          >
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
      value={field.value ?? 'MEDIUM'}
      label="Prioridad"
      select
      fullWidth
      disabled={isSubmitting}
      error={Boolean(errors.priority)}
      helperText={errors.priority?.message}
    >
      <MenuItem value="LOW">
        Baja
      </MenuItem>

      <MenuItem value="MEDIUM">
        Media
      </MenuItem>

      <MenuItem value="HIGH">
        Alta
      </MenuItem>
    </TextField>
  )}
/>
{selectedFrequency === 'CUSTOM' && (
  <FormControl
    error={Boolean(errors.customDays)}
  >
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
          onChange={(
            _event,
            newDays,
          ) => {
            field.onChange(newDays);
          }}
          aria-label="Días personalizados"
          disabled={isSubmitting}
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 1,

            '& .MuiToggleButtonGroup-grouped': {
              borderRadius: '10px !important',
              border: '1px solid',
              borderColor: 'divider',
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
      {errors.customDays?.message ??
        'Selecciona uno o varios días'}
    </FormHelperText>
  </FormControl>
)}
            <TextField
              label="Fecha de inicio"
              type="date"
              fullWidth
              disabled={isSubmitting}
              error={Boolean(
                errors.startDate,
              )}
              helperText={
                errors.startDate?.message
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              {...register('startDate')}
            />

            <TextField
              label="Fecha de finalización"
              type="date"
              fullWidth
              disabled={isSubmitting}
              error={Boolean(
                errors.endDate,
              )}
              helperText={
                errors.endDate?.message ??
                'Opcional'
              }
              slotProps={{
                inputLabel: {
                  shrink: true,
                },
              }}
              {...register('endDate')}
            />
          </Stack>

          {errorMessage && (
            <Alert severity="error">
              {errorMessage}
            </Alert>
          )}

          <Stack
            direction={{
              xs: 'column-reverse',
              sm: 'row',
            }}
            spacing={2}
            sx={{
              justifyContent: 'flex-end',
            }}
          >
            <Button
              type="button"
              variant="outlined"
              disabled={isSubmitting}
              onClick={() =>
                router.push('/habits')
              }
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
                <CircularProgress
                  size={24}
                  color="inherit"
                />
              ) : (
                'Crear hábito'
              )}
            </Button>
          </Stack>
        </Stack>
      </Box>

      <Snackbar
        open={Boolean(successMessage)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
      >
        <Alert
          severity="success"
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
}