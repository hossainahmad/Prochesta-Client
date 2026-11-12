"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, LogIn } from "lucide-react";
import { toast } from "sonner";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/site/logo";
import { loginSchema } from "@/lib/validations";

type LoginValues = z.infer<typeof loginSchema>;

/** Google "G" mark */
function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M12 5.04c1.62 0 3.06.56 4.2 1.64l3.12-3.12C17.46 1.8 14.96.75 12 .75 7.62.75 3.84 3.27 2.04 6.86l3.66 2.84C6.55 7.02 9.05 5.04 12 5.04z"
      />
      <path
        fill="#4285F4"
        d="M23.25 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.32-5.17 3.32-8.82z"
      />
      <path
        fill="#FBBC05"
        d="M5.7 14.71c-.23-.69-.36-1.42-.36-2.21s.13-1.52.36-2.21L2.04 7.45C1.27 8.99.83 10.72.83 12.5s.44 3.51 1.21 5.05l3.66-2.84z"
      />
      <path
        fill="#34A853"
        d="M12 23.25c3.04 0 5.6-1 7.46-2.72l-3.86-3c-1.07.72-2.44 1.15-3.6 1.15-2.95 0-5.45-1.98-6.3-4.66l-3.66 2.84c1.8 3.59 5.58 6.39 9.96 6.39z"
      />
    </svg>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [googleAvailable, setGoogleAvailable] = React.useState(false);

  React.useEffect(() => {
    fetch("/api/auth/providers", { credentials: "include" })
      .then((res) => res.json())
      .then((providers) => setGoogleAvailable(Boolean(providers?.google)))
      .catch(() => setGoogleAvailable(false));
  }, []);

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: LoginValues) => {
    setSubmitting(true);
    try {
      const res = await apiFetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        toast.error("Invalid email or password", {
          description: "Please check your credentials and try again.",
        });
      } else {
        toast.success("Login successful! Welcome back 🎉");
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = () => {
    if (!googleAvailable) {
      toast.info("Google login isn't configured in this environment", {
        description:
          "Set GOOGLE_CLIENT_ID & GOOGLE_CLIENT_SECRET on the API server to enable it. Use email/password for now.",
      });
      return;
    }
    // External OAuth host redirect — Next Router cannot handle cross-origin navigation
    window.location.replace("/api/auth/google");
  };

  return (
    <Card className="w-full max-w-md shadow-xl shadow-primary/5">
      <CardHeader className="items-center text-center">
        <Link href="/" className="mb-2">
          <Logo />
        </Link>
        <CardTitle className="text-2xl font-extrabold">Welcome back</CardTitle>
        <CardDescription>
          Login to create, join and manage community events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
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
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" /> Logging in...
                </>
              ) : (
                <>
                  <LogIn className="mr-2 size-4" /> Login
                </>
              )}
            </Button>
          </form>
        </Form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator />
          </div>
          <span className="relative mx-auto block w-fit bg-card px-3 text-xs uppercase tracking-wider text-muted-foreground">
            or continue with
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={handleGoogle}
        >
          <GoogleIcon />
          Continue with Google
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          New to Volunify?{" "}
          <Link
            href="/register"
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="bg-dots relative flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 right-0 size-72 rounded-full bg-primary/10 blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <Suspense
          fallback={
            <div className="h-[480px] w-full max-w-md animate-pulse rounded-xl bg-card" />
          }
        >
          <LoginForm />
        </Suspense>
      </motion.div>
    </div>
  );
}
