import { cn } from "@/lib/utils";
import { HandHeart, HandHeartIcon } from "lucide-react";

export function Logo({
  className,
  textClassName,
}: {
  className?: string;
  textClassName?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
        <HandHeartIcon className="size-5" aria-hidden="true" />
      </span>
      <span
        className={cn(
          "font-heading text-xl font-extrabold tracking-tight text-foreground",
          textClassName,
        )}
      >
        Pro<span className="text-primary">chesta</span>
      </span>
    </span>
  );
}
