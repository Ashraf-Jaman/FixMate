import { Suspense } from "react";
import type { Metadata } from "next";
import { RoleDashboard } from "@/components/dashboard/role-dashboards";

export const metadata: Metadata = {
  title: "Dashboard — FixMate",
  description: "Manage your bookings, services, and account on FixMate.",
};

export default function DashboardPage() {
  return (
    <Suspense>
      <RoleDashboard />
    </Suspense>
  );
}
