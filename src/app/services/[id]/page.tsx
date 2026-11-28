import type { Metadata } from "next";
import { Suspense } from "react";
import { ServiceDetail } from "@/components/services/service-detail";

export const metadata: Metadata = {
  title: "Service Details — FixMate",
  description: "View service details and submit a repair request on FixMate.",
};

function ServiceDetailFallback() {
  return (
    <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1fr_340px]">
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
      <div className="h-96 animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e3ecfb]" />
    </div>
  );
}

async function ServiceDetailLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ServiceDetail serviceId={id} />;
}

export default function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Suspense fallback={<ServiceDetailFallback />}>
          <ServiceDetailLoader params={params} />
        </Suspense>
      </div>
    </main>
  );
}
