"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, CalendarSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import { EventCard, EventCardSkeleton, EventCardData } from "@/components/events/event-card";
import { apiFetch } from "@/lib/api-client";

/** Home section: 6 most recent upcoming events, fetched live from the API */
export function RecentEvents() {
  const [events, setEvents] = React.useState<EventCardData[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    apiFetch("/api/events?limit=6")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) setEvents(data.events);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load events right now.");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="bg-secondary/60 py-16 md:py-24 dark:bg-card/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Happening Soon"
          title="Recent upcoming events"
          description="The next six chances to make a difference around the city. Grab a spot before they're gone!"
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {error && events === null && (
            <p className="col-span-full rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center text-sm text-destructive">
              {error}
            </p>
          )}
          {events === null && !error
            ? Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)
            : events?.map((event) => <EventCard key={event.id} event={event} />)}
        </div>

        {events && events.length === 0 && !error && (
          <div className="flex flex-col items-center gap-3 rounded-3xl border border-dashed border-primary/30 bg-card py-14 text-center">
            <CalendarSearch className="size-10 text-leaf" />
            <p className="font-medium text-foreground">No upcoming events yet</p>
            <p className="text-sm text-muted-foreground">
              Be the first to create one for your community!
            </p>
            <Button asChild className="mt-2">
              <Link href="/create-event">Create Event</Link>
            </Button>
          </div>
        )}

        <div className="mt-10 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/events">
              View All Events
              <ArrowRight className="ml-1.5 size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
