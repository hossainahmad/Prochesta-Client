// Shared site constants & helpers

export const SITE_NAME = "ProChesta";
export const SITE_TAGLINE = "Create. Join. Impact.";
export const SITE_DESCRIPTION =
  "A community-driven platform to create, join, and track social service events in your local area.";

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Blood Drive",
  "Food Distribution",
  "Clothing Drive",
  "Education",
  "Awareness Campaign",
  "Health Camp",
  "Other",
] as const;

export type EventType = (typeof EVENT_TYPES)[number];

/** Tailwind badge classes per event type (no blue/indigo palette) */
export const eventTypeBadgeClass: Record<string, string> = {
  Cleanup:
    "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-900",
  Plantation:
    "bg-lime-100 text-lime-800 border-lime-200 dark:bg-lime-950/60 dark:text-lime-300 dark:border-lime-900",
  Donation:
    "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-900",
  "Blood Drive":
    "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-900",
  "Food Distribution":
    "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-900",
  "Clothing Drive":
    "bg-cyan-100 text-cyan-800 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-900",
  Education:
    "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-950/60 dark:text-violet-300 dark:border-violet-900",
  "Awareness Campaign":
    "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 dark:bg-fuchsia-950/60 dark:text-fuchsia-300 dark:border-fuchsia-900",
  "Health Camp":
    "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/60 dark:text-teal-300 dark:border-teal-900",
  Other:
    "bg-stone-100 text-stone-800 border-stone-200 dark:bg-stone-950/60 dark:text-stone-300 dark:border-stone-900",
};

export function getBadgeClass(type: string): string {
  return eventTypeBadgeClass[type] ?? eventTypeBadgeClass.Other;
}
