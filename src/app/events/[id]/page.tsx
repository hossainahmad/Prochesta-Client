"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  Users,
} from "lucide-react";
import { EventCardSkeleton } from "@/components/events/event-card";
import { getBadgeClass } from "@/lib/constants";
import { formatEventDate, daysLeftLabel } from "@/lib/date-utils";
import { apiJson } from "@/lib/api-client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { JoinEventButton } from "@/components/events/join-event-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface EventDetail {
  id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  eventDate: string;
  creator: { name: string; photoURL: string | null } | null;
  _count: { participants: number };
}

interface DetailPayload {
  event: EventDetail;
  joinedByMe: boolean;
  isOwner: boolean;
}

export default function EventDetailsPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [data, setData] = React.useState<DetailPayload | null>(null);
  const [notFound, setNotFound] = React.useState(false);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;
    let cancelled = false;
    apiJson<DetailPayload>(`/api/events/${id}`)
      .then((res) => {
        if (cancelled) return;
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        if (!res.ok) throw new Error("Failed to load");
        setData(res.data);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (notFound || error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-extrabold text-foreground">
          {error ? "Could not load this event" : "Event not found"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {error
            ? "Please check your connection and try again."
            : "It may have been removed by its organizer."}
        </p>
        <Button asChild className="mt-6">
          <Link href="/events">
            <ArrowLeft className="mr-2 size-4" /> Back to all events
          </Link>
        </Button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
        <EventCardSkeleton />
        <div className="mt-8 grid items-start gap-8 lg:grid-cols-5">
          <Skeleton className="aspect-[16/10] rounded-3xl lg:col-span-3" />
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-40 rounded-2xl" />
            <Skeleton className="h-14 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  const { event, joinedByMe, isOwner } = data;
  const eventDate = new Date(event.eventDate);
  const isPast = eventDate.getTime() <= Date.now();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-14 lg:px-8">
      {/* Back link */}
      <Link
        href="/events"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-4" />
        Back to all events
      </Link>

      <div className="grid items-start gap-8 lg:grid-cols-5">
        {/* Thumbnail */}
        <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border shadow-lg lg:col-span-3">
          <Image
            src={event.thumbnailUrl}
            alt={event.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <Badge
            className={cn(
              "absolute top-4 left-4 border backdrop-blur-sm",
              getBadgeClass(event.eventType)
            )}
          >
            {event.eventType}
          </Badge>
          <span className="absolute top-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {daysLeftLabel(eventDate)}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-col gap-5 lg:col-span-2">
          <div>
            <h1 className="text-2xl font-extrabold leading-tight text-foreground sm:text-3xl">
              {event.title}
            </h1>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="size-4 text-primary" />
              Organized by{" "}
              <span className="font-semibold text-foreground">
                {event.creator?.name ?? "a community member"}
              </span>
            </p>
          </div>

          {/* Meta cards */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border bg-card p-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <CalendarDays className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Event date
                </p>
                <p className="truncate text-sm font-semibold text-foreground">
                  {formatEventDate(eventDate)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border bg-card p-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <MapPin className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Location
                </p>
                <p className="truncate text-sm font-semibold text-foreground">
                  {event.location}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border bg-card p-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Users className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Volunteers joined
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {event._count.participants}{" "}
                  {event._count.participants === 1 ? "person" : "people"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl border bg-card p-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Clock className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Status
                </p>
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isPast ? "text-stone-500" : "text-emerald-600 dark:text-emerald-400"
                  )}
                >
                  {isPast ? "Past event" : "Open for joining"}
                </p>
              </div>
            </div>
          </div>

          {/* Join / owner button */}
          <JoinEventButton
            eventId={event.id}
            eventTitle={event.title}
            initialJoined={joinedByMe}
            isOwner={isOwner}
            isPast={isPast}
            initialCount={event._count.participants}
          />

          {/* Description */}
          <div className="rounded-2xl border bg-card p-5">
            <h2 className="mb-2 text-lg font-bold text-foreground">
              About this event
            </h2>
            <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
              {event.description}
            </p>
          </div>

          {/* Organizer */}
          <div className="flex items-center gap-3 rounded-2xl border bg-card p-4">
            <Avatar className="size-11 border">
              <AvatarImage
                src={event.creator?.photoURL ?? undefined}
                alt={event.creator?.name ?? "Organizer"}
              />
              <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                {(event.creator?.name ?? "V")
                  .split(" ")
                  .map((p) => p[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {event.creator?.name ?? "Community member"}
              </p>
              <p className="text-xs text-muted-foreground">
                Event organizer · Verified member
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
