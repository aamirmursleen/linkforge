import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check } from "lucide-react";

export default function SignUpPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--dark)] mb-2">
        Create your account
      </h1>
      <p className="text-[var(--muted)] mb-8">
        Start your free trial. No credit card required.
      </p>

      {/* Social Login */}
      <div className="space-y-3 mb-6">
        <Button variant="outline" className="w-full" type="button">
          <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>
        <Button variant="outline" className="w-full" type="button">
          <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
          </svg>
          Continue with GitHub
        </Button>
      </div>

      {/* Divider */}
      <div className="relative mb-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border)]" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-white px-2 text-[var(--muted)]">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium mb-2">
              First name
            </label>
            <Input id="firstName" placeholder="John" required />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium mb-2">
              Last name
            </label>
            <Input id="lastName" placeholder="Doe" required />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Work email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Create a password"
            required
          />
          <p className="mt-1 text-xs text-[var(--muted)]">
            Must be at least 8 characters
          </p>
        </div>
        <Button type="submit" className="w-full">
          Create account
        </Button>
      </form>

      {/* Benefits */}
      <div className="mt-6 p-4 rounded-lg bg-[var(--primary-pale)]">
        <p className="text-sm font-medium text-[var(--dark)] mb-2">
          Your free trial includes:
        </p>
        <ul className="space-y-1">
          {[
            "500 short links per month",
            "100 QR codes per month",
            "Full analytics access",
            "1 custom domain",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm text-[var(--muted)]">
              <Check className="h-4 w-4 text-green-500" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium text-[var(--primary)] hover:underline"
        >
          Sign in
        </Link>
      </p>

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
  );
}
