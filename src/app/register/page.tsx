"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  Check,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api-client";
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
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const registerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(60, "Name is too long"),
  email: z.email("Please enter a valid email address"),
  photoURL: z
    .union([z.url("Photo URL must be a valid URL (or leave empty)"), z.literal("")])
    .optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
});

type RegisterValues = z.infer<typeof registerFormSchema>;

const passwordRules = [
  { label: "At least 6 characters", test: (v: string) => v.length >= 6 },
  { label: "One uppercase letter (A-Z)", test: (v: string) => /[A-Z]/.test(v) },
  { label: "One lowercase letter (a-z)", test: (v: string) => /[a-z]/.test(v) },
];

function PasswordChecklist({ value }: { value: string }) {
  return (
    <ul className="mt-2 space-y-1" aria-live="polite">
      {passwordRules.map((rule) => {
        const passed = rule.test(value);
        return (
          <li
            key={rule.label}
            className={cn(
              "flex items-center gap-1.5 text-xs transition-colors",
              passed ? "text-emerald-600 dark:text-emerald-400" : "text-muted-foreground"
            )}
          >
            {passed ? (
              <Check className="size-3.5" />
            ) : (
              <X className="size-3.5" />
            )}
            {rule.label}
          </li>
        );
      })}
    </ul>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: { name: "", email: "", photoURL: "", password: "" },
  });

  const passwordValue = form.watch("password") ?? "";

  const onSubmit = async (values: RegisterValues) => {
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Registration failed", {
          description: "Please fix the errors and try again.",
        });
        return;
      }

      toast.success("Registration successful! 🎉", {
        description: "Please login with your new account.",
      });
      router.push(`/login?callbackUrl=/`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-dots relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-0 size-72 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Card className="w-full shadow-xl shadow-primary/5">
          <CardHeader className="items-center text-center">
            <Link href="/" className="mb-2">
              <Logo />
            </Link>
            <CardTitle className="text-2xl font-extrabold">
              Join the community
            </CardTitle>
            <CardDescription>
              Create a free account to start making a difference
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                noValidate
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Rafi Ahmed" autoComplete="name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          autoComplete="email"
                          {...field}
                        />
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
                          autoComplete="photo"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Optional — link to your profile picture.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute inset-y-0 right-3 flex items-center text-muted-foreground transition-colors hover:text-foreground"
                          >
                            {showPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <PasswordChecklist value={passwordValue} />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 size-4 animate-spin" /> Creating
                      account...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 size-4" /> Register
                    </>
                  )}
                </Button>
              </form>
            </Form>

            <p className="mt-5 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-primary underline-offset-4 hover:underline"
              >
                Login here
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
