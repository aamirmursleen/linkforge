import Link from "next/link";
import { Link2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="flex items-center gap-2 font-bold text-xl mb-8">
            <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <Link2 className="h-5 w-5 text-white" />
            </div>
            <span className="text-[var(--dark)]">LinkForge</span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right Side - Background */}
      <div className="hidden lg:block lg:w-1/2 bg-[var(--dark)] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <div className="flex justify-center mb-8">
              <div className="h-20 w-20 rounded-2xl bg-white/10 flex items-center justify-center">
                <Link2 className="h-10 w-10 text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Start managing your links today
            </h2>
            <p className="text-lg text-gray-300">
              Join 500,000+ businesses using LinkForge to create branded links,
              QR codes, and track performance.
            </p>
            <div className="mt-12 grid grid-cols-3 gap-8 text-center">
              {[
                { value: "10B+", label: "Links Created" },
                { value: "500K+", label: "Customers" },
                { value: "99.99%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-1/4 -right-32 w-64 h-64 rounded-full bg-[var(--primary)] opacity-20 blur-3xl" />
        <div className="absolute bottom-1/4 -left-32 w-96 h-96 rounded-full bg-[var(--accent)] opacity-10 blur-3xl" />
      </div>
    </div>
  );
}
