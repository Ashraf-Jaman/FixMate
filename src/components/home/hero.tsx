import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Text */}
        <div className="text-center lg:text-left">
          <p className="text-xs font-bold tracking-widest text-brand-orange uppercase">
            Trusted Home &amp; Device Repairs
          </p>

          <h1 className="mt-3 text-4xl leading-[1.1] font-extrabold tracking-tight text-brand-navy sm:text-5xl">
            Simple, fast repairs{" "}
            <span className="text-brand-orange">at your doorstep.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-slate-600 lg:mx-0">
            Book verified technicians for your phones, laptops, and home
            appliances. Pay only after the work is done.
          </p>

          <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
            <Button
              asChild
              className="h-11 w-full rounded-full bg-brand-orange px-7 text-sm font-semibold text-white hover:bg-[#ea6a0c] sm:w-auto"
            >
              <Link href="/services">
                Browse Services
                <ArrowRight className="size-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-11 w-full rounded-full border-header-border bg-white px-7 text-sm font-semibold text-brand-navy hover:bg-slate-50 sm:w-auto"
            >
              <Link href="/sign-up">Become a Technician</Link>
            </Button>
          </div>
        </div>

        {/* Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-white shadow-[0_24px_60px_-32px_rgba(15,37,68,0.2)] ring-1 ring-[#e3ecfb]">
          <Image
            src="/images/hero-minimal.jpg"
            alt="Technician repairing a laptop on a clean desk"
            fill
            priority
            sizes="(max-width: 1024px) 92vw, 45vw"
            className="object-cover object-center"
          />
        </div>
      </div>
    </section>
  );
}
