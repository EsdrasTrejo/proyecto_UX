import api from './api';

export interface SummaryStatistics {
  totalHabits: number;
  activeHabits: number;
  finishedHabits: number;
  habitsToday: number;
  completedToday: number;
  pendingToday: number;
  completionPercentage: number;
}

export interface ProgressDay {
  date: string;
  scheduled: number;
  completed: number;
  percentage: number;
}

export interface WeeklyProgress {
  startDate: string;
  endDate: string;
  scheduled: number;
  completed: number;
  pending: number;
  percentage: number;
  days: ProgressDay[];
}

export interface MonthlyProgress {
  year: number;
  month: number;
  scheduled: number;
  completed: number;
  pending: number;
  percentage: number;
  days: ProgressDay[];
}

export interface HabitStreak {
  habitId: string;
  name: string;
  frequency: string;
  currentStreak: number;
  bestStreak: number;
}

export interface StreaksResponse {
  longestCurrentStreak: number;
  bestStreak: number;
  habits: HabitStreak[];
}

export interface TrendResponse {
  startDate: string;
  endDate: string;
  days: ProgressDay[];
}

export const getSummary =
  async (): Promise<SummaryStatistics> => {
    const response =
      await api.get<SummaryStatistics>(
        '/statistics/summary',
      );

    return response.data;
  };

export const getWeeklyProgress =
  async (): Promise<WeeklyProgress> => {
    const response =
      await api.get<WeeklyProgress>(
        '/statistics/weekly',
      );

    return response.data;
  };

export const getMonthlyProgress =
  async (): Promise<MonthlyProgress> => {
    const response =
      await api.get<MonthlyProgress>(
        '/statistics/monthly',
      );

    return response.data;
  };

export const getStreaks =
  async (): Promise<StreaksResponse> => {
    const response =
      await api.get<StreaksResponse>(
        '/statistics/streaks',
      );

    return response.data;
  };

export const getTrend =
  async (): Promise<TrendResponse> => {
    const response =
      await api.get<TrendResponse>(
        '/statistics/trend',
      );

    return response.data;
  };