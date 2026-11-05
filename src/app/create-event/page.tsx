"use client";

import { useRouter } from "next/navigation";
import { CalendarPlus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { EventForm } from "@/components/events/event-form";
import { SectionHeading } from "@/components/site/section-heading";

export default function CreateEventPage() {
  const router = useRouter();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Private Dashboard"
        title="Create a new event"
        description="Fill in the details below and your event will appear on the Upcoming Events page for volunteers to join."
        align="left"
      />

      <Card className="shadow-xl shadow-primary/5">
        <CardContent className="p-6 sm:p-8">
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <CalendarPlus className="size-5" />
            </span>
            <p className="text-sm text-muted-foreground">
              You are creating this event as a{" "}
              <span className="font-semibold text-foreground">verified organizer</span>.
              Your account email will be stored with the event so only you can
              edit or delete it later.
            </p>
          </div>

          <EventForm
            mode="create"
            onSuccess={() => {
              // Requirement: redirect to Upcoming Events after successful creation
              router.push("/events");
              router.refresh();
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
