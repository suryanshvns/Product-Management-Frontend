"use client";

import { BrandLogo } from "@/components/shared/brand-logo";
import { BRAND_NAME, BRAND_TAGLINE } from "@/utils/constants";

/**
 * Auth template – split layout: left = branding + background, right = form.
 */
export function AuthTemplate({ children }) {
  return (
    <div className="flex min-h-screen">
      {/* Left: branding + gradient background + decorative */}
      <div className="relative hidden w-0 flex-1 flex-col justify-between overflow-hidden bg-gradient-sidebar-header p-10 lg:flex lg:w-1/2">
        <div className="flex flex-col gap-8">
          <BrandLogo variant="auth" size="lg" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Welcome to {BRAND_NAME}
            </h1>
            <p className="mt-2 max-w-sm text-lg text-white/90">
              {BRAND_TAGLINE}. Manage products, orders, and analytics in one place.
            </p>
          </div>
        </div>
        {/* Decorative: abstract dashboard-style shapes */}
        <div className="relative mt-8 h-48 w-full max-w-md opacity-30">
          <svg
            viewBox="0 0 400 160"
            fill="none"
            className="h-full w-full"
            aria-hidden
          >
            <rect x="0" y="40" width="120" height="80" rx="12" fill="white" />
            <rect x="140" y="20" width="120" height="100" rx="12" fill="white" />
            <rect x="280" y="60" width="120" height="60" rx="12" fill="white" />
            <line x1="60" y1="100" x2="100" y2="100" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <line x1="200" y1="80" x2="240" y2="80" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <line x1="200" y1="100" x2="230" y2="100" stroke="white" strokeWidth="4" strokeLinecap="round" />
            <circle cx="340" cy="90" r="20" fill="white" />
          </svg>
        </div>
        <p className="text-sm text-white/70">
          © {new Date().getFullYear()} {BRAND_NAME}. All rights reserved.
        </p>
      </div>

      {/* Right: form area */}
      <div className="flex flex-1 flex-col items-center justify-center bg-background px-4 py-10 lg:px-12">
        <div className="w-full max-w-md">
          {/* Show logo on mobile */}
          <div className="mb-8 flex justify-center lg:hidden">
            <BrandLogo variant="light" size="lg" />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
