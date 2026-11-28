"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";

type UserRole = "customer" | "technician";

const roles: {
  value: UserRole;
  label: string;
  description: string;
  icon: typeof User;
}[] = [
  {
    value: "customer",
    label: "Customer",
    description: "Book repair services",
    icon: User,
  },
  {
    value: "technician",
    label: "Technician",
    description: "Provide repair services",
    icon: Wrench,
  },
];

export function SignUpForm() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("customer");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (role === "technician" && !specialty) {
      setError("Please select your primary service specialty.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreed) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: signUpError } = await authClient.signUp.email({
        email: email.trim(),
        password,
        name: fullName.trim(),
        role,
        phone: phone.trim() || undefined,
        specialty: role === "technician" ? specialty : undefined,
      });

      if (signUpError) {
        setError(signUpError.message || "Failed to create account. Please try again.");
        setIsLoading(false);
        return;
      }

      setSubmitted(true);
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      setIsLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center shadow-[0_24px_60px_-30px_rgba(15,37,68,0.22)] ring-1 ring-[#e3ecfb] sm:rounded-3xl sm:p-10">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 aria-hidden="true" className="size-8" />
        </div>
        <h2 className="mt-5 text-2xl font-extrabold text-brand-navy">
          Account Created!
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          Welcome to FixMate,{" "}
          <span className="font-semibold text-brand-navy">{fullName}</span>.
          Your{" "}
          <span className="font-semibold text-brand-orange capitalize">
            {role}
          </span>{" "}
          account is ready and you are signed in.
        </p>
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            className="h-11 rounded-full bg-brand-orange px-6 text-[15px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(249,115,22,0.75)] hover:bg-[#ea6a0c]"
          >
            <Link href="/">
              Back to Home
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-full border-header-border bg-white px-6 text-[15px] font-semibold text-brand-navy hover:bg-slate-50"
          >
            <Link href="/sign-in">Sign In Page</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-[0_24px_60px_-30px_rgba(15,37,68,0.22)] ring-1 ring-[#e3ecfb] sm:rounded-3xl sm:p-10">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-[#e3ecfb] px-3.5 py-1.5 text-xs font-semibold text-brand-navy">
          <ShieldCheck aria-hidden="true" className="size-4" />
          Join FixMate
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          Create Your <span className="text-brand-orange">Account</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Book trusted technicians and track your device repairs in real time.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-4">
        {error && (
          <div
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}

        {/* Role Selector */}
        <div>
          <span className="block text-sm font-semibold text-brand-navy">
            Sign up as
          </span>
          <div
            role="radiogroup"
            aria-label="Account role"
            className="mt-1.5 grid grid-cols-2 gap-3"
          >
            {roles.map((item) => {
              const isSelected = role === item.value;
              return (
                <button
                  key={item.value}
                  type="button"
                  role="radio"
                  disabled={isLoading}
                  aria-checked={isSelected}
                  onClick={() => setRole(item.value)}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-left transition-all",
                    isSelected
                      ? "border-brand-orange bg-brand-orange/5 ring-2 ring-brand-orange/20"
                      : "border-header-border bg-[#f8faff] hover:border-slate-300 hover:bg-white",
                    isLoading && "opacity-60 cursor-not-allowed",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-9 shrink-0 place-items-center rounded-lg",
                      isSelected
                        ? "bg-brand-orange text-white"
                        : "bg-[#e3ecfb] text-brand-navy",
                    )}
                  >
                    <item.icon aria-hidden="true" className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-bold text-brand-navy">
                      {item.label}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {item.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label
            htmlFor="fullName"
            className="block text-sm font-semibold text-brand-navy"
          >
            Full Name
          </label>
          <div className="relative mt-1.5">
            <User
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              disabled={isLoading}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="h-11 w-full rounded-xl border border-header-border bg-[#f8faff] pr-4 pl-10 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-brand-navy"
          >
            Email Address
          </label>
          <div className="relative mt-1.5">
            <Mail
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={isLoading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 w-full rounded-xl border border-header-border bg-[#f8faff] pr-4 pl-10 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* Phone Number */}
        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-semibold text-brand-navy"
          >
            Phone Number{" "}
            <span className="font-normal text-slate-400">(Optional)</span>
          </label>
          <div className="relative mt-1.5">
            <Phone
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="phone"
              name="phone"
              type="tel"
              autoComplete="tel"
              disabled={isLoading}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="h-11 w-full rounded-xl border border-header-border bg-[#f8faff] pr-4 pl-10 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none disabled:opacity-60"
            />
          </div>
        </div>

        {/* Technician Specialty */}
        {role === "technician" && (
          <div>
            <label
              htmlFor="specialty"
              className="block text-sm font-semibold text-brand-navy"
            >
              Service Specialty
            </label>
            <select
              id="specialty"
              name="specialty"
              required
              disabled={isLoading}
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              className="mt-1.5 h-11 w-full rounded-xl border border-header-border bg-[#f8faff] px-3.5 text-sm text-brand-navy focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none disabled:opacity-60"
            >
              <option value="">Select your specialty</option>
              <option value="smartphone">Smartphone Repair</option>
              <option value="laptop">Laptop & PC Repair</option>
              <option value="appliances">Home Appliances</option>
              <option value="tv-audio">TV & Audio Setup</option>
            </select>
          </div>
        )}

        {/* Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-semibold text-brand-navy"
          >
            Password
          </label>
          <div className="relative mt-1.5">
            <Lock
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              disabled={isLoading}
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="h-11 w-full rounded-xl border border-header-border bg-[#f8faff] pr-11 pl-10 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none disabled:opacity-60"
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-brand-navy"
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-semibold text-brand-navy"
          >
            Confirm Password
          </label>
          <div className="relative mt-1.5">
            <Lock
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              disabled={isLoading}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="h-11 w-full rounded-xl border border-header-border bg-[#f8faff] pr-11 pl-10 text-sm text-brand-navy placeholder:text-slate-400 focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none disabled:opacity-60"
            />
            <button
              type="button"
              disabled={isLoading}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              aria-label={
                showConfirmPassword ? "Hide password" : "Show password"
              }
              className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-brand-navy"
            >
              {showConfirmPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </div>

        {/* Terms Checkbox */}
        <div className="flex items-start gap-2.5 pt-1">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            disabled={isLoading}
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 size-4 rounded border-header-border accent-brand-orange"
          />
          <label htmlFor="terms" className="text-xs leading-5 text-slate-600 sm:text-sm">
            I agree to the{" "}
            <Link
              href="/terms"
              className="font-semibold text-brand-navy underline-offset-2 hover:text-brand-orange hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-semibold text-brand-navy underline-offset-2 hover:text-brand-orange hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="mt-2 h-11 w-full rounded-full bg-brand-orange text-[15px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(249,115,22,0.75)] hover:bg-[#ea6a0c] sm:h-12"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Creating Account...
            </>
          ) : (
            <>
              Create Account
              <ArrowRight aria-hidden="true" className="size-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/sign-in"
          className="font-semibold text-brand-orange hover:underline"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
