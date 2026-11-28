import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "blue" | "emerald" | "amber" | "violet";
}

const TONE_CLASSES: Record<
  NonNullable<StatCardProps["tone"]>,
  { card: string; icon: string }
> = {
  blue: {
    card: "bg-[#f4f7ff] ring-[#e3ecfb]",
    icon: "bg-[#e3ecfb] text-[#1d63ed]",
  },
  emerald: {
    card: "bg-[#f2fbf7] ring-[#d7f3e5]",
    icon: "bg-[#dcf5e9] text-emerald-600",
  },
  amber: {
    card: "bg-[#fff8f1] ring-[#fde8d2]",
    icon: "bg-[#feecd9] text-brand-orange",
  },
  violet: {
    card: "bg-[#f7f4ff] ring-[#e8e0fc]",
    icon: "bg-[#ebe3fb] text-violet-600",
  },
};

export function StatCard({
  label,
  value,
  icon: Icon,
  tone = "blue",
}: StatCardProps) {
  const styles = TONE_CLASSES[tone];

  return (
    <div
      className={cn(
        "rounded-2xl p-5 shadow-[0_10px_30px_-20px_rgba(15,37,68,0.16)] ring-1",
        styles.card,
      )}
    >
      <p className="text-xs font-semibold text-slate-500">{label}</p>
      <div className="mt-2.5 flex items-center justify-between gap-3">
        <p className="text-2xl font-extrabold tracking-tight text-brand-navy">
          {value}
        </p>
        <span
          className={cn(
            "grid size-9 shrink-0 place-items-center rounded-xl",
            styles.icon,
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
    </div>
  );
}
