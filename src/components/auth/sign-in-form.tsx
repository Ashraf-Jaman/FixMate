"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter both your email address and password.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: signInError } = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password. Please try again.");
        setIsLoading(false);
        return;
      }

      setSubmitted(true);
      router.refresh();
      // Smooth redirect after short display
      setTimeout(() => {
        router.push(callbackUrl);
      }, 1200);
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
          Welcome Back!
        </h2>
        <p className="mt-2 text-sm leading-6 text-slate-600 sm:text-base">
          You are signed in as{" "}
          <span className="font-semibold text-brand-navy">{email}</span>.
        </p>
        <p className="mt-1 text-xs text-slate-400">Redirecting you shortly...</p>
        <div className="mt-7 flex justify-center">
          <Button
            asChild
            className="h-11 rounded-full bg-brand-orange px-6 text-[15px] font-semibold text-white shadow-[0_12px_28px_-12px_rgba(249,115,22,0.75)] hover:bg-[#ea6a0c]"
          >
            <Link href={callbackUrl}>
              Continue
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
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
          Welcome Back
        </span>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-brand-navy sm:text-3xl">
          Sign In to <span className="text-brand-orange">FixMate</span>
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Access your repair bookings, status updates, and technician messages.
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

        {/* Password */}
        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-brand-navy"
            >
              Password
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-semibold text-brand-orange hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative mt-1.5">
            <Lock
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              disabled={isLoading}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
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

        {/* Remember Me */}
        <div className="flex items-center gap-2.5 pt-1">
          <input
            id="rememberMe"
            name="rememberMe"
            type="checkbox"
            disabled={isLoading}
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="size-4 rounded border-header-border accent-brand-orange"
          />
          <label
            htmlFor="rememberMe"
            className="text-xs text-slate-600 sm:text-sm"
          >
            Keep me signed in
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
              Signing In...
            </>
          ) : (
            <>
              Sign In
              <ArrowRight aria-hidden="true" className="size-4" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link
          href="/sign-up"
          className="font-semibold text-brand-orange hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
