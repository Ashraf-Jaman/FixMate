import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

import { BrandLogo } from "@/components/shared/brand-logo";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/#about" },
  { label: "How It Works", href: "/#how-it-works" },
];

const popularCategories = [
  { label: "Smartphone Repair", href: "/services?category=smartphone" },
  { label: "Laptop & PC Repair", href: "/services?category=laptop" },
  { label: "Home Appliances", href: "/services?category=appliances" },
  { label: "TV & Audio Setup", href: "/services?category=tv-audio" },
];

const contactInfo = [
  {
    icon: Mail,
    label: "support@fixmate.com",
    href: "mailto:support@fixmate.com",
  },
  {
    icon: Phone,
    label: "+1 (800) 555-0199",
    href: "tel:+18005550199",
  },
  {
    icon: MapPin,
    label: "123 Repair Street, Tech District, NY 10001",
    href: undefined,
  },
];

function XLogoIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

const socialLinks = [
  { label: "X", href: "https://x.com", icon: XLogoIcon },
  { label: "Facebook", href: "https://facebook.com", icon: FacebookIcon },
  { label: "Instagram", href: "https://instagram.com", icon: InstagramIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInIcon },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-header-border bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.35fr_0.8fr_0.9fr_1.1fr]">
          {/* Brand & Tagline */}
          <div>
            <BrandLogo />
            <p className="mt-4 max-w-xs text-sm leading-6 text-slate-600">
              On-demand repair service for your smart devices and home
              appliances. Fast, reliable, and secure doorstep care.
            </p>

            {/* Social Links */}
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={social.label}
                  className="grid size-9 place-items-center rounded-full bg-[#f4f8ff] text-brand-navy ring-1 ring-[#e3ecfb] transition-colors hover:bg-brand-orange hover:text-white hover:ring-brand-orange"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-brand-navy uppercase">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-orange"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-brand-navy uppercase">
              Popular Categories
            </h3>
            <ul className="mt-4 space-y-3">
              {popularCategories.map((category) => (
                <li key={category.label}>
                  <Link
                    href={category.href}
                    className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-orange"
                  >
                    {category.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-sm font-bold tracking-wide text-brand-navy uppercase">
              Contact Info
            </h3>
            <ul className="mt-4 space-y-3.5">
              {contactInfo.map((item) => (
                <li key={item.label} className="flex items-start gap-3">
                  <item.icon
                    aria-hidden="true"
                    className="mt-0.5 size-4 shrink-0 text-brand-orange"
                  />
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-sm font-medium text-slate-600 transition-colors hover:text-brand-orange"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span className="text-sm font-medium text-slate-600">
                      {item.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-header-border pt-6 text-center sm:flex-row sm:text-left">
          <p className="text-sm text-slate-500">
            © 2026 FixMate. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <Link
              href="/privacy"
              className="transition-colors hover:text-brand-orange"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="transition-colors hover:text-brand-orange"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
