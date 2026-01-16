"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex gap-8">
      {/* Clerk SignUp Component */}
      <div className="flex-1">
        <SignUp
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none bg-transparent",
              headerTitle: "text-2xl font-bold text-[var(--dark)]",
              headerSubtitle: "text-[var(--muted)]",
              socialButtonsBlockButton: "border border-[var(--border)] hover:bg-gray-50",
              formFieldInput: "border-[var(--border)] focus:border-[var(--primary)] focus:ring-[var(--primary)]",
              formButtonPrimary: "bg-[var(--primary)] hover:bg-[var(--primary-dark)]",
              footerActionLink: "text-[var(--primary)] hover:text-[var(--primary-dark)]",
            },
          }}
          redirectUrl="/app"
          signInUrl="/signin"
        />
      </div>

      {/* Benefits Sidebar - Hidden on mobile */}
      <div className="hidden lg:block w-64">
        <div className="p-4 rounded-lg bg-[var(--primary-pale)]">
          <p className="text-sm font-medium text-[var(--dark)] mb-2">
            Your free trial includes:
          </p>
          <ul className="space-y-1">
            {[
              "10 short links per month",
              "5 QR codes per month",
              "Full analytics access",
              "1 bio page",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <Check className="h-4 w-4 text-green-500" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 text-center text-xs text-[var(--muted)]">
          By signing up, you agree to our{" "}
          <Link href="/trust" className="underline hover:text-[var(--primary)]">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/trust" className="underline hover:text-[var(--primary)]">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
