import Link from "next/link";
import {
  Building2,
  Users,
  ShoppingCart,
  Megaphone,
  GraduationCap,
  Briefcase,
  ArrowRight,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const solutions = [
  {
    icon: Building2,
    title: "Enterprise",
    description: "Scalable link management for large organizations with advanced security and compliance.",
    features: ["SSO & SAML", "99.99% SLA", "Dedicated support", "Custom contracts"],
  },
  {
    icon: Users,
    title: "Small Business",
    description: "Powerful tools to help growing businesses create and track branded links.",
    features: ["Team collaboration", "Custom domains", "Full analytics", "API access"],
  },
  {
    icon: ShoppingCart,
    title: "E-commerce",
    description: "Drive sales with trackable links for products, campaigns, and affiliates.",
    features: ["UTM tracking", "Conversion analytics", "Affiliate links", "QR codes"],
  },
  {
    icon: Megaphone,
    title: "Marketing Teams",
    description: "Measure campaign performance across all channels with detailed analytics.",
    features: ["Campaign tracking", "A/B testing", "Real-time data", "Custom reports"],
  },
  {
    icon: GraduationCap,
    title: "Education",
    description: "Share resources and track engagement with students and faculty.",
    features: ["Special pricing", "Bulk links", "Easy sharing", "Analytics"],
  },
  {
    icon: Briefcase,
    title: "Agencies",
    description: "Manage links for multiple clients with white-label solutions.",
    features: ["Multi-client support", "White labeling", "Client reporting", "API access"],
  },
];

export default function SolutionsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Solutions</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
            Built for every
            <br />
            <span className="gradient-text">industry and team</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            Whether you're a startup or enterprise, LinkForge has the tools
            you need to create, manage, and track your links.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution) => (
              <div
                key={solution.title}
                className="bg-white rounded-xl border border-[var(--border)] p-8 hover:shadow-lg hover:border-[var(--primary-light)] transition-all"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[var(--primary-pale)] mb-6">
                  <solution.icon className="h-7 w-7 text-[var(--primary)]" />
                </div>
                <h3 className="text-xl font-bold text-[var(--dark)] mb-3">
                  {solution.title}
                </h3>
                <p className="text-[var(--muted)] mb-6">{solution.description}</p>
                <ul className="space-y-2 mb-6">
                  {solution.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-green-500" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button variant="secondary" className="w-full" asChild>
                  <Link href="/pricing">
                    Learn more
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses using LinkForge.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
              <Link href="/signup">Start free trial</Link>
            </Button>
            <Button size="lg" variant="secondary" className="border-white text-white hover:bg-white/10" asChild>
              <Link href="/company/contact">Contact sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
