import { format, differenceInCalendarDays } from "date-fns";

/** "Sat, Jan 18, 2026 · 9:00 AM" */
export function formatEventDate(date: string | Date): string {
  return format(new Date(date), "EEE, MMM d, yyyy · h:mm a");
}

/** "Jan 18, 2026" */
export function formatShortDate(date: string | Date): string {
  return format(new Date(date), "MMM d, yyyy");
}

/** Whole days until the event (>= 0). Negative means past. */
export function daysUntil(date: string | Date): number {
  return differenceInCalendarDays(new Date(date), new Date());
}

/** Human label like "Today", "Tomorrow", "In 5 days", or "3 days ago" */
export function daysLeftLabel(date: string | Date): string {
  const days = daysUntil(date);
  if (days < 0) return `${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"} ago`;
  if (days === 0) return "Today";
  if (days === 1) return "Tomorrow";
  return `In ${days} days`;
}

/** Check if a date string is strictly in the future */
export function isFutureDate(date: string | Date): boolean {
  return new Date(date).getTime() > Date.now();
}
