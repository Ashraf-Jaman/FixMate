import Image from "next/image";
import { Award, Clock, Shield, Users } from "lucide-react";

const stats = [
  { icon: Users, value: "10K+", label: "Happy Customers" },
  { icon: Award, value: "50+", label: "Expert Technicians" },
  { icon: Clock, value: "30 min", label: "Avg. Response Time" },
  { icon: Shield, value: "1 Year", label: "Service Warranty" },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-20 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        {/* ── Section Header ── */}
        <div className="text-center">
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl lg:text-5xl">
            Your Trusted Repair{" "}
            <span className="text-brand-orange">Partner</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
            FixMate connects you with certified technicians who bring expert
            repair services right to your doorstep — no hassle, no hidden fees.
          </p>
        </div>

        {/* ── Content Grid ── */}
        <div className="mt-14 grid items-center gap-10 sm:mt-16 lg:mt-20 lg:grid-cols-2 lg:gap-16">
          {/* Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl sm:rounded-3xl">
            <Image
              src="/images/about-team.jpg"
              alt="FixMate team of certified repair technicians"
              fill
              sizes="(max-width: 1024px) 90vw, 45vw"
              className="object-cover object-center"
            />
          </div>

          {/* Text + Stats */}
          <div>
            <h3 className="text-2xl font-bold leading-snug text-brand-navy sm:text-3xl">
              We make device repair{" "}
              <span className="text-brand-orange">simple & stress-free</span>
            </h3>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Founded with a mission to eliminate the frustration of broken
              devices, FixMate provides fast, transparent, and affordable repair
              services. Our certified technicians handle everything from
              smartphones and laptops to home appliances — all backed by a
              satisfaction guarantee.
            </p>

            <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              We believe everyone deserves access to reliable repair services
              without the runaround. Book online, track your repair in
              real-time, and get back to what matters most.
            </p>

            {/* Stats Grid */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-[#f4f8ff] p-4 ring-1 ring-[#e3ecfb] sm:rounded-2xl sm:p-5"
                >
                  <stat.icon
                    aria-hidden="true"
                    className="size-5 text-brand-orange sm:size-6"
                  />
                  <p className="mt-2 text-xl font-extrabold text-brand-navy sm:text-2xl">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs font-medium text-slate-500 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
