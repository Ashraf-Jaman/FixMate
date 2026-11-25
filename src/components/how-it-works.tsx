import {
  CalendarCheck,
  ClipboardCheck,
  Search,
  Wrench,
} from "lucide-react";

const steps = [
  {
    icon: Search,
    step: "01",
    title: "Describe Your Issue",
    description:
      "Tell us what's wrong with your device. Select the device type, describe the problem, and upload photos if needed.",
  },
  {
    icon: CalendarCheck,
    step: "02",
    title: "Book a Service",
    description:
      "Pick a time slot that works for you. Choose between doorstep repair or drop-off at a nearby service center.",
  },
  {
    icon: Wrench,
    step: "03",
    title: "Expert Repair",
    description:
      "A certified technician arrives on time, diagnoses the issue, and fixes your device using genuine parts.",
  },
  {
    icon: ClipboardCheck,
    step: "04",
    title: "Quality Assured",
    description:
      "Every repair is tested and verified before handover. You get a service warranty and a detailed repair report.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="scroll-mt-20 px-4 py-10 sm:px-6 sm:py-14 lg:px-8 lg:py-16"
    >
      <div className="mx-auto max-w-7xl">
        {/* ── Section Header ── */}
        <div className="text-center">
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl lg:text-5xl">
            Get Your Device Fixed in{" "}
            <span className="text-brand-orange">4 Easy Steps</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg sm:leading-8">
            From booking to repair — the entire process is designed to be fast,
            transparent, and hassle-free.
          </p>
        </div>

        {/* ── Steps Grid ── */}
        <div className="relative mt-14 grid gap-6 sm:mt-16 sm:grid-cols-2 sm:gap-8 lg:mt-20 lg:grid-cols-4">
          {/* Connecting line (desktop only) */}
          <div
            aria-hidden="true"
            className="absolute top-14 right-12 left-12 hidden h-0.5 bg-gradient-to-r from-[#e3ecfb] via-brand-orange/30 to-[#e3ecfb] lg:block"
          />

          {steps.map((item) => (
            <div
              key={item.step}
              className="relative rounded-2xl bg-white p-6 shadow-[0_4px_24px_-8px_rgba(15,37,68,0.08)] ring-1 ring-[#e3ecfb] transition-shadow hover:shadow-[0_8px_32px_-8px_rgba(15,37,68,0.14)] sm:rounded-3xl sm:p-8"
            >
              {/* Step number badge */}
              <div className="flex items-center gap-4">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-brand-orange text-sm font-bold text-white shadow-[0_6px_20px_-6px_rgba(249,115,22,0.5)] sm:size-14 sm:text-base">
                  {item.step}
                </span>
                <item.icon
                  aria-hidden="true"
                  className="size-6 text-brand-navy/40 sm:size-7"
                />
              </div>

              <h3 className="mt-5 text-lg font-bold text-brand-navy sm:mt-6 sm:text-xl">
                {item.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base sm:leading-7">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
