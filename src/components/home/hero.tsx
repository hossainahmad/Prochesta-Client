"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarPlus,
  Leaf,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STATS = [
  { icon: Users, value: "2,400+", label: "Volunteers" },
  { icon: Leaf, value: "1,150+", label: "Trees Planted" },
  { icon: ShieldCheck, value: "120+", label: "Events Hosted" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-secondary dark:bg-card/60">
      {/* decorative blobs + dotted texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 size-96 rounded-full bg-leaf/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 -right-24 size-80 rounded-full bg-amber-300/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="bg-dots pointer-events-none absolute inset-0 opacity-70"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2 lg:px-8">
        {/* Copy */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-start gap-6"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-card px-4 py-1.5 text-sm font-semibold text-primary shadow-sm">
            <Leaf className="size-4 text-leaf" />
            Community-powered social change
          </span>

          <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Create. Join.{" "}
            <span className="relative inline-block text-leaf">
              Impact.
              <svg
                className="absolute -bottom-2 left-0 w-full text-leaf/40"
                viewBox="0 0 120 12"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 9C30 3 60 2 118 8"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg>
            </span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Discover and organize social service events in your neighborhood —
            winter clothes distribution, tree plantation, cleanup drives and
            more. Prochesta connects kind hearts with the causes that need them
            most.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <Link href="/events">
                Browse Events
                <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-6 text-base"
            >
              <Link href="/create-event">
                <CalendarPlus className="mr-1.5 size-4 text-primary" />
                Create an Event
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <dl className="mt-4 grid w-full max-w-md grid-cols-3 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border bg-card p-4 text-center shadow-sm"
              >
                <span className="mx-auto mb-1.5 flex size-8 items-center justify-center rounded-full bg-primary/10">
                  <stat.icon className="size-4 text-primary" />
                </span>
                <dd className="font-heading text-xl font-extrabold text-foreground">
                  {stat.value}
                </dd>
                <dt className="text-xs text-muted-foreground">{stat.label}</dt>
              </div>
            ))}
          </dl>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative"
        >
          <div className="relative aspect-[3/2] overflow-hidden rounded-3xl border shadow-2xl shadow-primary/20">
            <Image
              src="/images/hero.jpg"
              alt="Volunteers working together at a community service event"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            {/* floating card */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl border bg-background/90 p-3.5 backdrop-blur-md sm:left-6 sm:right-auto sm:w-80">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <ShieldCheck className="size-6" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-foreground">
                  Winter Clothes Distribution
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  Mirpur 10, Dhaka · happening soon
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
