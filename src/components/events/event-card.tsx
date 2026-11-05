"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, CalendarCheck2, MapPin, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getBadgeClass } from "@/lib/constants";
import { formatEventDate, formatShortDate, daysUntil } from "@/lib/date-utils";
import { cn } from "@/lib/utils";

export interface EventCardData {
  id: string;
  title: string;
  thumbnailUrl: string;
  location: string;
  eventType: string;
  eventDate: string | Date;
  joinedAt?: string | Date;
  _count?: { participants: number };
  creator?: { name?: string | null; photoURL?: string | null } | null;
}

export function EventCard({ event }: { event: EventCardData }) {
  const days = daysUntil(event.eventDate);
  const isSoon = days >= 0 && days <= 3;

  return (
    <Card className="group flex h-full flex-col overflow-hidden rounded-2xl pt-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      {/* Uniform 16/10 thumbnail */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
        <Image
          src={event.thumbnailUrl}
          alt={event.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        <Badge
          className={cn(
            "absolute top-3 left-3 border backdrop-blur-sm",
            getBadgeClass(event.eventType)
          )}
        >
          {event.eventType}
        </Badge>
        <span
          className={cn(
            "absolute top-3 right-3 rounded-full px-2.5 py-1 text-xs font-bold text-center backdrop-blur-sm",
            days < 0
              ? "bg-deep/80 text-white"
              : isSoon
                ? "bg-amber-400/95 text-[#215546]"
                : "bg-primary/95 text-white"
          )}
        >
          {days < 0 ? "Past event" : days === 0 ? "Today" : `In ${days} day${days === 1 ? "" : "s"}`}
        </span>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs font-medium text-white/95">
          <CalendarDays className="size-3.5" />
          {formatEventDate(event.eventDate)}
        </div>
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="line-clamp-2 text-lg font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
          {event.title}
        </h3>
        <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <MapPin className="size-4 shrink-0 text-primary" />
          <span className="line-clamp-1">{event.location}</span>
        </p>
        <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
          {event.creator?.name && (
            <span>
              by{" "}
              <span className="font-medium text-foreground/80">
                {event.creator.name}
              </span>
            </span>
          )}
          {typeof event._count?.participants === "number" && (
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5 text-primary" />
              {event._count.participants} joined
            </span>
          )}
        </div>
        {event.joinedAt && (
          <p className="mt-1.5 flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-secondary-foreground">
            <CalendarCheck2 className="size-3.5 text-leaf" />
            You joined on {formatShortDate(event.joinedAt)}
          </p>
        )}
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button asChild className="w-full">
          <Link href={`/events/${event.id}`}>
            View Event
            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

export function EventCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden pt-0">
      <div className="aspect-[16/10] w-full animate-pulse bg-muted" />
      <CardContent className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="mt-auto flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
      </CardContent>
      <CardFooter className="p-5 pt-0">
        <Skeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
