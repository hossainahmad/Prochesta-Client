"use client";

import Image from "next/image";
import { SectionHeading } from "@/components/site/section-heading";

const GALLERY_ITEMS = [
  { src: "/images/events/winter-clothes.jpg", caption: "Winter clothes distribution" },
  { src: "/images/events/plantation.jpg", caption: "Tree plantation drive" },
  { src: "/images/events/cleanup.jpg", caption: "Lakeside cleanup" },
  { src: "/images/events/food.jpg", caption: "Community food share" },
  { src: "/images/events/blood.jpg", caption: "Blood donation camp" },
  { src: "/images/events/education.jpg", caption: "Books for bright futures" },
  { src: "/images/events/blanket.jpg", caption: "Blanket distribution" },
  { src: "/images/events/awareness.jpg", caption: "Awareness rally" },
];

export function Gallery() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Gallery"
        title="Moments of kindness"
        description="A glimpse of the smiles, dirty hands, and full hearts from past community service events."
      />
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {GALLERY_ITEMS.map((item, index) => (
          <figure
            key={item.src}
            className="group relative aspect-square overflow-hidden rounded-3xl bg-muted"
          >
            <Image
              src={item.src}
              alt={item.caption}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 via-black/10 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <figcaption className="translate-y-2 text-sm font-medium text-white transition-transform duration-300 group-hover:translate-y-0">
                {item.caption}
              </figcaption>
            </div>
            <span
              aria-hidden="true"
              className="absolute top-3 left-3 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold tracking-wider text-white uppercase backdrop-blur-sm"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
          </figure>
        ))}
      </div>
    </section>
  );
}
