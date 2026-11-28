"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, User as UserIcon } from "lucide-react";

import { BrandLogo } from "@/components/shared/brand-logo";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About", href: "/#about" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = useSession();

  async function handleSignOut() {
    await signOut();
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-header-border bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <div className="mx-auto flex h-[76px] w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center">
          <BrandLogo />
        </div>

        <nav aria-label="Main" className="hidden items-center gap-7 lg:flex xl:gap-9">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="text-[15px] font-semibold text-slate-700 transition-colors hover:text-brand-orange"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3">
          {!isPending && session?.user ? (
            <div className="hidden items-center gap-3 lg:flex">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-full border border-header-border bg-[#f8faff] py-1.5 pr-3 pl-2 transition-colors hover:border-brand-orange/40"
              >
                <span className="grid size-7 place-items-center rounded-full bg-brand-orange/10 text-brand-orange">
                  <UserIcon className="size-4" />
                </span>
                <span className="text-sm font-semibold text-brand-navy">
                  {session.user.name || session.user.email}
                </span>
              </Link>
              <Button
                type="button"
                variant="outline"
                onClick={handleSignOut}
                className="h-10 rounded-full border-header-border bg-white px-4 text-sm font-semibold text-slate-700 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="size-4" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button
                asChild
                variant="outline"
                className="hidden h-10 rounded-full border-header-border bg-white px-5 text-[15px] font-semibold text-brand-navy hover:bg-slate-50 hover:text-brand-navy lg:inline-flex"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>

              <Button
                asChild
                className="hidden h-10 rounded-full bg-brand-orange px-5 text-[15px] font-semibold text-white shadow-[0_4px_12px_-6px_rgba(249,115,22,0.55)] hover:bg-[#ea6a0c] lg:inline-flex"
              >
                <Link href="/sign-up">Sign Up</Link>
              </Button>
            </>
          )}

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Open navigation menu"
                className="size-11 rounded-full text-brand-navy hover:bg-slate-100 sm:size-10 lg:hidden"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[86%] max-w-sm gap-0 border-header-border bg-white p-0"
            >
              <SheetHeader className="flex-row items-center border-b border-header-border p-5 pr-14">
                <BrandLogo />
                <SheetTitle className="sr-only">Site navigation</SheetTitle>
                <SheetDescription className="sr-only">
                  Links to the main sections of FixMate and account actions.
                </SheetDescription>
              </SheetHeader>

              <nav aria-label="Mobile" className="flex flex-col gap-1 p-4">
                {navItems.map((item) => (
                  <SheetClose key={item.href} asChild>
                    <Link
                      href={item.href}
                      aria-current={pathname === item.href ? "page" : undefined}
                      className={cn(
                        "rounded-xl px-3 py-3 text-base font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-brand-orange",
                        pathname === item.href && "bg-slate-50",
                      )}
                    >
                      {item.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>

              <SheetFooter className="mt-auto gap-2 border-t border-header-border p-4">
                {!isPending && session?.user ? (
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex items-center gap-2 rounded-xl bg-[#f8faff] p-3 text-left">
                      <span className="grid size-8 place-items-center rounded-lg bg-brand-orange/10 text-brand-orange">
                        <UserIcon className="size-4" />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-brand-navy">
                          {session.user.name}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                          {session.user.email}
                        </p>
                      </div>
                    </div>
                    <SheetClose asChild>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "h-11 w-full rounded-full border-header-border bg-white text-[15px] font-semibold text-red-600 hover:bg-red-50",
                        )}
                      >
                        <LogOut className="size-4" />
                        Sign Out
                      </button>
                    </SheetClose>
                  </div>
                ) : (
                  <>
                    <SheetClose asChild>
                      <Link
                        href="/sign-in"
                        className={cn(
                          buttonVariants({ variant: "outline" }),
                          "h-11 w-full rounded-full border-header-border bg-white text-[15px] font-semibold text-brand-navy hover:bg-slate-50 hover:text-brand-navy",
                        )}
                      >
                        Sign In
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/sign-up"
                        className={cn(
                          buttonVariants(),
                          "h-11 w-full rounded-full bg-brand-orange text-[15px] font-semibold text-white hover:bg-[#ea6a0c]",
                        )}
                      >
                        Sign Up
                      </Link>
                    </SheetClose>
                  </>
                )}
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
