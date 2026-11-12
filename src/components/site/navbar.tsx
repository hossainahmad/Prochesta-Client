"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { apiFetch } from "@/lib/api-client";
import { useTheme } from "next-themes";
import {
  CalendarPlus,
  CalendarCheck2,
  LayoutList,
  LogOut,
  Menu,
  Moon,
  Sun,
  UserRound,
  CalendarDays,
  House,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Logo } from "@/components/site/logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Home", icon: House },
  { href: "/events", label: "Upcoming Events", icon: CalendarDays },
];

const USER_LINKS = [
  { href: "/create-event", label: "Create Event", icon: CalendarPlus },
  { href: "/manage-events", label: "Manage Events", icon: LayoutList },
  { href: "/joined-events", label: "Joined Events", icon: CalendarCheck2 },
  { href: "/profile", label: "Profile", icon: UserRound },
];

function getInitials(name?: string | null) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, status, refresh } = useAuth();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleLogout = async () => {
    await apiFetch("/api/auth/logout", { method: "POST" });
    await refresh();
    router.push("/");
    router.refresh();
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <nav
        className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <Link href="/" aria-label="Prochesta home">
          <Logo />
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition-colors",
                isActive(link.href)
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() =>
              setTheme(resolvedTheme === "dark" ? "light" : "dark")
            }
          >
            <Sun className="size-5 scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-5 scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {status === "loading" ? (
            <Skeleton className="size-10 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenuTrigger asChild>
                    <button
                      className="rounded-full outline-none ring-primary focus-visible:ring-2"
                      aria-label="Open user menu"
                    >
                      <Avatar className="size-10 border border-border transition-opacity hover:opacity-85">
                        <AvatarImage
                          src={user.image ?? undefined}
                          alt={user.name ?? "Profile picture"}
                        />
                        <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  {user.name ?? "User"}
                </TooltipContent>
              </Tooltip>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-semibold">{user.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  {USER_LINKS.map((link) => (
                    <DropdownMenuItem key={link.href} asChild>
                      <Link href={link.href} className="cursor-pointer">
                        <link.icon className="mr-2 size-4 text-primary" />
                        {link.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="hidden sm:inline-flex">
              <Link href="/login">Login</Link>
            </Button>
          )}

          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetHeader>
                <SheetTitle>
                  <Logo />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-1 px-4">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors",
                      isActive(link.href)
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <link.icon className="size-4" />
                    {link.label}
                  </Link>
                ))}

                {user && (
                  <>
                    <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      My account
                    </p>
                    {USER_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-semibold transition-colors",
                          isActive(link.href)
                            ? "bg-secondary text-secondary-foreground"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <link.icon className="size-4" />
                        {link.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="mt-2 flex items-center gap-3 rounded-full px-3 py-2.5 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                    >
                      <LogOut className="size-4" />
                      Logout
                    </button>
                  </>
                )}

                {!user && (
                  <div className="mt-4 flex flex-col gap-2 px-1">
                    <Button asChild onClick={() => setOpen(false)}>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      onClick={() => setOpen(false)}
                    >
                      <Link href="/register">Register</Link>
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
