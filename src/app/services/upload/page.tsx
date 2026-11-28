import type { Metadata } from "next";
import { ServiceUploadForm } from "@/components/services/service-upload-form";

export const metadata: Metadata = {
  title: "Upload a Service — FixMate",
  description: "List your repair or home service on FixMate and reach customers near you.",
};

export default function UploadServicePage() {
  return (
    <main className="flex flex-1 flex-col items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <ServiceUploadForm />
      </div>
    </main>
  );
}
