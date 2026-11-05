"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api-client";
import { CalendarCheck2, HandHeart, Loader2, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface Props {
  eventId: string;
  eventTitle: string;
  initialJoined: boolean;
  isOwner: boolean;
  isPast: boolean;
  initialCount: number;
}

export function JoinEventButton({
  eventId,
  eventTitle,
  initialJoined,
  isOwner,
  isPast,
  initialCount,
}: Props) {
  const router = useRouter();
  const { status } = useAuth();
  const [joined, setJoined] = React.useState(initialJoined);
  const [count, setCount] = React.useState(initialCount);
  const [loading, setLoading] = React.useState(false);

  const handleJoin = async () => {
    // Public details page — but joining requires login (requirement)
    if (status !== "authenticated") {
      toast.info("Please login to join this event", {
        description: "You'll be redirected to the login page.",
      });
      router.push(`/login?callbackUrl=/events/${eventId}`);
      return;
    }

    setLoading(true);
    try {
      const res = await apiFetch(`/api/events/${eventId}/join`, { method: "POST" });
      const data = await res.json();

      if (res.status === 409) {
        setJoined(true);
        toast.info("You've already joined this event");
        return;
      }
      if (res.status === 403) {
        toast.warning(data.error ?? "You cannot join this event");
        return;
      }
      if (!res.ok) {
        toast.error(data.error ?? "Failed to join event");
        return;
      }

      setJoined(true);
      setCount((c) => c + 1);
      toast.success(`You joined "${eventTitle}"! 🎉`, {
        description: "Find it anytime under Joined Events.",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isOwner) {
    return (
      <Button size="lg" disabled className="h-12 w-full text-base">
        <UserCheck className="mr-2 size-5" />
        You created this event
      </Button>
    );
  }

  if (joined) {
    return (
      <Button
        size="lg"
        disabled
        className="h-12 w-full bg-emerald-600 text-base text-white hover:bg-emerald-600"
      >
        <CalendarCheck2 className="mr-2 size-5" />
        Already Joined · {count} going
      </Button>
    );
  }

  if (isPast) {
    return (
      <Button size="lg" disabled variant="outline" className="h-12 w-full text-base">
        This event has ended
      </Button>
    );
  }

  return (
    <Button
      size="lg"
      onClick={handleJoin}
      disabled={loading || status === "loading"}
      className="h-12 w-full text-base shadow-lg shadow-primary/25"
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 size-5 animate-spin" /> Joining...
        </>
      ) : (
        <>
          <HandHeart className="mr-2 size-5" />
          Join Event · {count} going
        </>
      )}
    </Button>
  );
}
