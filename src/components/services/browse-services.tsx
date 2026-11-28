"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AirVent,
  ArrowRight,
  ChevronDown,
  Cpu,
  Home,
  Laptop,
  LayoutGrid,
  MoreHorizontal,
  Plus,
  Search,
  Smartphone,
  Tv,
  Wrench,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ServiceItem {
  _id: string;
  title: string;
  category: string;
  description: string;
  image?: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: "in-home" | "drop-off" | "remote";
  serviceArea: string;
  technicianName: string;
  technicianEmail: string;
  approvalStatus?: string;
  isAvailable?: boolean;
  createdAt?: string;
}

// ─── Category Mapping ────────────────────────────────────────────────────────

interface SidebarCategory {
  id: string;
  label: string;
  icon: typeof LayoutGrid;
  matches: string[];
}

const SIDEBAR_CATEGORIES: SidebarCategory[] = [
  {
    id: "all",
    label: "All Services",
    icon: LayoutGrid,
    matches: [],
  },
  {
    id: "smartphone",
    label: "Smartphone",
    icon: Smartphone,
    matches: ["smartphone", "phone", "mobile"],
  },
  {
    id: "laptop",
    label: "Laptop & Computer",
    icon: Laptop,
    matches: ["laptop", "computer", "pc", "networking"],
  },
  {
    id: "appliances",
    label: "Home Appliances",
    icon: Home,
    matches: ["appliances", "home-appliances", "refrigerator", "washing-machine"],
  },
  {
    id: "tv-audio",
    label: "TV & Electronics",
    icon: Tv,
    matches: ["tv-audio", "tv", "electronics", "audio"],
  },
  {
    id: "electrical",
    label: "Electrical",
    icon: Zap,
    matches: ["electrical", "electric"],
  },
  {
    id: "ac-cooling",
    label: "AC & Cooling",
    icon: AirVent,
    matches: ["ac-cooling", "ac", "cooling", "hvac"],
  },
  {
    id: "others",
    label: "Others",
    icon: MoreHorizontal,
    matches: ["others", "plumbing", "cleaning", "handyman"],
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function BrowseServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    let isMounted = true;

    async function loadServices() {
      setIsLoading(true);
      setFetchError(null);
      try {
        const apiBaseUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiBaseUrl}/api/services`);
        if (!res.ok) {
          throw new Error("Failed to load services.");
        }
        const data = await res.json();
        if (isMounted) {
          setServices(Array.isArray(data.services) ? data.services : []);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setFetchError(
            err instanceof Error
              ? err.message
              : "Could not connect to the services server.",
          );
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadServices();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredServices = useMemo(() => {
    const q = appliedQuery.trim().toLowerCase();
    const activeCat = SIDEBAR_CATEGORIES.find((c) => c.id === selectedCategory);
    const knownMatches = SIDEBAR_CATEGORIES.flatMap((c) => c.matches);

    return services.filter((service) => {
      // Category filter
      if (selectedCategory !== "all" && activeCat) {
        const catValue = service.category.toLowerCase();
        if (selectedCategory === "others") {
          const isKnownNonOther = knownMatches
            .filter((m) => !activeCat.matches.includes(m))
            .includes(catValue);
          if (isKnownNonOther) return false;
        } else if (!activeCat.matches.includes(catValue)) {
          return false;
        }
      }

      // Search filter
      if (q) {
        const haystack =
          `${service.title} ${service.description} ${service.category} ${service.serviceArea}`.toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }, [services, selectedCategory, appliedQuery]);

  function handleSearchSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAppliedQuery(searchInput);
  }

  return (
    <div className="w-full">
      {/* Hero / Header */}
      <div className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-brand-navy sm:text-4xl">
          Browse Our Services
        </h1>
        <p className="mt-2 text-sm text-slate-600 sm:text-base">
          Find the repair service you need
        </p>
      </div>

      {/* Search Bar Row */}
      <form
        onSubmit={handleSearchSubmit}
        className="mx-auto mt-7 flex max-w-3xl flex-col gap-3 sm:flex-row sm:items-center"
      >
        <div className="flex flex-1 items-center rounded-xl bg-white shadow-[0_12px_30px_-18px_rgba(15,37,68,0.22)] ring-1 ring-[#e3ecfb]">
          <div className="relative flex flex-1 items-center">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-4 size-4 text-slate-400"
            />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setAppliedQuery(e.target.value);
              }}
              placeholder="Search services..."
              aria-label="Search services"
              className="h-12 w-full rounded-l-xl bg-transparent pr-3 pl-10 text-sm text-brand-navy placeholder:text-slate-400 focus:outline-none"
            />
          </div>

          <div className="h-6 w-px bg-[#e3ecfb]" />

          <div className="relative">
            <select
              aria-label="Filter by category"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-12 appearance-none bg-transparent pr-9 pl-4 text-sm font-medium text-brand-navy focus:outline-none"
            >
              {SIDEBAR_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.id === "all" ? "All Categories" : cat.label}
                </option>
              ))}
            </select>
            <ChevronDown
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-slate-400"
            />
          </div>
        </div>

        <Button
          type="submit"
          className="h-12 rounded-xl bg-brand-orange px-7 text-sm font-semibold text-white shadow-[0_12px_28px_-12px_rgba(249,115,22,0.75)] hover:bg-[#ea6a0c]"
        >
          Search
        </Button>
      </form>

      {/* Main Content: Sidebar + Grid */}
      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:items-start">
        {/* Left Sidebar */}
        <aside className="rounded-2xl bg-white p-4 shadow-[0_14px_40px_-24px_rgba(15,37,68,0.18)] ring-1 ring-[#e3ecfb]">
          <div className="mb-3 flex items-center justify-between px-2">
            <h2 className="text-base font-extrabold text-brand-navy">
              Categories
            </h2>
          </div>

          <nav aria-label="Service categories" className="space-y-1">
            {SIDEBAR_CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-[#e8f0fe] font-semibold text-[#2563eb]"
                      : "text-slate-600 hover:bg-[#f8faff] hover:text-brand-navy",
                  )}
                >
                  <cat.icon
                    aria-hidden="true"
                    className={cn(
                      "size-4 shrink-0",
                      isSelected ? "text-[#2563eb]" : "text-slate-400",
                    )}
                  />
                  <span className="truncate">{cat.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-5 border-t border-[#e3ecfb] pt-4">
            <Button
              asChild
              variant="outline"
              className="h-10 w-full rounded-xl border-header-border bg-[#f8faff] text-xs font-semibold text-brand-navy hover:bg-[#eef4ff]"
            >
              <Link href="/services/upload">
                <Plus className="size-3.5" />
                Upload a Service
              </Link>
            </Button>
          </div>
        </aside>

        {/* Right Services Grid */}
        <section aria-live="polite">
          {fetchError && (
            <div
              role="alert"
              className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700"
            >
              {fetchError}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div
                  key={idx}
                  className="animate-pulse rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-[#e3ecfb]"
                >
                  <div className="aspect-[16/10] w-full rounded-xl bg-slate-100" />
                  <div className="mt-3.5 h-4 w-3/4 rounded bg-slate-100" />
                  <div className="mt-2 h-4 w-1/3 rounded bg-slate-100" />
                  <div className="mt-4 h-4 w-1/2 rounded bg-slate-100" />
                </div>
              ))}
            </div>
          ) : filteredServices.length === 0 ? (
            <div className="rounded-2xl bg-white p-10 text-center shadow-[0_14px_40px_-24px_rgba(15,37,68,0.18)] ring-1 ring-[#e3ecfb]">
              <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#e8f0fe] text-[#2563eb]">
                <Wrench className="size-6" />
              </div>
              <h3 className="mt-4 text-lg font-bold text-brand-navy">
                No services found
              </h3>
              <p className="mt-1.5 text-sm text-slate-500">
                {services.length === 0
                  ? "No services have been uploaded yet. Be the first to list one!"
                  : "Try adjusting your search query or selecting a different category."}
              </p>
              <div className="mt-5 flex justify-center gap-3">
                {services.length > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setSelectedCategory("all");
                      setSearchInput("");
                      setAppliedQuery("");
                    }}
                    className="rounded-full border-header-border"
                  >
                    Clear Filters
                  </Button>
                )}
                <Button
                  asChild
                  className="rounded-full bg-brand-orange text-white hover:bg-[#ea6a0c]"
                >
                  <Link href="/services/upload">
                    <Plus className="size-4" />
                    Upload a Service
                  </Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredServices.map((service) => (
                <Link
                  key={service._id}
                  href={`/services/${service._id}`}
                  className="group flex flex-col rounded-2xl bg-white p-3.5 shadow-[0_14px_40px_-24px_rgba(15,37,68,0.18)] ring-1 ring-[#e3ecfb] transition-all hover:-translate-y-0.5 hover:shadow-[0_20px_48px_-24px_rgba(15,37,68,0.28)]"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[#f4f7ff]">
                    {service.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={service.image}
                        alt={service.title}
                        className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="grid size-full place-items-center bg-gradient-to-br from-[#eef4ff] to-[#e3ecfb] text-brand-navy/40">
                        <Cpu className="size-10" />
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col pt-3.5">
                    <h3 className="line-clamp-1 text-[15px] font-bold text-brand-navy">
                      {service.title}
                    </h3>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      ৳ {Number(service.basePrice).toLocaleString()}+
                    </p>

                    <div className="mt-3 flex items-center justify-between border-t border-[#f1f5f9] pt-2.5">
                      <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-orange transition-colors group-hover:text-[#ea6a0c]">
                        Book Now
                        <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                      <span className="text-xs font-medium text-slate-400 capitalize">
                        {service.serviceMode}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
