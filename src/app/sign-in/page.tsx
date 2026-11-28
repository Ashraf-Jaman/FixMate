import type { Metadata } from "next";
import { Suspense } from "react";

import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = {
  title: "Sign In — FixMate",
  description:
    "Sign in to your FixMate account to manage your device repairs and bookings.",
};

export default function SignInPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-page px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-2xl bg-white" />}>
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
