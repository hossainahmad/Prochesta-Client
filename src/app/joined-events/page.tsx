"use client";

import * as React from "react";
import Link from "next/link";
import { CalendarCheck2, CalendarPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  EventCard,
  EventCardSkeleton,
  EventCardData,
} from "@/components/events/event-card";
import { SectionHeading } from "@/components/site/section-heading";
import { apiFetch } from "@/lib/api-client";

export default function JoinedEventsPage() {
  const [events, setEvents] = React.useState<EventCardData[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const loadEvents = React.useCallback(async () => {
    try {
      const res = await apiFetch("/api/joined-events");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setEvents(data.events);
      setError(null);
    } catch {
      setError("Could not load your joined events. Please try again.");
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch; state updates happen after await
    loadEvents();
  }, [loadEvents]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Private Dashboard"
        title="Events you've joined"
        description="Your volunteering timeline, sorted by event date — every badge of honor you've earned in the community."
        align="left"
      />

      {events === null && !error && (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 py-14 text-center">
          <p className="text-sm text-destructive">{error}</p>
          <Button variant="outline" onClick={loadEvents}>
            Try again
          </Button>
        </div>
      )}

      {events && events.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <CalendarCheck2 className="size-12 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground">
            You haven&apos;t joined any events yet
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Browse upcoming community events and join the ones that inspire you.
          </p>
          <Button asChild className="mt-2">
            <Link href="/events">
              <CalendarPlus className="mr-1.5 size-4" />
              Browse upcoming events
            </Link>
          </Button>
        </div>
      )}

      {events && events.length > 0 && (
        <>
          <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
            You&apos;ve joined{" "}
            <span className="font-semibold text-foreground">{events.length}</span>{" "}
            event{events.length === 1 ? "" : "s"} so far — keep it up! 🎉
          </p>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
