import { z } from 'zod';

export const habitDaySchema = z.enum([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
]);

export const habitSchema = z
  .object({
    name: z
      .string()
      .min(1, 'El nombre del hábito es obligatorio')
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(80, 'El nombre no puede superar los 80 caracteres'),

    description: z
      .string()
      .max(
        300,
        'La descripción no puede superar los 300 caracteres',
      )
      .optional(),

    category: z
      .string()
      .max(
        40,
        'La categoría no puede superar los 40 caracteres',
      )
      .optional(),

    frequency: z.enum([
      'DAILY',
      'WEEKLY',
      'CUSTOM',
    ]),

    weeklyDay: habitDaySchema.optional(),

    customDays: z
      .array(habitDaySchema)
      .optional(),

    priority: z.enum([
      'LOW',
      'MEDIUM',
      'HIGH',
    ]),

    startDate: z
      .string()
      .min(
        1,
        'La fecha de inicio es obligatoria',
      ),

    endDate: z
      .string()
      .optional(),
  })

  .refine(
    (data) => {
      if (!data.endDate) {
        return true;
      }

      return data.endDate >= data.startDate;
    },
    {
      message:
        'La fecha de finalización no puede ser anterior a la fecha de inicio',
      path: ['endDate'],
    },
  )

  .refine(
    (data) => {
      if (data.frequency !== 'WEEKLY') {
        return true;
      }

      return Boolean(data.weeklyDay);
    },
    {
      message:
        'Selecciona el día de la semana',
      path: ['weeklyDay'],
    },
  )

  .refine(
    (data) => {
      if (data.frequency !== 'CUSTOM') {
        return true;
      }

      return (
        data.customDays !== undefined &&
        data.customDays.length > 0
      );
    },
    {
      message:
        'Selecciona al menos un día',
      path: ['customDays'],
    },
  );

export type HabitFormData =
  z.infer<typeof habitSchema>;