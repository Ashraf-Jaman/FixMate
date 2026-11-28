"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

interface ProfilePanelProps {
  initialName: string;
  email: string;
  roleLabel: string;
}

export function ProfilePanel({
  initialName,
  email,
  roleLabel,
}: ProfilePanelProps) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);

    if (!name.trim()) {
      setError("Name cannot be empty.");
      return;
    }

    setSaving(true);
    try {
      const { error: updateErr } = await authClient.updateUser({
        name: name.trim(),
      });
      if (updateErr) {
        setError(updateErr.message || "Failed to update profile.");
      } else {
        setSaved(true);
      }
    } catch {
      setError("Could not update profile.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mt-6 max-w-xl rounded-2xl bg-white p-6 shadow-sm ring-1 ring-[#e3ecfb]">
      <h2 className="text-lg font-extrabold text-brand-navy">
        Profile Settings
      </h2>
      <p className="mt-1 text-xs text-slate-500">
        Update your personal account information.
      </p>

      <form onSubmit={handleSave} className="mt-5 space-y-4">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-700">
            {error}
          </div>
        )}
        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs font-medium text-emerald-700">
            <CheckCircle2 className="size-4" />
            Profile updated successfully!
          </div>
        )}

        <div>
          <label
            htmlFor="profile-name"
            className="block text-xs font-bold text-brand-navy"
          >
            Full Name
          </label>
          <input
            id="profile-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 h-11 w-full rounded-xl border border-header-border bg-[#f8faff] px-3.5 text-sm text-brand-navy focus:border-brand-orange focus:bg-white focus:ring-2 focus:ring-brand-orange/20 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-navy">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={email}
            className="mt-1.5 h-11 w-full rounded-xl border border-header-border bg-slate-100 px-3.5 text-sm text-slate-500"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-brand-navy">
            Account Role
          </label>
          <input
            type="text"
            disabled
            value={roleLabel}
            className="mt-1.5 h-11 w-full rounded-xl border border-header-border bg-slate-100 px-3.5 text-sm text-slate-500 capitalize"
          />
        </div>

        <Button
          type="submit"
          disabled={saving}
          className="h-10 rounded-xl bg-brand-orange px-5 text-sm font-semibold text-white hover:bg-[#ea6a0c]"
        >
          {saving ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4" />
              Save Changes
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
