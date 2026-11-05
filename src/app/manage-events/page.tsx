"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CalendarPlus,
  LayoutList,
  MapPin,
  Pencil,
  Trash2,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { formatEventDate } from "@/lib/date-utils";
import { getBadgeClass } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { EventForm } from "@/components/events/event-form";
import { SectionHeading } from "@/components/site/section-heading";
import { EventCardData } from "@/components/events/event-card";
import { apiFetch } from "@/lib/api-client";

type ManagedEvent = EventCardData & { description?: string };

export default function ManageEventsPage() {
  const [events, setEvents] = React.useState<ManagedEvent[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [editing, setEditing] = React.useState<ManagedEvent | null>(null);
  const [deleting, setDeleting] = React.useState<ManagedEvent | null>(null);
  const [deleteLoading, setDeleteLoading] = React.useState(false);

  const loadEvents = React.useCallback(async () => {
    try {
      const res = await apiFetch("/api/my-events");
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setEvents(data.events);
      setError(null);
    } catch {
      setError("Could not load your events. Please try again.");
    }
  }, []);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- async data fetch; state updates happen after await
    loadEvents();
  }, [loadEvents]);

  const handleDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      const res = await apiFetch(`/api/events/${deleting.id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to delete event");
        return;
      }
      toast.success(`"${deleting.title}" was deleted`);
      setDeleting(null);
      loadEvents();
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Private Dashboard"
        title="Manage your events"
        description="All events you've created, sorted by date. Update details anytime or remove events you no longer host."
        align="left"
      />

      {/* Loading skeletons */}
      {events === null && !error && (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="pt-0">
              <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                <Skeleton className="aspect-[16/10] w-40 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </CardHeader>
              <CardFooter className="gap-2">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
              </CardFooter>
            </Card>
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

      {/* Empty state */}
      {events && events.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed py-16 text-center">
          <LayoutList className="size-12 text-muted-foreground" />
          <p className="text-lg font-semibold text-foreground">
            You haven&apos;t created any events yet
          </p>
          <p className="max-w-sm text-sm text-muted-foreground">
            Create your first community event and it will show up here for
            management.
          </p>
          <Button asChild className="mt-2">
            <Link href="/create-event">
              <CalendarPlus className="mr-1.5 size-4" />
              Create your first event
            </Link>
          </Button>
        </div>
      )}

      {/* Events list */}
      {events && events.length > 0 && (
        <div className="space-y-4">
          {events.map((event) => {
            const isPast = new Date(event.eventDate).getTime() <= Date.now();
            return (
              <Card key={event.id} className="pt-0 transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-col gap-4 space-y-0 sm:flex-row">
                  <Link
                    href={`/events/${event.id}`}
                    className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg border bg-muted sm:w-44"
                  >
                    <Image
                      src={event.thumbnailUrl}
                      alt={event.title}
                      fill
                      sizes="176px"
                      className="object-cover transition-transform hover:scale-105"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge className={cn("border", getBadgeClass(event.eventType))}>
                        {event.eventType}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn(
                          isPast
                            ? "border-stone-300 text-stone-500"
                            : "border-emerald-300 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400"
                        )}
                      >
                        {isPast ? "Past" : "Upcoming"}
                      </Badge>
                    </div>
                    <h3 className="mt-2 line-clamp-1 text-lg font-bold text-foreground">
                      {event.title}
                    </h3>
                    <div className="mt-1.5 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-4 text-primary" />
                        {formatEventDate(event.eventDate)}
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="size-4 text-primary" />
                        <span className="line-clamp-1">{event.location}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="size-4 text-primary" />
                        {event._count?.participants ?? 0} joined
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <Separator />
                <CardFooter className="gap-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(event)}
                    disabled={isPast}
                    title={isPast ? "Past events cannot be edited" : "Edit event"}
                  >
                    <Pencil className="mr-1.5 size-4" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => setDeleting(event)}
                  >
                    <Trash2 className="mr-1.5 size-4" />
                    Delete
                  </Button>
                  <Button asChild variant="ghost" size="sm" className="ml-auto">
                    <Link href={`/events/${event.id}`}>View public page</Link>
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit dialog */}
      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit event</DialogTitle>
            <DialogDescription>
              Update any details below and save your changes.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <EventForm
              mode="edit"
              eventId={editing.id}
              defaultValues={editing as never}
              onCancel={() => setEditing(null)}
              onSuccess={() => {
                setEditing(null);
                loadEvents();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              &quot;{deleting?.title}&quot; will be permanently removed along with
              all join records. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={deleteLoading}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {deleteLoading ? "Deleting..." : "Yes, delete event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
