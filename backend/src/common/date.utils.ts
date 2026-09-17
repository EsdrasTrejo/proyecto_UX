import { HabitDay } from '@prisma/client';

export function getHabitDay(date: Date): HabitDay {
  const days: HabitDay[] = [
    HabitDay.SUNDAY,
    HabitDay.MONDAY,
    HabitDay.TUESDAY,
    HabitDay.WEDNESDAY,
    HabitDay.THURSDAY,
    HabitDay.FRIDAY,
    HabitDay.SATURDAY,
  ];

  return days[date.getUTCDay()];
}

export function getToday(): Date {
  const timeZone = process.env.APP_TIMEZONE ?? 'UTC';

  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  const parts = formatter.formatToParts(new Date());

  const year = Number(parts.find((part) => part.type === 'year')?.value);

  const month = Number(parts.find((part) => part.type === 'month')?.value);

  const day = Number(parts.find((part) => part.type === 'day')?.value);

  return new Date(Date.UTC(year, month - 1, day));
}
export function normalizeDate(date: Date): Date {
  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()),
  );
}
