"use client";

import { SignIn } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect_url") || "/app";

  return (
    <div>
      <SignIn
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
        forceRedirectUrl={redirectUrl}
        signUpUrl="/signup"
      />
    </div>
  );
}
