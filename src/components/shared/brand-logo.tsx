import Link from "next/link";
import { House, Wrench } from "lucide-react";

import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  href = "/",
  ...props
}: Omit<React.ComponentProps<typeof Link>, "href"> & { href?: string }) {
  return (
    <Link
      href={href}
      aria-label="FixMate home"
      className={cn("flex shrink-0 items-center gap-2.5", className)}
      {...props}
    >
      <span className="relative flex size-9 items-center justify-center sm:size-10">
        <House
          aria-hidden="true"
          className="size-9 text-brand-navy sm:size-10"
          strokeWidth={2.25}
        />
        <span className="absolute -right-1 -bottom-1 grid size-4.5 place-items-center rounded-full bg-white sm:size-5">
          <Wrench
            aria-hidden="true"
            className="size-3 text-brand-orange sm:size-3.5"
            strokeWidth={2.75}
          />
        </span>
      </span>
      <span className="text-2xl leading-none font-extrabold tracking-tight text-brand-navy sm:text-[26px]">
        Fix<span className="text-brand-orange">Mate</span>
      </span>
    </Link>
  );
}
