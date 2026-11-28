import type { Metadata } from "next";
import { Suspense } from "react";

import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up — FixMate",
  description:
    "Create your FixMate account to book trusted repair technicians and track your device repairs.",
};

export default function SignUpPage() {
  return (
    <main className="flex flex-1 items-center justify-center bg-page px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="w-full max-w-md">
        <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-2xl bg-white" />}>
          <SignUpForm />
        </Suspense>
      </div>
    </main>
  );
}
