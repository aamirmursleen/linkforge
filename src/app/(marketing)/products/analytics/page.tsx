import Link from "next/link";
import {
  BarChart3,
  Globe,
  Smartphone,
  Clock,
  TrendingUp,
  FileText,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const metrics = [
  { label: "Total Clicks", value: "2.4M", change: "+12%" },
  { label: "Unique Visitors", value: "847K", change: "+8%" },
  { label: "Avg. CTR", value: "4.2%", change: "+0.5%" },
  { label: "QR Scans", value: "156K", change: "+24%" },
];

const features = [
  {
    icon: Clock,
    title: "Real-time Tracking",
    description: "See clicks and scans as they happen with live dashboards and instant notifications.",
  },
  {
    icon: Globe,
    title: "Geographic Insights",
    description: "Know where your audience is with country, city, and region breakdowns.",
  },
  {
    icon: Smartphone,
    title: "Device Analytics",
    description: "Understand what devices and browsers your visitors use.",
  },
  {
    icon: TrendingUp,
    title: "Referrer Tracking",
    description: "See which platforms and sources drive the most traffic.",
  },
  {
    icon: FileText,
    title: "Custom Reports",
    description: "Build and export custom reports for your stakeholders.",
  },
  {
    icon: BarChart3,
    title: "Conversion Tracking",
    description: "Connect to your analytics tools to track conversions.",
  },
];

export default function AnalyticsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <Badge variant="secondary" className="mb-4">Analytics</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
              Data-driven decisions
              <br />
              <span className="gradient-text">made simple</span>
            </h1>
            <p className="text-lg text-[var(--muted)] mb-8">
              Get deep insights into every click and scan. Understand your audience
              and optimize your campaigns with powerful analytics.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/signup">
                  Start tracking
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="secondary" asChild>
                <Link href="/pricing">View pricing</Link>
              </Button>
            </div>
          </div>

          {/* Metrics Preview */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className="bg-white rounded-xl border border-[var(--border)] p-6 text-center"
              >
                <div className="text-3xl font-bold text-[var(--dark)] mb-1">
                  {metric.value}
                </div>
                <div className="text-sm text-[var(--muted)] mb-2">{metric.label}</div>
                <div className="text-sm font-medium text-green-600">{metric.change}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="section">
        <div className="container">
          <div className="bg-white rounded-2xl border border-[var(--border)] shadow-xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-[var(--dark)]">Performance Overview</h3>
              <div className="flex gap-2">
                <Badge variant="outline">Last 30 days</Badge>
              </div>
            </div>

            {/* Chart Placeholder */}
            <div className="h-64 bg-[var(--border)]/30 rounded-lg flex items-end justify-around p-6">
              {[45, 62, 38, 75, 52, 88, 65, 72, 48, 82, 55, 90].map((height, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <div
                    className="w-8 bg-[var(--primary)] rounded-t transition-all hover:bg-[var(--primary-hover)]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-[var(--muted)]">
                    {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Analytics that matter
            </h2>
            <p className="text-lg text-[var(--muted)]">
              All the data you need to optimize your link strategy.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-xl p-6"
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

      {/* CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start tracking your links
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Get insights into every click. Make data-driven decisions.
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
