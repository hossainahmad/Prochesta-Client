"use client";

import { motion } from "framer-motion";
import {
  CalendarClock,
  CalendarPlus,
  HandHeart,
  LayoutList,
  MoonStar,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/site/section-heading";

const FEATURES = [
  {
    icon: CalendarPlus,
    title: "Create Events in Minutes",
    description:
      "Host a cleanup, plantation, or donation drive with a guided form — pick a future date, add a thumbnail, and go live instantly.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: HandHeart,
    title: "One-Click Joining",
    description:
      "Found a cause you love? Join with a single click and your spot is saved — no paperwork, no friction, just showing up.",
    accent: "bg-leaf/15 text-sage",
  },
  {
    icon: LayoutList,
    title: "Manage Everything",
    description:
      "Update details, reschedule dates, or cancel events from a personal dashboard built for organizers.",
    accent: "bg-secondary text-secondary-foreground",
  },
  {
    icon: CalendarClock,
    title: "Always Up-to-Date",
    description:
      "The feed only shows upcoming events with live countdowns, so you never miss the causes happening around you.",
    accent: "bg-leaf/10 text-sage",
  },
  {
    icon: Users,
    title: "Track Your Impact",
    description:
      "Every event you join is added to your personal timeline — watch your community contribution grow over time.",
    accent: "bg-primary/10 text-primary",
  },
  {
    icon: MoonStar,
    title: "Light & Dark Themes",
    description:
      "Browse comfortably day or night with a full theme system that remembers your preference.",
    accent: "bg-secondary text-secondary-foreground",
  },
];

export function Features() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Why Volunify"
        title="Everything you need to give back"
        description="From creating your first event to tracking every hour you volunteer — a complete toolkit for community heroes."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.45, delay: (index % 3) * 0.1 }}
          >
            <Card className="h-full rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg hover:shadow-primary/10">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <span
                  className={`flex size-12 items-center justify-center rounded-2xl ${feature.accent}`}
                >
                  <feature.icon className="size-6" />
                </span>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
