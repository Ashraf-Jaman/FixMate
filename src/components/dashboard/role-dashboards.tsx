"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Calendar,
  Check,
  CheckCircle2,
  ClipboardList,
  Clock,
  DollarSign,
  Headphones,
  Loader2,
  LogOut,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  Users,
  Wrench,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/lib/auth-client";
import type { ServiceItem } from "@/components/services/browse-services";
import { DashboardShell } from "./dashboard-shell";
import { ProfilePanel } from "./profile-panel";
import { StatCard } from "./stat-card";

type RoleType = "customer" | "technician" | "admin";

interface BookingItem {
  _id: string;
  serviceId?: string;
  serviceTitle: string;
  basePrice?: number;
  phone?: string;
  address?: string;
  preferredDate?: string;
  problemDescription?: string;
  status: string;
  createdAt?: string;
}

interface ServiceSummary {
  _id: string;
  title: string;
  category: string;
  basePrice: number;
  serviceMode: string;
  approvalStatus?: string;
  isAvailable?: boolean;
  technicianName?: string;
}

interface UserSummary {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
}

const STATUS_BADGE: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  accepted: "bg-blue-50 text-blue-700 ring-blue-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  rejected: "bg-red-50 text-red-700 ring-red-200",
  approved: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

function formatDate(dateStr?: string): string {
  if (!dateStr) return "Recent";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Customer Dashboard ──────────────────────────────────────────────────────

function CustomerDashboard({
  userName,
  userEmail,
  onLogout,
}: {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}) {
  const [bookingFilter, setBookingFilter] = useState("all");
  const [stats, setStats] = useState({
    totalBookings: 0,
    completed: 0,
    pending: 0,
    totalSpent: 0,
  });
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [wishlist, setWishlist] = useState<ServiceItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("fixmate_wishlist") || "[]");
    } catch {
      return [];
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiBase}/api/dashboard/customer?email=${encodeURIComponent(userEmail)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setBookings(data.recentBookings || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userEmail]);

  async function cancelBooking(id: string) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiBase}/api/dashboard/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: "rejected" } : b)),
      );
    }
  }

  function removeFromWishlist(id: string) {
    const next = wishlist.filter((item) => item._id !== id);
    setWishlist(next);
    try {
      localStorage.setItem("fixmate_wishlist", JSON.stringify(next));
    } catch {}
  }

  const filteredBookings = useMemo(() => {
    if (bookingFilter === "all") return bookings;
    return bookings.filter((b) => b.status === bookingFilter);
  }, [bookings, bookingFilter]);

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-[#e8f0fe] px-3 py-0.5 text-xs font-semibold text-[#1d63ed]">
            Customer Account
          </span>
          <h1 className="mt-1.5 text-2xl font-extrabold text-brand-navy sm:text-3xl">
            Customer Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Hi {userName.split(" ")[0]}, here&apos;s your activity overview
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            className="h-10 rounded-xl bg-brand-orange px-4 text-xs font-semibold text-white hover:bg-[#ea6a0c]"
          >
            <Link href="/services">
              Browse Services
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onLogout}
            className="h-10 rounded-xl border-header-border bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="size-3.5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Total Bookings"
          value={stats.totalBookings}
          icon={Calendar}
          tone="violet"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={CheckCircle2}
          tone="emerald"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={Clock}
          tone="amber"
        />
        <StatCard
          label="Total Spent"
          value={`৳ ${stats.totalSpent.toLocaleString()}`}
          icon={DollarSign}
          tone="blue"
        />
      </div>

      {/* Row 1: My Bookings + Need Help */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e3ecfb]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-brand-navy">
              My Bookings ({filteredBookings.length})
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {["all", "pending", "accepted", "completed", "rejected"].map(
                (f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setBookingFilter(f)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors",
                      bookingFilter === f
                        ? "bg-brand-navy text-white"
                        : "bg-[#f4f7ff] text-slate-600 hover:bg-[#e3ecfb]",
                    )}
                  >
                    {f === "accepted" ? "In Progress" : f}
                  </button>
                ),
              )}
            </div>
          </div>

          {loading ? (
            <div className="mt-5 flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-brand-orange" />
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="mt-5 rounded-xl bg-[#f8faff] p-6 text-center">
              <p className="text-sm text-slate-500">
                No bookings match this filter.
              </p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {filteredBookings.map((b) => (
                <div
                  key={b._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#eef2fb] bg-[#f8faff] p-4"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e3ecfb] text-brand-navy">
                      <Wrench className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-brand-navy">
                        {b.serviceTitle || "Repair Service"}
                      </p>
                      <p className="text-xs text-slate-500">
                        #{b._id.slice(-6).toUpperCase()} • {b.address} •{" "}
                        {formatDate(b.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ring-1",
                        STATUS_BADGE[b.status] || STATUS_BADGE.pending,
                      )}
                    >
                      {b.status === "accepted" ? "In Progress" : b.status}
                    </span>
                    {b.status === "pending" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => cancelBooking(b._id)}
                        className="h-7 rounded-lg border-red-200 bg-red-50 px-2.5 text-xs text-red-600 hover:bg-red-100"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Need Help Card */}
        <div className="flex flex-col justify-between rounded-2xl bg-gradient-to-br from-[#1d63ed] to-[#0f2544] p-6 text-white shadow-sm">
          <div>
            <span className="grid size-11 place-items-center rounded-2xl bg-white/15">
              <Headphones className="size-5 text-white" />
            </span>
            <h3 className="mt-4 text-xl font-extrabold">Need Help?</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-blue-100">
              Our support team is here 24/7 to help you with bookings, payments,
              or technician assistance.
            </p>
          </div>
          <div className="mt-6">
            <Button
              asChild
              className="h-10 rounded-xl bg-white px-5 text-sm font-semibold text-[#1d63ed] hover:bg-blue-50"
            >
              <Link href="/services">Contact Support</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Row 2: Payment History + Wishlist */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment History */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e3ecfb]">
          <h2 className="text-base font-extrabold text-brand-navy">
            Payment History
          </h2>
          {bookings.length === 0 ? (
            <p className="mt-5 rounded-xl bg-[#f8faff] p-6 text-center text-sm text-slate-500">
              No payment records yet.
            </p>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#eef2fb] text-xs text-slate-400">
                    <th className="py-2.5 pr-3">Service</th>
                    <th className="py-2.5 pr-3">Date</th>
                    <th className="py-2.5 pr-3">Amount</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {bookings.map((b) => (
                    <tr key={b._id}>
                      <td className="py-3 pr-3 font-semibold text-brand-navy">
                        {b.serviceTitle}
                      </td>
                      <td className="py-3 pr-3 text-xs text-slate-500">
                        {formatDate(b.createdAt)}
                      </td>
                      <td className="py-3 pr-3 font-bold text-brand-navy">
                        ৳ {(b.basePrice || 1000).toLocaleString()}
                      </td>
                      <td className="py-3">
                        <span
                          className={cn(
                            "rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1",
                            b.status === "completed"
                              ? STATUS_BADGE.completed
                              : STATUS_BADGE.pending,
                          )}
                        >
                          {b.status === "completed" ? "Paid" : "Pending"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Wishlist */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e3ecfb]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-brand-navy">
              Saved Wishlist ({wishlist.length})
            </h2>
            <Link
              href="/services"
              className="text-xs font-semibold text-[#1d63ed] hover:underline"
            >
              Browse More →
            </Link>
          </div>
          {wishlist.length === 0 ? (
            <p className="mt-5 rounded-xl bg-[#f8faff] p-6 text-center text-sm text-slate-500">
              Your wishlist is empty. Click the heart icon on any service to
              save it here.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {wishlist.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-[#eef2fb] bg-[#f8faff] p-3.5"
                >
                  <div>
                    <p className="text-sm font-bold text-brand-navy">
                      {item.title}
                    </p>
                    <p className="text-xs font-semibold text-brand-orange">
                      ৳ {Number(item.basePrice).toLocaleString()}+
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      asChild
                      size="sm"
                      className="h-8 rounded-lg bg-brand-orange px-3 text-xs text-white hover:bg-[#ea6a0c]"
                    >
                      <Link href={`/services/${item._id}`}>View</Link>
                    </Button>
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(item._id)}
                      className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      aria-label="Remove from wishlist"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Row 3: Profile Settings */}
      <ProfilePanel
        initialName={userName}
        email={userEmail}
        roleLabel="Customer"
      />
    </DashboardShell>
  );
}

// ─── Technician Dashboard ────────────────────────────────────────────────────

function TechnicianDashboard({
  userName,
  userEmail,
  onLogout,
}: {
  userName: string;
  userEmail: string;
  onLogout: () => void;
}) {
  const [bookingFilter, setBookingFilter] = useState("all");
  const [stats, setStats] = useState({
    totalServices: 0,
    activeBookings: 0,
    totalEarnings: 0,
  });
  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [requests, setRequests] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(
      `${apiBase}/api/dashboard/technician?email=${encodeURIComponent(userEmail)}`,
    )
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setServices(data.services || []);
          setRequests(data.bookingRequests || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userEmail]);

  async function handleRequestAction(
    id: string,
    status: "accepted" | "rejected" | "completed",
  ) {
    setUpdatingId(id);
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiBase}/api/dashboard/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setRequests((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status } : r)),
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  async function toggleAvailability(id: string, current: boolean) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(
      `${apiBase}/api/dashboard/services/${id}/availability`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !current }),
      },
    );
    if (res.ok) {
      setServices((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, isAvailable: !current } : s,
        ),
      );
    }
  }

  const filteredRequests = useMemo(() => {
    if (bookingFilter === "all") return requests;
    return requests.filter((r) => r.status === bookingFilter);
  }, [requests, bookingFilter]);

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-[#e8f0fe] px-3 py-0.5 text-xs font-semibold text-[#1d63ed]">
            Technician Account
          </span>
          <h1 className="mt-1.5 text-2xl font-extrabold text-brand-navy sm:text-3xl">
            Technician Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your services, bookings, and earnings
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            asChild
            className="h-10 rounded-xl bg-brand-orange px-4 text-xs font-semibold text-white hover:bg-[#ea6a0c]"
          >
            <Link href="/services/upload">
              <Plus className="size-4" />
              Add Service
            </Link>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onLogout}
            className="h-10 rounded-xl border-header-border bg-white px-4 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="size-3.5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Services"
          value={stats.totalServices}
          icon={Wrench}
          tone="blue"
        />
        <StatCard
          label="Active Bookings"
          value={stats.activeBookings}
          icon={ClipboardList}
          tone="emerald"
        />
        <StatCard
          label="Total Earnings"
          value={`৳ ${stats.totalEarnings.toLocaleString()}`}
          icon={DollarSign}
          tone="violet"
        />
      </div>

      {/* Row 1: Booking Requests + Earnings Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Booking Requests */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e3ecfb]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-brand-navy">
              Booking Requests ({filteredRequests.length})
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {["all", "pending", "accepted", "completed", "rejected"].map(
                (f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setBookingFilter(f)}
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold capitalize transition-colors",
                      bookingFilter === f
                        ? "bg-brand-navy text-white"
                        : "bg-[#f4f7ff] text-slate-600 hover:bg-[#e3ecfb]",
                    )}
                  >
                    {f}
                  </button>
                ),
              )}
            </div>
          </div>

          {loading ? (
            <div className="mt-5 flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-brand-orange" />
            </div>
          ) : filteredRequests.length === 0 ? (
            <p className="mt-5 rounded-xl bg-[#f8faff] p-6 text-center text-sm text-slate-500">
              No booking requests match this filter.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {filteredRequests.map((req) => (
                <div
                  key={req._id}
                  className="rounded-xl border border-[#eef2fb] bg-[#f8faff] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-brand-navy">
                        {req.serviceTitle}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {req.address} • {req.phone} • {formatDate(req.createdAt)}
                      </p>
                      {req.problemDescription && (
                        <p className="mt-1 text-xs text-slate-600">
                          &ldquo;{req.problemDescription}&rdquo;
                        </p>
                      )}
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ring-1",
                        STATUS_BADGE[req.status] || STATUS_BADGE.pending,
                      )}
                    >
                      {req.status === "pending" ? "New" : req.status}
                    </span>
                  </div>

                  {req.status === "pending" && (
                    <div className="mt-3 flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        disabled={updatingId === req._id}
                        onClick={() => handleRequestAction(req._id, "accepted")}
                        className="h-8 rounded-lg bg-emerald-600 px-3.5 text-xs font-semibold text-white hover:bg-emerald-700"
                      >
                        <Check className="size-3.5" />
                        Accept
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={updatingId === req._id}
                        onClick={() => handleRequestAction(req._id, "rejected")}
                        className="h-8 rounded-lg border-red-200 bg-red-50 px-3.5 text-xs font-semibold text-red-600 hover:bg-red-100"
                      >
                        <X className="size-3.5" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {req.status === "accepted" && (
                    <div className="mt-3">
                      <Button
                        type="button"
                        size="sm"
                        disabled={updatingId === req._id}
                        onClick={() =>
                          handleRequestAction(req._id, "completed")
                        }
                        className="h-8 rounded-lg bg-[#1d63ed] px-3.5 text-xs font-semibold text-white hover:bg-blue-700"
                      >
                        Mark Completed
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Earnings Overview */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e3ecfb]">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-brand-navy">
              Earnings Overview
            </h2>
            <span className="rounded-lg border border-header-border bg-[#f8faff] px-2.5 py-1 text-xs font-semibold text-slate-600">
              This Month
            </span>
          </div>

          <div className="mt-5">
            <svg
              viewBox="0 0 320 120"
              className="w-full overflow-visible"
              aria-label="Earnings trend chart"
            >
              <defs>
                <linearGradient id="earnGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1d63ed" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#1d63ed" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                d="M 10 95 Q 60 70, 100 80 T 180 50 T 250 38 T 310 15 L 310 110 L 10 110 Z"
                fill="url(#earnGrad)"
              />
              <path
                d="M 10 95 Q 60 70, 100 80 T 180 50 T 250 38 T 310 15"
                fill="none"
                stroke="#1d63ed"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <div className="mt-2 flex justify-between text-[11px] font-medium text-slate-400">
              <span>1st</span>
              <span>7th</span>
              <span>14th</span>
              <span>21st</span>
              <span>28th</span>
            </div>
          </div>

          <div className="mt-5 space-y-2 border-t border-[#eef2fb] pt-4 text-xs">
            {requests
              .filter(
                (r) => r.status === "completed" || r.status === "accepted",
              )
              .slice(0, 4)
              .map((r) => (
                <div key={r._id} className="flex items-center justify-between">
                  <span className="truncate font-semibold text-brand-navy">
                    {r.serviceTitle}
                  </span>
                  <span className="font-bold text-emerald-600">
                    +৳ {(r.status === "completed" ? 1500 : 800).toLocaleString()}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Row 2: My Services */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e3ecfb]">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-brand-navy">
            My Services ({services.length})
          </h2>
          <Button
            asChild
            size="sm"
            className="rounded-lg bg-brand-orange text-white hover:bg-[#ea6a0c]"
          >
            <Link href="/services/upload">Upload New</Link>
          </Button>
        </div>
        {services.length === 0 ? (
          <p className="mt-5 rounded-xl bg-[#f8faff] p-6 text-center text-sm text-slate-500">
            You haven&apos;t uploaded any services yet.
          </p>
        ) : (
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div
                key={s._id}
                className="flex flex-col justify-between gap-3 rounded-xl border border-[#eef2fb] bg-[#f8faff] p-4"
              >
                <div>
                  <Link
                    href={`/services/${s._id}`}
                    className="font-bold text-brand-navy hover:text-brand-orange"
                  >
                    {s.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-slate-500 capitalize">
                    {s.category} • ৳ {Number(s.basePrice).toLocaleString()}+
                  </p>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ring-1",
                      STATUS_BADGE[s.approvalStatus || "pending"],
                    )}
                  >
                    {s.approvalStatus || "pending"}
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      toggleAvailability(s._id, s.isAvailable !== false)
                    }
                    className="h-7 rounded-lg text-xs"
                  >
                    {s.isAvailable !== false ? "Active" : "Paused"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Row 3: Profile Settings */}
      <ProfilePanel
        initialName={userName}
        email={userEmail}
        roleLabel="Technician"
      />
    </DashboardShell>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────

function AdminDashboard({
  userName,
  onLogout,
}: {
  userName: string;
  onLogout: () => void;
}) {
  const [userSearch, setUserSearch] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState<UserSummary[]>([]);
  const [services, setServices] = useState<ServiceSummary[]>([]);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    fetch(`${apiBase}/api/dashboard/admin`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setUsers(data.users || []);
          setServices(data.services || []);
          setBookings(data.recentBookings || []);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  async function handleApproval(
    id: string,
    approvalStatus: "approved" | "rejected",
  ) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(
      `${apiBase}/api/dashboard/services/${id}/approval`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus }),
      },
    );
    if (res.ok) {
      setServices((prev) =>
        prev.map((s) => (s._id === id ? { ...s, approvalStatus } : s)),
      );
    }
  }

  async function handleRoleChange(id: string, role: string) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiBase}/api/dashboard/users/${id}/role`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role } : u)),
      );
    }
  }

  async function handleBookingStatus(id: string, status: string) {
    const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    const res = await fetch(`${apiBase}/api/dashboard/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status } : b)),
      );
    }
  }

  const filteredUsers = useMemo(() => {
    const q = userSearch.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.role?.toLowerCase().includes(q),
    );
  }, [users, userSearch]);

  const filteredServices = useMemo(() => {
    if (serviceFilter === "all") return services;
    return services.filter(
      (s) => (s.approvalStatus || "pending") === serviceFilter,
    );
  }, [services, serviceFilter]);

  return (
    <DashboardShell>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="inline-block rounded-full bg-[#e8f0fe] px-3 py-0.5 text-xs font-semibold text-[#1d63ed]">
            Administrator
          </span>
          <h1 className="mt-1.5 text-2xl font-extrabold text-brand-navy sm:text-3xl">
            Admin Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Welcome back, {userName.split(" ")[0]}!
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-xl bg-white px-3.5 py-2 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-[#e3ecfb]">
            <Calendar className="size-3.5 text-brand-orange" />
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <Button
            type="button"
            variant="outline"
            onClick={onLogout}
            className="h-9 rounded-xl border-header-border bg-white px-3.5 text-xs font-semibold text-slate-600 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="size-3.5" />
            Logout
          </Button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          tone="blue"
        />
        <StatCard
          label="Total Services"
          value={stats.totalServices.toLocaleString()}
          icon={Wrench}
          tone="emerald"
        />
        <StatCard
          label="Total Bookings"
          value={stats.totalBookings.toLocaleString()}
          icon={Calendar}
          tone="amber"
        />
        <StatCard
          label="Total Revenue"
          value={`৳ ${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          tone="violet"
        />
      </div>

      {/* Row 1: All Bookings + Revenue & Reports */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e3ecfb]">
          <h2 className="text-base font-extrabold text-brand-navy">
            All Bookings ({bookings.length})
          </h2>

          {loading ? (
            <div className="mt-5 flex justify-center py-8">
              <Loader2 className="size-6 animate-spin text-brand-orange" />
            </div>
          ) : bookings.length === 0 ? (
            <p className="mt-5 rounded-xl bg-[#f8faff] p-6 text-center text-sm text-slate-500">
              No bookings recorded yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#eef2fb] bg-[#f8faff] p-3.5"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e3ecfb] text-brand-navy">
                      <Wrench className="size-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-brand-navy">
                        {b.serviceTitle}
                      </p>
                      <p className="text-xs text-slate-400">
                        #{b._id.slice(-6).toUpperCase()} • {b.address} •{" "}
                        {formatDate(b.createdAt)}
                      </p>
                    </div>
                  </div>
                  <select
                    value={b.status}
                    onChange={(e) => handleBookingStatus(b._id, e.target.value)}
                    className="rounded-lg border border-header-border bg-white px-2.5 py-1 text-xs font-semibold text-brand-navy capitalize"
                  >
                    <option value="pending">pending</option>
                    <option value="accepted">accepted</option>
                    <option value="completed">completed</option>
                    <option value="rejected">rejected</option>
                  </select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Revenue Overview + Reports */}
        <div className="space-y-6">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e3ecfb]">
            <h2 className="text-base font-extrabold text-brand-navy">
              Revenue Overview
            </h2>
            <div className="mt-5 flex items-center justify-center gap-6">
              <div className="relative grid size-28 place-items-center">
                <svg viewBox="0 0 36 36" className="size-full -rotate-90">
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#e3ecfb"
                    strokeWidth="4.5"
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="14"
                    fill="none"
                    stroke="#1d63ed"
                    strokeWidth="4.5"
                    strokeDasharray="65 35"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-base font-extrabold text-brand-navy">
                  65%
                </span>
              </div>

              <div className="space-y-2.5 text-sm">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#1d63ed]" />
                  <span className="text-slate-600">Online</span>
                  <span className="font-bold text-brand-navy">65%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full bg-[#e3ecfb]" />
                  <span className="text-slate-600">Cash</span>
                  <span className="font-bold text-brand-navy">35%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e3ecfb]">
            <h2 className="text-base font-extrabold text-brand-navy">
              Service Approval Report
            </h2>
            <div className="mt-4 space-y-3 text-sm">
              {["approved", "pending", "rejected"].map((st) => {
                const count = services.filter(
                  (s) => (s.approvalStatus || "pending") === st,
                ).length;
                const pct = services.length
                  ? Math.round((count / services.length) * 100)
                  : 0;
                return (
                  <div key={st}>
                    <div className="flex justify-between text-xs font-semibold capitalize">
                      <span>{st}</span>
                      <span>
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-[#eef2fb]">
                      <div
                        className="h-2 rounded-full bg-[#1d63ed]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Manage Services + Manage Users */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Manage Services */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e3ecfb]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-brand-navy">
              Manage Services ({filteredServices.length})
            </h2>
            <div className="flex gap-1.5">
              {["all", "pending", "approved", "rejected"].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setServiceFilter(f)}
                  className={cn(
                    "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                    serviceFilter === f
                      ? "bg-brand-navy text-white"
                      : "bg-[#f4f7ff] text-slate-600 hover:bg-[#e3ecfb]",
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {filteredServices.map((s) => (
              <div
                key={s._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#eef2fb] bg-[#f8faff] p-3.5"
              >
                <div>
                  <p className="text-sm font-bold text-brand-navy">{s.title}</p>
                  <p className="text-xs text-slate-500 capitalize">
                    {s.category} • ৳ {Number(s.basePrice).toLocaleString()}+ •{" "}
                    {s.technicianName}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ring-1",
                      STATUS_BADGE[s.approvalStatus || "pending"],
                    )}
                  >
                    {s.approvalStatus || "pending"}
                  </span>
                  {s.approvalStatus !== "approved" && (
                    <Button
                      size="sm"
                      onClick={() => handleApproval(s._id, "approved")}
                      className="h-7 rounded-lg bg-emerald-600 px-2.5 text-xs text-white hover:bg-emerald-700"
                    >
                      Approve
                    </Button>
                  )}
                  {s.approvalStatus !== "rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleApproval(s._id, "rejected")}
                      className="h-7 rounded-lg border-red-200 bg-red-50 px-2.5 text-xs text-red-600 hover:bg-red-100"
                    >
                      Reject
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Manage Users */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e3ecfb]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-extrabold text-brand-navy">
              Manage Users ({filteredUsers.length})
            </h2>
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                placeholder="Search users..."
                className="h-9 rounded-xl border border-header-border bg-[#f8faff] pr-3 pl-9 text-xs text-brand-navy focus:border-brand-orange focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#eef2fb] text-xs text-slate-400">
                  <th className="py-2.5 pr-3">Name</th>
                  <th className="py-2.5 pr-3">Email</th>
                  <th className="py-2.5">Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {filteredUsers.map((u) => (
                  <tr key={u._id}>
                    <td className="py-3 pr-3 font-semibold text-brand-navy">
                      {u.name}
                    </td>
                    <td className="py-3 pr-3 text-xs text-slate-600">
                      {u.email}
                    </td>
                    <td className="py-3">
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u._id, e.target.value)
                        }
                        className="rounded-lg border border-header-border bg-[#f8faff] px-2 py-1 text-xs font-semibold text-brand-navy capitalize"
                      >
                        <option value="customer">customer</option>
                        <option value="technician">technician</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 3: Transactions */}
      <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-[#e3ecfb]">
        <h2 className="text-base font-extrabold text-brand-navy">
          Platform Transactions
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-[#eef2fb] text-xs text-slate-400">
                <th className="py-2.5 pr-4">Txn ID</th>
                <th className="py-2.5 pr-4">Service</th>
                <th className="py-2.5 pr-4">Date</th>
                <th className="py-2.5 pr-4">Amount</th>
                <th className="py-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {bookings.map((b) => (
                <tr key={b._id}>
                  <td className="py-3 pr-4 font-mono text-xs text-slate-500">
                    TXN-{b._id.slice(-5).toUpperCase()}
                  </td>
                  <td className="py-3 pr-4 font-semibold text-brand-navy">
                    {b.serviceTitle}
                  </td>
                  <td className="py-3 pr-4 text-slate-500">
                    {formatDate(b.createdAt)}
                  </td>
                  <td className="py-3 pr-4 font-bold text-brand-navy">
                    ৳ {(b.basePrice || 1000).toLocaleString()}
                  </td>
                  <td className="py-3">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-semibold ring-1",
                        STATUS_BADGE[b.status] || STATUS_BADGE.pending,
                      )}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}

// ─── Role Router ─────────────────────────────────────────────────────────────

export function RoleDashboard() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  async function handleLogout() {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  }

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-8 animate-spin text-brand-orange" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="mx-auto my-16 max-w-md rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ring-[#e3ecfb]">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-[#e8f0fe] text-[#1d63ed]">
          <ShieldCheck className="size-6" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-brand-navy">
          Sign in to view your dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Your dashboard is tailored to your account role (Customer, Technician,
          or Admin).
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button
            asChild
            className="rounded-full bg-brand-orange px-6 text-white hover:bg-[#ea6a0c]"
          >
            <Link href="/sign-in">Sign In</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-header-border"
          >
            <Link href="/sign-up">Create Account</Link>
          </Button>
        </div>
      </div>
    );
  }

  const user = session.user as {
    name?: string;
    email?: string;
    role?: string;
  };
  const role = (user.role?.toLowerCase() || "customer") as RoleType;
  const userName = user.name || user.email || "User";
  const userEmail = user.email || "";

  if (role === "admin") {
    return <AdminDashboard userName={userName} onLogout={handleLogout} />;
  }

  if (role === "technician") {
    return (
      <TechnicianDashboard
        userName={userName}
        userEmail={userEmail}
        onLogout={handleLogout}
      />
    );
  }

  return (
    <CustomerDashboard
      userName={userName}
      userEmail={userEmail}
      onLogout={handleLogout}
    />
  );
}
