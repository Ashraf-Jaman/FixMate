"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Cpu,
  Heart,
  Loader2,
  MapPin,
  Star,
  User,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";
import type { ServiceItem } from "./browse-services";

interface ServiceDetailProps {
  serviceId: string;
}

function formatDuration(minutesOrText: string): string {
  const mins = Number(minutesOrText);
  if (Number.isNaN(mins)) return minutesOrText;
  if (mins < 60) return `${mins} mins`;
  const hrs = mins / 60;
  return hrs === 1 ? "1 hour" : `${hrs} hours`;
}

export function ServiceDetail({ serviceId }: ServiceDetailProps) {
  const phoneInputRef = useRef<HTMLInputElement>(null);
  const { data: session } = useSession();

  const [service, setService] = useState<ServiceItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [selectedThumb, setSelectedThumb] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const saved = JSON.parse(
        localStorage.getItem("fixmate_wishlist") || "[]",
      ) as { _id: string }[];
      return saved.some((item) => item._id === serviceId);
    } catch {
      return false;
    }
  });

  // Request form state
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [problemDescription, setProblemDescription] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadService() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiBaseUrl}/api/services/${serviceId}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.message || "Service not found.");
        }
        const data = await res.json();
        if (isMounted) {
          setService(data.service);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setFetchError(
            err instanceof Error ? err.message : "Failed to load service.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadService();
    return () => {
      isMounted = false;
    };
  }, [serviceId]);

  async function handleRequestSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);

    if (!phone.trim() || !address.trim() || !problemDescription.trim()) {
      setFormError(
        "Please enter your phone number, address, and problem description.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const apiBaseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(
        `${apiBaseUrl}/api/services/${serviceId}/requests`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            customerEmail: session?.user?.email || "",
            phone: phone.trim(),
            address: address.trim(),
            preferredDate,
            problemDescription: problemDescription.trim(),
          }),
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to submit repair request.");
      }

      setSubmitted(true);
      setPhone("");
      setAddress("");
      setPreferredDate("");
      setProblemDescription("");
    } catch (err: unknown) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function focusRequestForm() {
    phoneInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    phoneInputRef.current?.focus();
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <div className="animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e3ecfb]">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="aspect-[4/3] rounded-2xl bg-slate-100" />
              <div className="space-y-3">
                <div className="h-7 w-3/4 rounded bg-slate-100" />
                <div className="h-4 w-1/3 rounded bg-slate-100" />
                <div className="h-7 w-1/4 rounded bg-slate-100" />
                <div className="h-16 w-full rounded bg-slate-100" />
              </div>
            </div>
          </div>
        </div>
        <div className="h-96 animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e3ecfb]" />
      </div>
    );
  }

  if (fetchError || !service) {
    return (
      <div className="rounded-2xl bg-white p-10 text-center shadow-sm ring-1 ring-[#e3ecfb]">
        <h2 className="text-xl font-bold text-brand-navy">
          {fetchError || "Service not found"}
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          The service you are looking for may have been removed or is unavailable.
        </p>
        <Button
          asChild
          className="mt-6 rounded-full bg-brand-orange text-white hover:bg-[#ea6a0c]"
        >
          <Link href="/services">
            <ArrowLeft className="size-4" />
            Back to Services
          </Link>
        </Button>
      </div>
    );
  }

  const thumbnails = service.image
    ? [service.image, service.image, service.image]
    : [];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/services"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition-colors hover:text-brand-orange"
        >
          <ArrowLeft className="size-4" />
          Back to Services
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_340px] lg:items-start">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Top Overview Card */}
          <div className="rounded-2xl bg-white p-5 shadow-[0_14px_40px_-24px_rgba(15,37,68,0.18)] ring-1 ring-[#e3ecfb] sm:p-6">
            <div className="grid gap-6 md:grid-cols-[1fr_1.05fr]">
              {/* Image Gallery */}
              <div>
                <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#f4f7ff]">
                  {service.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumbnails[selectedThumb] || service.image}
                      alt={service.title}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="grid size-full place-items-center bg-gradient-to-br from-[#eef4ff] to-[#e3ecfb] text-brand-navy/40">
                      <Cpu className="size-14" />
                    </div>
                  )}
                </div>

                {thumbnails.length > 0 && (
                  <div className="mt-3 grid grid-cols-3 gap-2.5">
                    {thumbnails.map((src, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSelectedThumb(idx)}
                        className={cn(
                          "aspect-[16/10] overflow-hidden rounded-xl border-2 transition-all",
                          selectedThumb === idx
                            ? "border-brand-orange ring-2 ring-brand-orange/20"
                            : "border-transparent opacity-75 hover:opacity-100",
                        )}
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={src}
                          alt={`${service.title} thumbnail ${idx + 1}`}
                          className="size-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Service Summary */}
              <div className="flex flex-col">
                <h1 className="text-2xl font-extrabold tracking-tight text-brand-navy sm:text-[26px]">
                  {service.title}
                </h1>

                <div className="mt-2 flex items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                    <Star className="size-4 fill-amber-400 text-amber-400" />
                    4.8
                  </span>
                  <span className="text-slate-500">(245 reviews)</span>
                </div>

                <p className="mt-3 text-2xl font-extrabold text-brand-navy">
                  ৳ {Number(service.basePrice).toLocaleString()}+
                </p>

                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {service.description}
                </p>

                <ul className="mt-4 space-y-2 text-sm font-medium text-brand-navy">
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                    Expert Technician
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                    Quick Service
                  </li>
                  <li className="flex items-center gap-2.5">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                    Warranty Available
                  </li>
                </ul>

                <div className="mt-6 flex items-center gap-3">
                  <Button
                    type="button"
                    onClick={focusRequestForm}
                    className="h-11 flex-1 rounded-xl bg-brand-orange px-5 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(249,115,22,0.75)] hover:bg-[#ea6a0c]"
                  >
                    Send Repair Request
                    <ArrowRight className="size-4" />
                  </Button>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isWishlisted;
                      setIsWishlisted(next);
                      try {
                        const existing = JSON.parse(
                          localStorage.getItem("fixmate_wishlist") || "[]",
                        ) as ServiceItem[];
                        const updated = next
                          ? [
                              service,
                              ...existing.filter((i) => i._id !== service._id),
                            ]
                          : existing.filter((i) => i._id !== service._id);
                        localStorage.setItem(
                          "fixmate_wishlist",
                          JSON.stringify(updated),
                        );
                      } catch {}
                    }}
                    aria-label={
                      isWishlisted ? "Remove from saved" : "Save service"
                    }
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-xl border transition-colors",
                      isWishlisted
                        ? "border-red-200 bg-red-50 text-red-500"
                        : "border-header-border bg-white text-slate-500 hover:border-slate-300 hover:text-brand-navy",
                    )}
                  >
                    <Heart
                      className={cn("size-5", isWishlisted && "fill-red-500")}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details Card */}
          <div className="rounded-2xl bg-white p-6 shadow-[0_14px_40px_-24px_rgba(15,37,68,0.18)] ring-1 ring-[#e3ecfb]">
            <h2 className="text-lg font-extrabold text-brand-navy">
              Service Details
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
              {service.description}
            </p>

            <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#f1f5f9] pt-5 text-sm sm:grid-cols-4">
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <Clock className="size-3.5 text-brand-orange" />
                  Duration
                </span>
                <p className="mt-1 font-bold text-brand-navy">
                  {formatDuration(service.estimatedDuration)}
                </p>
              </div>
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <Wrench className="size-3.5 text-brand-orange" />
                  Mode
                </span>
                <p className="mt-1 font-bold text-brand-navy capitalize">
                  {service.serviceMode}
                </p>
              </div>
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <MapPin className="size-3.5 text-brand-orange" />
                  Service Area
                </span>
                <p className="mt-1 truncate font-bold text-brand-navy">
                  {service.serviceArea}
                </p>
              </div>
              <div>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                  <User className="size-3.5 text-brand-orange" />
                  Technician
                </span>
                <p className="mt-1 truncate font-bold text-brand-navy">
                  {service.technicianName}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Request a Service Form */}
        <aside className="rounded-2xl bg-white p-6 shadow-[0_14px_40px_-24px_rgba(15,37,68,0.18)] ring-1 ring-[#e3ecfb] lg:sticky lg:top-24">
          <h2 className="text-lg font-extrabold text-brand-navy">
            Request a Service
          </h2>

          {submitted ? (
            <div className="mt-5 rounded-2xl bg-emerald-50 p-5 text-center ring-1 ring-emerald-200">
              <CheckCircle2 className="mx-auto size-9 text-emerald-600" />
              <h3 className="mt-3 text-base font-bold text-brand-navy">
                Request Sent!
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                Your repair request has been received. A technician will contact
                you shortly.
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => setSubmitted(false)}
                className="mt-4 h-9 rounded-full border-emerald-300 bg-white px-4 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Send Another Request
              </Button>
            </div>
          ) : (
            <form
              onSubmit={handleRequestSubmit}
              noValidate
              className="mt-5 space-y-4"
            >
              {formError && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700"
                >
                  {formError}
                </div>
              )}

              <div>
                <label
                  htmlFor="req-phone"
                  className="block text-xs font-bold text-brand-navy"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  ref={phoneInputRef}
                  id="req-phone"
                  type="tel"
                  required
                  disabled={isSubmitting}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="mt-1.5 h-11 w-full rounded-xl border border-header-border bg-[#f8faff] px-3.5 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="req-address"
                  className="block text-xs font-bold text-brand-navy"
                >
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  id="req-address"
                  type="text"
                  required
                  disabled={isSubmitting}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dhaka, Bangladesh"
                  className="mt-1.5 h-11 w-full rounded-xl border border-header-border bg-[#f8faff] px-3.5 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="req-date"
                  className="block text-xs font-bold text-brand-navy"
                >
                  Preferred Date
                </label>
                <div className="relative mt-1.5">
                  <Calendar
                    aria-hidden="true"
                    className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    id="req-date"
                    type="date"
                    disabled={isSubmitting}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="h-11 w-full rounded-xl border border-header-border bg-[#f8faff] pr-3.5 pl-10 text-sm text-brand-navy focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none disabled:opacity-60"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="req-problem"
                  className="block text-xs font-bold text-brand-navy"
                >
                  Problem Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="req-problem"
                  rows={4}
                  required
                  disabled={isSubmitting}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="Describe the issue..."
                  className="mt-1.5 w-full resize-none rounded-xl border border-header-border bg-[#f8faff] px-3.5 py-2.5 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none disabled:opacity-60"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full rounded-xl bg-brand-orange text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(249,115,22,0.75)] hover:bg-[#ea6a0c]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Request
                    <ArrowRight className="size-4" />
                  </>
                )}
              </Button>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
