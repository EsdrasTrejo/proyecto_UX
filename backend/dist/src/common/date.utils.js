"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getHabitDay = getHabitDay;
exports.getToday = getToday;
exports.normalizeDate = normalizeDate;
const client_1 = require("@prisma/client");
function getHabitDay(date) {
    const days = [
        client_1.HabitDay.SUNDAY,
        client_1.HabitDay.MONDAY,
        client_1.HabitDay.TUESDAY,
        client_1.HabitDay.WEDNESDAY,
        client_1.HabitDay.THURSDAY,
        client_1.HabitDay.FRIDAY,
        client_1.HabitDay.SATURDAY,
    ];
    return days[date.getUTCDay()];
}
function getToday() {
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
function normalizeDate(date) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}
//# sourceMappingURL=date.utils.js.map