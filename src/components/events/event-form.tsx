"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { Check, ImageIcon, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EventCardData } from "@/components/events/event-card";
import { EVENT_TYPES } from "@/lib/constants";
import { eventSchema, type EventInput } from "@/lib/validations";
import { cn } from "@/lib/utils";
import { apiFetch } from "@/lib/api-client";

const PRESET_IMAGES = [
  { url: "/images/events/winter-clothes.jpg", label: "Winter clothes" },
  { url: "/images/events/blanket.jpg", label: "Blanket drive" },
  { url: "/images/events/plantation.jpg", label: "Plantation" },
  { url: "/images/events/cleanup.jpg", label: "Cleanup" },
  { url: "/images/events/food.jpg", label: "Food share" },
  { url: "/images/events/blood.jpg", label: "Blood drive" },
  { url: "/images/events/education.jpg", label: "Education" },
  { url: "/images/events/awareness.jpg", label: "Awareness" },
  { url: "/images/events/health.jpg", label: "Health camp" },
  { url: "/images/events/heritage-cleanup.jpg", label: "Heritage cleanup" },
];

/** Convert a Date to the value format required by <input type="datetime-local"> */
function toDateInputValue(date: Date | string): string {
  const d = new Date(date);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

interface EventFormProps {
  mode: "create" | "edit";
  eventId?: string;
  defaultValues?: Partial<EventInput> & { eventDate?: string | Date };
  onSuccess?: (event: EventCardData) => void;
  onCancel?: () => void;
}

export function EventForm({
  mode,
  eventId,
  defaultValues,
  onSuccess,
  onCancel,
}: EventFormProps) {
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<EventInput>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: defaultValues?.title ?? "",
      description: defaultValues?.description ?? "",
      eventType: defaultValues?.eventType ?? undefined,
      thumbnailUrl: defaultValues?.thumbnailUrl ?? "",
      location: defaultValues?.location ?? "",
      eventDate:
        defaultValues?.eventDate != null
          ? toDateInputValue(defaultValues.eventDate)
          : "",
    },
  });

  const thumbnailValue = form.watch("thumbnailUrl");

  const minDate = React.useMemo(() => {
    const d = new Date();
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }, []);

  const onSubmit = async (values: EventInput) => {
    setSubmitting(true);
    try {
      const res = await apiFetch(
        mode === "create" ? "/api/events" : `/api/events/${eventId}`,
        {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong", {
          description: "Please check the form and try again.",
        });
        return;
      }

      toast.success(
        mode === "create"
          ? "Event created successfully! 🎉"
          : "Event updated successfully! ✨",
        {
          description:
            mode === "create"
              ? "It is now live on the Upcoming Events page."
              : "Your changes have been saved.",
        }
      );
      onSuccess?.(data.event);
      form.reset();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Event title *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description *</FormLabel>
              <FormControl>
                <Textarea
                  rows={5}
                  placeholder="Describe the cause, what volunteers will do, who it helps, and anything they should bring..."
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs">
                Minimum 20 characters — the more details, the more volunteers.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="eventType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event type *</FormLabel>
                <Select value={field.value} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select an event type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EVENT_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="eventDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Event date &amp; time *</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    min={minDate}
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs">
                  Must be a future date — past dates are not allowed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location *</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. Mirpur 10 Roundabout, Dhaka"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="thumbnailUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnail image URL *</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <ImageIcon className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="https://example.com/photo.jpg or pick a preset below"
                      className="pl-9"
                      {...field}
                    />
                  </div>
                </div>
              </FormControl>

              {/* Preset picker */}
              <div className="mt-2">
                <p className="mb-1.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <Upload className="size-3" /> Or choose a preset image:
                </p>
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-10">
                  {PRESET_IMAGES.map((preset) => {
                    const selected = field.value === preset.url;
                    return (
                      <button
                        key={preset.url}
                        type="button"
                        title={preset.label}
                        onClick={() => form.setValue("thumbnailUrl", preset.url, { shouldValidate: true })}
                        className={cn(
                          "relative aspect-square overflow-hidden rounded-lg border-2 transition-all",
                          selected
                            ? "border-primary ring-2 ring-primary/30"
                            : "border-transparent hover:border-primary/40"
                        )}
                      >
                        <Image
                          src={preset.url}
                          alt={preset.label}
                          fill
                          sizes="72px"
                          className="object-cover"
                        />
                        {selected && (
                          <span className="absolute inset-0 flex items-center justify-center bg-primary/60">
                            <Check className="size-4 text-white" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Live preview */}
              {thumbnailValue && /^https?:\/\//.test(thumbnailValue) && (
                <div className="relative mt-2 aspect-[16/9] w-full max-w-sm overflow-hidden rounded-lg border">
                  <Image
                    src={thumbnailValue}
                    alt="Thumbnail preview"
                    fill
                    sizes="384px"
                    className="object-cover"
                    onError={() => {}}
                    unoptimized
                  />
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col gap-3 pt-2 sm:flex-row-reverse">
          <Button
            type="submit"
            disabled={submitting}
            className="h-11 flex-1 text-base sm:flex-none sm:px-8"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {mode === "create" ? "Creating..." : "Saving..."}
              </>
            ) : mode === "create" ? (
              "Create Event"
            ) : (
              "Save Changes"
            )}
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={submitting}
              className="h-11 flex-1 sm:flex-none sm:px-8"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
