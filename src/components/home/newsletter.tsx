"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { BellRing, MailCheck, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/** Newsletter subscription section (visual/demo only — no backend required) */
export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    setSubscribed(true);
    toast.success("You're on the list! 🎉 We'll keep you posted.");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="bg-dots relative overflow-hidden rounded-[2rem] bg-primary px-6 py-14 text-center shadow-xl shadow-primary/20 sm:px-12"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-leaf/30 blur-2xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 -left-10 size-56 rounded-full bg-white/10 blur-2xl"
        />

        <span className="relative mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-white/15 text-white backdrop-blur-sm">
          <BellRing className="size-7" />
        </span>
        <h2 className="relative mx-auto max-w-xl font-heading text-3xl font-extrabold text-white sm:text-4xl">
          Never miss a chance to help
        </h2>
        <p className="relative mx-auto mt-3 max-w-xl text-white/85">
          Subscribe to our newsletter and get the newest community events in
          your inbox every week. No spam — only kindness.
        </p>

        <form
          onSubmit={handleSubmit}
          className="relative mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="newsletter-email" className="sr-only">
            Email address
          </label>
          <Input
            id="newsletter-email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={subscribed}
            className="h-12 flex-1 border-white/30 bg-white/95 text-gray-900 placeholder:text-gray-500 focus-visible:ring-white"
          />
          <Button
            type="submit"
            disabled={subscribed}
            className="h-12 bg-white px-6 text-base font-semibold text-primary hover:bg-white/90"
          >
            {subscribed ? (
              <>
                <MailCheck className="mr-1.5 size-4" /> Subscribed
              </>
            ) : (
              <>
                Subscribe <Send className="ml-1.5 size-4" />
              </>
            )}
          </Button>
        </form>
        <p className="relative mt-3 text-xs text-white/70">
          Join 2,400+ volunteers already subscribed
        </p>
      </motion.div>
    </section>
  );
}
