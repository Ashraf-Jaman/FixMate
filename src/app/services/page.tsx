import type { Metadata } from "next";
import { BrowseServices } from "@/components/services/browse-services";

export const metadata: Metadata = {
  title: "Browse Services — FixMate",
  description: "Find the repair or home service you need on FixMate.",
};

export default function ServicesPage() {
  return (
    <main className="flex-1 px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <BrowseServices />
      </div>
    </main>
  );
}
