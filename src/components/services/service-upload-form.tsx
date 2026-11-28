"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  FileText,
  ImageIcon,
  Loader2,
  Mail,
  MapPin,
  Monitor,
  ShieldCheck,
  Tag,
  Upload,
  User,
  Wrench,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession } from "@/lib/auth-client";

// ─── Types ───────────────────────────────────────────────────────────────────

type ServiceMode = "in-home" | "drop-off" | "remote";

interface ServiceFormData {
  title: string;
  category: string;
  description: string;
  image: File | null;
  basePrice: string;
  estimatedDuration: string;
  serviceMode: ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: "smartphone", label: "Smartphone Repair" },
  { value: "laptop", label: "Laptop & PC Repair" },
  { value: "appliances", label: "Home Appliances" },
  { value: "tv-audio", label: "TV & Audio Setup" },
  { value: "networking", label: "Networking & Wi-Fi" },
  { value: "electrical", label: "Electrical Work" },
  { value: "plumbing", label: "Plumbing" },
  { value: "cleaning", label: "Cleaning Services" },
  { value: "handyman", label: "General Handyman" },
];

const DURATIONS = [
  { value: "30", label: "30 minutes" },
  { value: "60", label: "1 hour" },
  { value: "90", label: "1.5 hours" },
  { value: "120", label: "2 hours" },
  { value: "180", label: "3 hours" },
  { value: "240", label: "4 hours" },
  { value: "480", label: "Full day (8 hrs)" },
];

const SERVICE_MODES: { value: ServiceMode; label: string; description: string; icon: typeof Monitor }[] = [
  { value: "in-home", label: "In-Home", description: "Visit customer location", icon: MapPin },
  { value: "drop-off", label: "Drop-Off", description: "Customer brings device", icon: Wrench },
  { value: "remote", label: "Remote", description: "Online / virtual support", icon: Monitor },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function ServiceUploadForm() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: session, isPending } = useSession();

  const [form, setForm] = useState<ServiceFormData>({
    title: "",
    category: "",
    description: "",
    image: null,
    basePrice: "",
    estimatedDuration: "",
    serviceMode: "in-home",
    serviceArea: "",
    technicianName: "",
    technicianEmail: "",
  });

  useEffect(() => {
    if (session?.user) {
      setForm((prev) => ({
        ...prev,
        technicianName: prev.technicianName || session.user.name || "",
        technicianEmail: prev.technicianEmail || session.user.email || "",
      }));
    }
  }, [session]);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  // ── Helpers ──────────────────────────────────────────────────────────────

  function set<K extends keyof ServiceFormData>(key: K, value: ServiceFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG, WebP, etc.).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }
    setError(null);
    set("image", file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  }

  function removeImage() {
    set("image", null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  // ── Submit ───────────────────────────────────────────────────────────────

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const { title, category, description, basePrice, estimatedDuration, serviceArea, technicianName, technicianEmail } = form;

    if (!title.trim() || !category || !description.trim() || !basePrice || !estimatedDuration || !serviceArea.trim() || !technicianName.trim() || !technicianEmail.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(technicianEmail.trim())) {
      setError("Please enter a valid technician email address.");
      return;
    }

    const price = parseFloat(basePrice);
    if (isNaN(price) || price < 0) {
      setError("Please enter a valid base price.");
      return;
    }

    setIsLoading(true);

    try {
      // Build FormData so image file can be sent to your API
      const payload = new FormData();
      payload.append("title", title.trim());
      payload.append("category", category);
      payload.append("description", description.trim());
      payload.append("basePrice", String(price));
      payload.append("estimatedDuration", estimatedDuration);
      payload.append("serviceMode", form.serviceMode);
      payload.append("serviceArea", serviceArea.trim());
      payload.append("technicianName", technicianName.trim());
      payload.append("technicianEmail", technicianEmail.trim());
      payload.append("approvalStatus", "pending");
      payload.append("isAvailable", "true");
      if (form.image) payload.append("image", form.image);

      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiBaseUrl}/api/services`, {
        method: "POST",
        body: payload,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to submit service. Please try again.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  // ── Access guard ──────────────────────────────────────────────────────────

  if (isPending) {
    return (
      <div className="flex justify-center rounded-2xl bg-white p-12 shadow-sm ring-1 ring-[#e3ecfb]">
        <Loader2 className="size-7 animate-spin text-brand-orange" />
      </div>
    );
  }

  const userRole = (
    (session?.user as { role?: string } | undefined)?.role || ""
  ).toLowerCase();

  if (!session?.user || userRole !== "technician") {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-[0_24px_60px_-30px_rgba(15,37,68,0.22)] ring-1 ring-[#e3ecfb] sm:rounded-3xl sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-amber-50 text-brand-orange">
          <ShieldCheck aria-hidden="true" className="size-8" />
        </div>
        <h2 className="mt-5 text-2xl font-extrabold text-brand-navy">
          Technicians Only
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          {!session?.user
            ? "Please sign in with a Technician account to upload and list services on FixMate."
            : "Only Technician accounts can add services. Your current account cannot upload services."}
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          {!session?.user ? (
            <Button
              asChild
              className="h-11 rounded-full bg-brand-orange px-6 text-[15px] font-semibold text-white hover:bg-[#ea6a0c]"
            >
              <Link href="/sign-in">Sign In as Technician</Link>
            </Button>
          ) : (
            <Button
              asChild
              className="h-11 rounded-full bg-brand-orange px-6 text-[15px] font-semibold text-white hover:bg-[#ea6a0c]"
            >
              <Link href="/services">Browse Services</Link>
            </Button>
          )}
        </div>
      </div>
    );
  }

  // ── Success screen ────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-[0_24px_60px_-30px_rgba(15,37,68,0.22)] ring-1 ring-[#e3ecfb] sm:rounded-3xl sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 aria-hidden="true" className="size-8" />
        </div>
        <h2 className="mt-5 text-2xl font-extrabold text-brand-navy">Service Submitted!</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Your service{" "}
          <span className="font-semibold text-brand-navy">&ldquo;{form.title}&rdquo;</span> has
          been submitted and is{" "}
          <span className="font-semibold text-brand-orange">pending approval</span>.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            onClick={() => {
              setSubmitted(false);
              setForm({
                title: "", category: "", description: "", image: null,
                basePrice: "", estimatedDuration: "", serviceMode: "in-home",
                serviceArea: "", technicianName: "", technicianEmail: "",
              });
              setImagePreview(null);
            }}
            className="h-11 rounded-full bg-brand-orange px-6 text-[15px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(249,115,22,0.75)] hover:bg-[#ea6a0c]"
          >
            Upload Another Service
            <ArrowRight aria-hidden="true" className="size-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────────────

  const inputClass =
    "h-11 w-full rounded-xl border border-header-border bg-[#f8faff] pr-4 pl-10 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none disabled:opacity-60";

  const labelClass = "block text-sm font-semibold text-brand-navy";

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,37,68,0.22)] ring-1 ring-[#e3ecfb] sm:rounded-3xl sm:p-10">
      {/* Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e3ecfb] px-3.5 py-1.5 text-xs font-semibold text-brand-navy">
          <Wrench aria-hidden="true" className="size-4" />
          List a Service
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          Upload a <span className="text-brand-orange">Service</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Fill in the details below to list your repair service on FixMate.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-6">
        {/* Error banner */}
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}

        {/* ── Section: Service Details ── */}
        <fieldset className="space-y-4">
          <legend className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Service Details
          </legend>

          {/* Title */}
          <div>
            <label htmlFor="title" className={labelClass}>
              Service Title <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <FileText
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
              />
              <input
                id="title"
                name="title"
                type="text"
                required
                disabled={isLoading}
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. iPhone Screen Replacement"
                className={inputClass}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className={labelClass}>
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <Tag
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
              />
              <select
                id="category"
                name="category"
                required
                disabled={isLoading}
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
                className={cn(inputClass, "appearance-none")}
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>{c.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className={labelClass}>
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              disabled={isLoading}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Describe what this service includes, tools used, warranty, etc."
              className="mt-1.5 w-full rounded-xl border border-header-border bg-[#f8faff] px-4 py-3 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none disabled:opacity-60 resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className={labelClass}>
              Service Image{" "}
              <span className="font-normal text-slate-400">(Optional, max 5 MB)</span>
            </label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={cn(
                "mt-1.5 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-6 transition-colors",
                dragOver
                  ? "border-brand-orange bg-brand-orange/5"
                  : "border-header-border bg-[#f8faff] hover:border-slate-300",
                isLoading && "opacity-60 pointer-events-none",
              )}
            >
              {imagePreview ? (
                <div className="relative w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Service preview"
                    className="mx-auto max-h-48 rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-1 right-1 grid size-6 place-items-center rounded-full bg-white shadow ring-1 ring-slate-200 hover:bg-red-50 hover:text-red-600"
                    aria-label="Remove image"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="grid size-10 place-items-center rounded-full bg-[#e3ecfb] text-brand-navy">
                    <ImageIcon className="size-5" />
                  </div>
                  <p className="text-sm text-slate-500">
                    Drag & drop an image, or{" "}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="font-semibold text-brand-orange hover:underline"
                    >
                      browse
                    </button>
                  </p>
                  <p className="text-xs text-slate-400">JPG, PNG, WebP — up to 5 MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageFile(file);
                }}
              />
            </div>
          </div>
        </fieldset>

        {/* ── Section: Pricing & Logistics ── */}
        <fieldset className="space-y-4">
          <legend className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Pricing & Logistics
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Base Price */}
            <div>
              <label htmlFor="basePrice" className={labelClass}>
                Base Price (USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <DollarSign
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="basePrice"
                  name="basePrice"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  disabled={isLoading}
                  value={form.basePrice}
                  onChange={(e) => set("basePrice", e.target.value)}
                  placeholder="49.99"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Estimated Duration */}
            <div>
              <label htmlFor="estimatedDuration" className={labelClass}>
                Estimated Duration <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <Clock
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
                />
                <select
                  id="estimatedDuration"
                  name="estimatedDuration"
                  required
                  disabled={isLoading}
                  value={form.estimatedDuration}
                  onChange={(e) => set("estimatedDuration", e.target.value)}
                  className={cn(inputClass, "appearance-none")}
                >
                  <option value="">Select duration</option>
                  {DURATIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Service Mode */}
          <div>
            <span className={labelClass}>
              Service Mode <span className="text-red-500">*</span>
            </span>
            <div
              role="radiogroup"
              aria-label="Service mode"
              className="mt-1.5 grid grid-cols-3 gap-3"
            >
              {SERVICE_MODES.map((mode) => {
                const isSelected = form.serviceMode === mode.value;
                return (
                  <button
                    key={mode.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    disabled={isLoading}
                    onClick={() => set("serviceMode", mode.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-xl border p-3 text-center transition-all",
                      isSelected
                        ? "border-brand-orange bg-brand-orange/5 ring-2 ring-brand-orange/20"
                        : "border-header-border bg-[#f8faff] hover:border-slate-300 hover:bg-white",
                      isLoading && "opacity-60 cursor-not-allowed",
                    )}
                  >
                    <span
                      className={cn(
                        "grid size-9 place-items-center rounded-lg",
                        isSelected ? "bg-brand-orange text-white" : "bg-[#e3ecfb] text-brand-navy",
                      )}
                    >
                      <mode.icon aria-hidden="true" className="size-4" />
                    </span>
                    <span>
                      <span className="block text-xs font-bold text-brand-navy">{mode.label}</span>
                      <span className="block text-[11px] text-slate-500">{mode.description}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Service Area */}
          <div>
            <label htmlFor="serviceArea" className={labelClass}>
              Service Area <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <MapPin
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
              />
              <input
                id="serviceArea"
                name="serviceArea"
                type="text"
                required
                disabled={isLoading}
                value={form.serviceArea}
                onChange={(e) => set("serviceArea", e.target.value)}
                placeholder="e.g. New York, NY or Nationwide"
                className={inputClass}
              />
            </div>
          </div>
        </fieldset>

        {/* ── Section: Technician Info ── */}
        <fieldset className="space-y-4">
          <legend className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Technician Info
          </legend>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Technician Name */}
            <div>
              <label htmlFor="technicianName" className={labelClass}>
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <User
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="technicianName"
                  name="technicianName"
                  type="text"
                  required
                  disabled={isLoading}
                  value={form.technicianName}
                  onChange={(e) => set("technicianName", e.target.value)}
                  placeholder="John Doe"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Technician Email */}
            <div>
              <label htmlFor="technicianEmail" className={labelClass}>
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative mt-1.5">
                <Mail
                  aria-hidden="true"
                  className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="technicianEmail"
                  name="technicianEmail"
                  type="email"
                  required
                  disabled={isLoading}
                  value={form.technicianEmail}
                  onChange={(e) => set("technicianEmail", e.target.value)}
                  placeholder="you@example.com"
                  className={inputClass}
                />
              </div>
            </div>
          </div>
        </fieldset>

        {/* Info note */}
        <p className="rounded-xl border border-[#e3ecfb] bg-[#f4f7ff] px-4 py-3 text-xs leading-5 text-slate-500">
          <span className="font-semibold text-brand-navy">Note:</span> All submitted services are
          reviewed by the FixMate team. You will receive an email once your service is approved and
          live on the platform.
        </p>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isLoading}
          className="h-11 w-full rounded-full bg-brand-orange text-[15px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(249,115,22,0.75)] hover:bg-[#ea6a0c] sm:h-12"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Submitting Service...
            </>
          ) : (
            <>
              <Upload className="size-4" />
              Submit Service for Review
              <ArrowRight aria-hidden="true" className="size-4" />
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
