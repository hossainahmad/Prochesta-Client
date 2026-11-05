"use client";

import * as React from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarSearch, Search, SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/site/section-heading";
import {
  EventCard,
  EventCardSkeleton,
  EventCardData,
} from "@/components/events/event-card";
import { EVENT_TYPES } from "@/lib/constants";
import { apiFetch } from "@/lib/api-client";

function EventsContent() {
  const searchParams = useSearchParams();
  const initialType = searchParams.get("type") || "all";

  const [events, setEvents] = React.useState<EventCardData[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [search, setSearch] = React.useState("");
  const [type, setType] = React.useState(initialType);

  const loadEvents = React.useCallback(async (searchText: string, typeFilter: string) => {
    setError(null);
    try {
      const params = new URLSearchParams();
      if (searchText.trim()) params.set("search", searchText.trim());
      if (typeFilter && typeFilter !== "all") params.set("type", typeFilter);
      const res = await apiFetch(`/api/events?${params.toString()}`);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setEvents(data.events);
    } catch {
      setError("Could not load events right now. Please try again.");
    }
  }, []);

  React.useEffect(() => {
    const timer = setTimeout(() => loadEvents(search, type), search ? 350 : 0);
    return () => clearTimeout(timer);
  }, [search, type, loadEvents]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Upcoming Events"
        title="Volunteer opportunities near you"
        description="Every event below is happening in the future — pick one that speaks to your heart and join today."
      />

      {/* Toolbar: search + type filter */}
      <div className="mb-8 flex flex-col gap-3 rounded-2xl border bg-card p-4 shadow-sm sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title or location..."
            className="pl-9"
            aria-label="Search events"
          />
        </div>
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 shrink-0 text-muted-foreground" />
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-full sm:w-56" aria-label="Filter by event type">
              <SelectValue placeholder="All event types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All event types</SelectItem>
              {EVENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {(search || type !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearch("");
                setType("all");
              }}
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Result count */}
      {events && (
        <p className="mb-4 text-sm text-muted-foreground" aria-live="polite">
          Showing{" "}
          <span className="font-semibold text-foreground">{events.length}</span>{" "}
          upcoming event{events.length === 1 ? "" : "s"}
        </p>
      )}

      {/* Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {error && events === null && (
          <div className="col-span-full flex flex-col items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 py-14 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button variant="outline" onClick={() => loadEvents(search, type)}>
              Try again
            </Button>
          </div>
        )}
        {events === null && !error
          ? Array.from({ length: 6 }).map((_, i) => <EventCardSkeleton key={i} />)
          : events?.map((event) => <EventCard key={event.id} event={event} />)}
      </div>

      {events && events.length === 0 && !error && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <CalendarSearch className="size-12 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground">No events found</p>
          <p className="max-w-sm text-sm text-muted-foreground">
            {search || type !== "all"
              ? "Try a different search term or event type."
              : "No upcoming events at the moment — be the first to create one!"}
          </p>
        </div>
      )}
    </div>
  );
}

export default function UpcomingEventsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <EventCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <EventsContent />
    </Suspense>
  );
}
