import { z } from "zod";
import { EVENT_TYPES } from "./constants";

/** Shared client+server validation schemas */

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter");

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  email: z.email("Please enter a valid email address"),
  photoURL: z
    .union([z.url("Photo URL must be a valid URL"), z.literal("")])
    .optional(),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

/** Thumbnail accepts absolute http(s) URLs or site-relative paths like /images/... */
const thumbnailSchema = z
  .string()
  .trim()
  .min(1, "Thumbnail image URL is required")
  .refine(
    (value) => /^https?:\/\//i.test(value) || value.startsWith("/"),
    "Thumbnail must be a valid image URL"
  );

const futureDateSchema = z
  .string()
  .min(1, "Event date is required")
  .refine((value) => !Number.isNaN(new Date(value).getTime()), "Invalid date")
  .refine(
    (value) => new Date(value).getTime() > Date.now(),
    "Event date must be in the future"
  );

export const eventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters")
    .max(120, "Title is too long"),
  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters")
    .max(2000, "Description is too long"),
  eventType: z.enum(EVENT_TYPES, "Please select an event type"),
  thumbnailUrl: thumbnailSchema,
  location: z
    .string()
    .trim()
    .min(3, "Location must be at least 3 characters")
    .max(140, "Location is too long"),
  eventDate: futureDateSchema,
});

export type EventInput = z.infer<typeof eventSchema>;

/**
 * Validation for updating an event — date only needs to be in the future if changed.
 * The client resubmits the whole form, so we keep the same shape but allow an
 * already-valid stored date to pass even if it is seconds away.
 */
export const eventUpdateSchema = eventSchema.extend({
  eventDate: z
    .string()
    .min(1, "Event date is required")
    .refine((value) => !Number.isNaN(new Date(value).getTime()), "Invalid date")
    .refine(
      (value) => new Date(value).getTime() > Date.now() - 60_000,
      "Event date must be in the future"
    ),
});
