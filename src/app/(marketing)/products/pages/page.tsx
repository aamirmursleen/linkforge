import Link from "next/link";
import {
  FileText,
  Palette,
  Smartphone,
  BarChart3,
  Globe,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Palette,
    title: "Drag-and-Drop Builder",
    description: "Create beautiful pages without any coding. Just drag, drop, and publish.",
  },
  {
    icon: Smartphone,
    title: "Mobile-First Design",
    description: "Every page looks great on mobile, tablet, and desktop devices.",
  },
  {
    icon: Globe,
    title: "Custom Domains",
    description: "Use your own domain for a professional, branded experience.",
  },
  {
    icon: BarChart3,
    title: "Built-in Analytics",
    description: "Track visits, clicks, and conversions right in your dashboard.",
  },
  {
    icon: Zap,
    title: "Fast Loading",
    description: "Optimized for speed to keep your visitors engaged.",
  },
  {
    icon: FileText,
    title: "Form Collection",
    description: "Collect leads and feedback with built-in forms and integrations.",
  },
];

const templates = [
  "Link in Bio",
  "Product Launch",
  "Event Registration",
  "Portfolio",
  "Lead Generation",
  "App Download",
];

export default function PagesProductPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Pages</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
                Build landing pages
                <br />
                <span className="gradient-text">in minutes</span>
              </h1>
              <p className="text-lg text-[var(--muted)] mb-8">
                Create mobile-friendly landing pages without any coding.
                Perfect for link-in-bio, campaigns, and lead generation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Create a page
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/pricing">View pricing</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl border border-[var(--border)] p-4">
                <div className="bg-[var(--primary-pale)] rounded-xl p-6 space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-[var(--primary)] flex items-center justify-center">
                    <span className="text-2xl text-white font-bold">JD</span>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-[var(--dark)]">Jane Doe</div>
                    <div className="text-sm text-[var(--muted)]">Digital Creator</div>
                  </div>
                  <div className="space-y-2">
                    {["My Website", "Latest Post", "Shop Now", "Contact Me"].map((link) => (
                      <div
                        key={link}
                        className="bg-white rounded-lg p-3 text-center text-sm font-medium text-[var(--dark)] shadow-sm"
                      >
                        {link}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-[var(--muted)]">
              Build professional landing pages with powerful features.
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

      {/* Templates */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Start with a template
            </h2>
            <p className="text-lg text-[var(--muted)]">
              Choose from professionally designed templates and customize them to fit your needs.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div
                key={template}
                className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all cursor-pointer"
              >
                <div className="h-32 bg-[var(--border)]/50 rounded-lg mb-4 flex items-center justify-center">
                  <FileText className="h-12 w-12 text-[var(--muted)]" />
                </div>
                <div className="font-medium text-[var(--dark)]">{template}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Build your page today
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            No coding required. Create a beautiful page in minutes.
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
