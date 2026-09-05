import api from './api';

export type HabitDay =
  | 'MONDAY'
  | 'TUESDAY'
  | 'WEDNESDAY'
  | 'THURSDAY'
  | 'FRIDAY'
  | 'SATURDAY'
  | 'SUNDAY';

export interface Habit {
  id?: string;
  _id?: string;

  name: string;
  description?: string | null;
  category?: string | null;

  frequency: string;

  weeklyDay?: HabitDay | null;

  customDays?: HabitDay[];

  priority?: string | null;

  startDate?: string | null;
  endDate?: string | null;

  active: boolean;
}

export interface CreateHabitData {
  name: string;
  description?: string;
  category?: string;

  frequency:
    | 'DAILY'
    | 'WEEKLY'
    | 'CUSTOM';

  weeklyDay?: HabitDay;

  customDays?: HabitDay[];

  priority:
    | 'LOW'
    | 'MEDIUM'
    | 'HIGH';

  startDate: string;
  endDate?: string;
}

export const getHabits = async (): Promise<Habit[]> => {
  const response = await api.get<Habit[]>('/habits');

  return response.data;
};

export const createHabit = async (
  data: CreateHabitData,
): Promise<Habit> => {
  const response = await api.post<Habit>(
    '/habits',
    data,
  );

  return response.data;
};