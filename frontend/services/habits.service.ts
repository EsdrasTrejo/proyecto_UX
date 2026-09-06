import api from './api';

export type HabitFrequency =
  | 'DAILY'
  | 'WEEKLY'
  | 'CUSTOM';

export type HabitPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH';

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

  frequency: HabitFrequency;

  weeklyDay?: HabitDay | null;
  customDays?: HabitDay[];

  priority: HabitPriority;

  startDate: string;
  endDate?: string | null;

  active: boolean;
}

export interface CreateHabitData {
  name: string;
  description?: string;
  category?: string;

  frequency: HabitFrequency;

  weeklyDay?: HabitDay;
  customDays?: HabitDay[];

  priority: HabitPriority;

  startDate: string;
  endDate?: string;
}

export type UpdateHabitData =
  Partial<CreateHabitData>;

export const getHabits =
  async (): Promise<Habit[]> => {
    const response =
      await api.get<Habit[]>('/habits');

    return response.data;
  };

export const getHabitById =
  async (id: string): Promise<Habit> => {
    const response =
      await api.get<Habit>(`/habits/${id}`);

    return response.data;
  };

export const createHabit = async (
  data: CreateHabitData,
): Promise<Habit> => {
  const response =
    await api.post<Habit>(
      '/habits',
      data,
    );

  return response.data;
};

export const updateHabit = async (
  id: string,
  data: UpdateHabitData,
): Promise<Habit> => {
  const response =
    await api.patch<Habit>(
      `/habits/${id}`,
      data,
    );

  return response.data;
};

export const deleteHabit = async (
  id: string,
): Promise<void> => {
  await api.delete(`/habits/${id}`);
};