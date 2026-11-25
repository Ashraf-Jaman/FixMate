import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Play, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";

const customers = [
  { src: "/images/avatar-1.jpg", alt: "Happy FixMate customer" },
  { src: "/images/avatar-2.jpg", alt: "Happy FixMate customer" },
  { src: "/images/avatar-3.jpg", alt: "Happy FixMate customer" },
];

export function Hero() {
  return (
    <section className="px-4 pt-4 pb-10 sm:px-6 sm:pt-6 lg:px-8 lg:pt-8">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-2xl bg-gradient-to-br from-white via-[#f4f8ff] to-[#e6eefc] shadow-[0_35px_90px_-60px_rgba(15,37,68,0.5)] ring-1 ring-white/70 sm:rounded-3xl lg:rounded-[2rem]">
        <div className="grid items-center gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ── Text Column ── */}
          <div className="relative z-10 px-5 pt-8 pb-8 text-center sm:px-8 sm:pt-10 sm:pb-10 md:px-10 lg:py-16 lg:pr-8 lg:pl-10 lg:text-left xl:pl-14">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#e3ecfb] px-3.5 py-1.5 text-xs font-semibold text-brand-navy">
              <ShieldCheck aria-hidden="true" className="size-4" />
              Trusted Repair Service
            </span>

            <h1 className="mt-5 text-3xl font-extrabold leading-[1.08] tracking-[-0.03em] text-brand-navy sm:mt-6 sm:text-4xl md:text-5xl lg:text-[3rem] xl:text-[4rem]">
              Fix Your Devices,
              <span className="block text-brand-orange">Live Better</span>
            </h1>

            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-slate-600 sm:mt-5 sm:text-base sm:leading-7 md:text-lg md:leading-8 lg:mx-0">
              On-demand repair service for your smart devices and home
              appliances. Fast. Reliable. Secure.
            </p>

            {/* CTA Buttons */}
            <div className="mt-6 flex flex-col items-center gap-4 sm:mt-8 sm:flex-row sm:justify-center lg:justify-start">
              <Button
                asChild
                className="h-11 w-full rounded-full bg-brand-orange px-6 text-[15px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(249,115,22,0.75)] hover:bg-[#ea6a0c] sm:h-12 sm:w-auto"
              >
                <Link href="/book">
                  Book a Service
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              </Button>

              <button
                type="button"
                className="group inline-flex items-center gap-3 rounded-full text-[15px] font-semibold text-brand-navy"
              >
                <span className="grid size-10 place-items-center rounded-full bg-white shadow-[0_10px_26px_-12px_rgba(15,37,68,0.55)] ring-1 ring-black/5 transition-transform group-hover:scale-105 sm:size-11">
                  <Play
                    aria-hidden="true"
                    className="size-4 translate-x-px fill-brand-navy text-brand-navy"
                  />
                </span>
                Watch Video
              </button>
            </div>

            {/* Social Proof */}
            <div className="mt-7 flex items-center justify-center gap-3 sm:mt-9 lg:justify-start">
              <div className="flex -space-x-2.5">
                {customers.map((customer, index) => (
                  <Image
                    key={customer.src}
                    src={customer.src}
                    alt={customer.alt}
                    width={40}
                    height={40}
                    className="size-8 rounded-full object-cover ring-2 ring-white sm:size-10"
                    priority={index === 0}
                  />
                ))}
              </div>
              <p className="text-sm text-slate-600">
                <span className="font-bold text-brand-navy">10K+</span> Happy
                Customers
              </p>
            </div>
          </div>

          {/* ── Image Column ── */}
          <div className="relative px-4 pb-5 sm:px-6 sm:pb-7 md:px-8 md:pb-8 lg:p-8">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:rounded-3xl lg:aspect-[3/4] lg:rounded-[2.5rem]">
              <Image
                src="/images/hero-repair.jpg"
                alt="FixMate technician carefully repairing a smartphone circuit board"
                fill
                priority
                sizes="(max-width: 640px) 92vw, (max-width: 1024px) 85vw, 46vw"
                className="object-cover object-center"
              />

              {/* Floating badge */}
              <div className="absolute top-3 right-3 flex items-center gap-2 rounded-xl bg-white p-2.5 pr-3 shadow-[0_18px_40px_-24px_rgba(15,37,68,0.65)] ring-1 ring-black/5 sm:top-5 sm:right-5 sm:gap-3 sm:rounded-2xl sm:p-3 sm:pr-4">
                <span className="grid size-7 place-items-center rounded-full bg-emerald-500 text-white sm:size-9">
                  <Check
                    aria-hidden="true"
                    className="size-4 sm:size-5"
                    strokeWidth={3}
                  />
                </span>
                <span className="text-xs leading-tight font-semibold text-brand-navy sm:text-[13px]">
                  Expert
                  <br />
                  Technicians
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
