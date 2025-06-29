import type { Dayjs } from "dayjs";

export const computeDayWidth = (
  totalWidth: number,
  paddingX: number,
  gapX: number,
  columns = 7
) => {
  return (totalWidth - paddingX * 2 - gapX * (columns - 1)) / columns;
};

export const computeDayX = (
  day: Dayjs,
  paddingX: number,
  gapX: number,
  width: number
) => {
  const dayInWeek = day.day();
  return dayInWeek * (width + gapX) + paddingX;
};

export const computeDayY = (
  day: Dayjs,
  month: Dayjs,
  monthStartY: number,
  dayHeight: number,
  dayGapY: number
) => {
  const first = month.startOf("month");
  const firstDayOfWeek = first.day();
  const diff = day.diff(first, "day");
  const index = firstDayOfWeek + diff;
  const row = Math.floor(index / 7);
  return monthStartY + row * (dayHeight + dayGapY);
};

export const getMonthDays = (month: Dayjs) => {
  const first = month.startOf('month');
  const last = month.endOf('month');
  const days: Dayjs[] = [];
  let d = first;
  while (d.isBefore(last) || d.isSame(last, 'day')) {
    days.push(d);
    d = d.add(1, 'day');
  }
  return days;
};

export const getMonthRowCount = (month: Dayjs) => {
  const first = month.startOf('month');
  const last = month.endOf('month');
  const firstDayOfWeek = first.day();
  const daysInMonth = last.date();
  return Math.ceil((firstDayOfWeek + daysInMonth) / 7);
};

export const getMonthDaysWithPadding = (month: Dayjs) => {
  const firstDayOfMonth = month.startOf("month");
  const lastDayOfMonth = month.endOf("month");
  const start = firstDayOfMonth.startOf("week");
  const end = lastDayOfMonth.endOf("week");

  const days: Dayjs[] = [];
  let current = start;
  while (current.isBefore(end) || current.isSame(end, "day")) {
    days.push(current);
    current = current.add(1, "day");
  }
  return days;
};