import Link from "next/link";
import {
  Link2,
  Globe,
  Clock,
  Lock,
  Target,
  BarChart3,
  Smartphone,
  Zap,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Globe,
    title: "Custom Branded Domains",
    description: "Use your own domain to create branded short links that build trust and recognition.",
  },
  {
    icon: Clock,
    title: "Link Scheduling",
    description: "Set start and end dates for your links. Perfect for time-sensitive campaigns.",
  },
  {
    icon: Lock,
    title: "Password Protection",
    description: "Add password protection to sensitive links for an extra layer of security.",
  },
  {
    icon: Target,
    title: "Geographic Targeting",
    description: "Redirect users to different destinations based on their location.",
  },
  {
    icon: Smartphone,
    title: "Device Targeting",
    description: "Send mobile users to your app and desktop users to your website.",
  },
  {
    icon: Zap,
    title: "UTM Builder",
    description: "Automatically add UTM parameters to track campaign performance.",
  },
];

export default function LinkManagementPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Link Management</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
                Shorten, brand, and
                <br />
                <span className="gradient-text">track every link</span>
              </h1>
              <p className="text-lg text-[var(--muted)] mb-8">
                Create short links that are easy to share and remember. Add your brand,
                set targeting rules, and track every click in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Start for free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/pricing">View pricing</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-[var(--border)] p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-3 bg-[var(--border)]/50 rounded-lg">
                    <span className="text-sm text-[var(--muted)]">https://</span>
                    <input
                      type="text"
                      placeholder="paste your long URL here"
                      className="flex-1 bg-transparent outline-none text-sm"
                      disabled
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-3 bg-[var(--primary-pale)] rounded-lg">
                      <span className="text-sm font-medium text-[var(--primary)]">
                        lnk.fg/your-brand
                      </span>
                    </div>
                    <Button size="sm">Shorten</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Powerful link features
            </h2>
            <p className="text-lg text-[var(--muted)]">
              Everything you need to create, manage, and optimize your links.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-lg hover:border-[var(--primary-light)] transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary-pale)] mb-4">
                  <feature.icon className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-6">
                Why use branded links?
              </h2>
              <div className="space-y-4">
                {[
                  "Increase click-through rates by up to 34%",
                  "Build trust with recognizable branded domains",
                  "Track campaign performance with detailed analytics",
                  "Retarget visitors who click your links",
                  "Edit destination URLs without changing the short link",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-[var(--primary)] flex items-center justify-center">
                      <Check className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-[var(--foreground)]">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-12 w-12 rounded-lg bg-[var(--primary)] flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--dark)]">+34%</div>
                  <div className="text-sm text-[var(--muted)]">Higher CTR</div>
                </div>
              </div>
              <div className="h-32 bg-[var(--border)]/30 rounded-lg flex items-end justify-around p-4">
                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                  <div
                    key={i}
                    className="w-6 bg-[var(--primary)] rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start creating branded links today
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of marketers using LinkForge to boost their campaigns.
          </p>
          <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
            <Link href="/signup">
              Get started free
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
