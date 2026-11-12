import Link from "next/link";
import {
  Facebook,
  Github,
  Instagram,
  Mail,
  MapPin,
  Phone,
  Youtube,
} from "lucide-react";
import { Logo } from "@/components/site/logo";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/constants";

function XLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.451-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
    </svg>
  );
}

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Upcoming Events" },
  { href: "/create-event", label: "Create Event" },
  { href: "/manage-events", label: "Manage Events" },
  { href: "/joined-events", label: "Joined Events" },
];

const EVENT_CATEGORIES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Blood Drive",
  "Food Distribution",
  "Education",
];

const SOCIALS = [
  { label: "X (Twitter)", href: "https://x.com", icon: XLogo },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "YouTube", href: "https://youtube.com", icon: Youtube },
  { label: "GitHub", href: "https://github.com", icon: Github },
];

export function Footer() {
  return (
    <footer className="mt-auto bg-deep text-[#dfe8dc] dark:bg-[#04211f]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4">
            <Logo textClassName="text-white" />
            <p className="max-w-xs text-sm leading-relaxed text-[#b7c9bf]">
              {SITE_DESCRIPTION}
            </p>
            <div className="flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${SITE_NAME} on ${social.label}`}
                  className="flex size-9 items-center justify-center rounded-full bg-white/10 text-[#dfe8dc] transition-colors hover:bg-leaf"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <nav aria-label="Footer quick links">
            <h3 className="mb-4 font-heading text-base font-bold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link.href + link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#b7c9bf] transition-colors hover:text-leaf"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Categories */}
          <nav aria-label="Event categories">
            <h3 className="mb-4 font-heading text-base font-bold uppercase tracking-wider text-white">
              Event Types
            </h3>
            <ul className="space-y-2.5">
              {EVENT_CATEGORIES.map((category) => (
                <li key={category}>
                  <Link
                    href={`/events?type=${encodeURIComponent(category)}`}
                    className="text-sm text-[#b7c9bf] transition-colors hover:text-leaf"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-heading text-base font-bold uppercase tracking-wider text-white">
              Get in Touch
            </h3>
            <ul className="space-y-3 text-sm text-[#b7c9bf]">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-leaf" />
                <span>House 12, Road 5, Dhanmondi, Dhaka 1205, Bangladesh</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-leaf" />
                <a href="tel:+8801712345678" className="hover:text-leaf">
                  +880 1712 345 678
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-leaf" />
                <a
                  href="mailto:hello@prochesta.test"
                  className="hover:text-leaf"
                >
                  hello@prochest.test
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 pb-[max(0.25rem,env(safe-area-inset-bottom))] sm:flex-row">
          <p className="text-xs text-[#9db8a6]">
            © {new Date().getFullYear()} {SITE_NAME}. Built with 💚 for
            community volunteers.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#9db8a6]">
            <span className="cursor-default transition-colors hover:text-leaf">
              Privacy Policy
            </span>
            <span className="cursor-default transition-colors hover:text-leaf">
              Terms of Service
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
