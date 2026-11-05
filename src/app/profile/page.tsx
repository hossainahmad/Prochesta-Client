"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api-client";
import {
  BadgeCheck,
  CalendarCheck2,
  LayoutList,
  Loader2,
  Save,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { SectionHeading } from "@/components/site/section-heading";

const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  photoURL: z
    .union([z.url("Photo URL must be a valid URL (or leave empty)"), z.literal("")])
    .optional(),
});

type ProfileValues = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user, status, refresh } = useAuth();
  const [saving, setSaving] = React.useState(false);
  const [stats, setStats] = React.useState<{ created: number; joined: number } | null>(
    null
  );

  const form = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", photoURL: "" },
  });

  // Sync form defaults when session loads
  React.useEffect(() => {
    if (user) {
      form.reset({ name: user.name ?? "", photoURL: user.image ?? "" });
    }
  }, [user, form]);

  React.useEffect(() => {
    if (status !== "authenticated") return;
    Promise.all([
      apiFetch("/api/my-events").then((r) => (r.ok ? r.json() : { events: [] })),
      apiFetch("/api/joined-events").then((r) => (r.ok ? r.json() : { events: [] })),
    ])
      .then(([mine, joined]) =>
        setStats({ created: mine.events.length, joined: joined.events.length })
      )
      .catch(() => setStats({ created: 0, joined: 0 }));
  }, [status]);

  const onSubmit = async (values: ProfileValues) => {
    setSaving(true);
    try {
      const res = await apiFetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Failed to update profile");
        return;
      }
      // Re-read the user from the API so the navbar/avatar update immediately
      await refresh();
      toast.success("Profile updated successfully! ✨");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || !user) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4 py-12 sm:px-6 lg:px-8">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
      <SectionHeading
        eyebrow="Private Dashboard"
        title="Your profile"
        description="View your account details and keep your information up to date."
        align="left"
      />

      {/* Identity card */}
      <Card className="mb-6 shadow-lg shadow-primary/5">
        <CardContent className="flex flex-col items-center gap-5 p-6 sm:flex-row sm:items-center">
          <Avatar className="size-20 border-2 border-primary/30 shadow-md">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? "Profile picture"}
            />
            <AvatarFallback className="bg-primary/10 text-2xl font-bold text-primary">
              {(user.name ?? "U")
                .split(" ")
                .map((p) => p[0])
                .slice(0, 2)
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 text-center sm:text-left">
            <h2 className="flex items-center justify-center gap-1.5 text-xl font-extrabold text-foreground sm:justify-start">
              {user.name}
              <BadgeCheck className="size-5 text-primary" aria-label="Verified" />
            </h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl border bg-secondary/50 px-4 py-3 text-center">
              <p className="text-xl font-extrabold text-primary">
                {stats?.created ?? "–"}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <LayoutList className="size-3" /> Created
              </p>
            </div>
            <div className="rounded-xl border bg-secondary/50 px-4 py-3 text-center">
              <p className="text-xl font-extrabold text-primary">
                {stats?.joined ?? "–"}
              </p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <CalendarCheck2 className="size-3" /> Joined
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Update form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserRound className="size-5 text-primary" />
            Update profile
          </CardTitle>
          <CardDescription>
            Change your display name and profile picture. Your email cannot be
            changed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="photoURL"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photo URL</FormLabel>
                      <FormControl>
                        <Input
                          type="url"
                          placeholder="https://example.com/avatar.jpg"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Paste any public image URL.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">Email:</span>{" "}
                  {user.email} (locked)
                </p>
                <Button type="submit" disabled={saving} className="min-w-36">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 size-4" /> Save changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
