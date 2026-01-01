import Link from "next/link";
import {
  Shield,
  Lock,
  Globe,
  Server,
  Eye,
  FileCheck,
  Check,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const certifications = [
  {
    icon: Shield,
    title: "SOC 2 Type II",
    description: "Certified for security, availability, and confidentiality.",
  },
  {
    icon: Globe,
    title: "GDPR Compliant",
    description: "Full compliance with EU data protection regulations.",
  },
  {
    icon: Lock,
    title: "ISO 27001",
    description: "Certified information security management.",
  },
  {
    icon: FileCheck,
    title: "CCPA Compliant",
    description: "California Consumer Privacy Act compliance.",
  },
];

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data is encrypted in transit and at rest using AES-256 encryption.",
  },
  {
    icon: Server,
    title: "Secure Infrastructure",
    description: "Hosted on enterprise-grade cloud infrastructure with 24/7 monitoring.",
  },
  {
    icon: Eye,
    title: "Access Controls",
    description: "Granular role-based access controls and audit logging.",
  },
  {
    icon: Shield,
    title: "DDoS Protection",
    description: "Advanced protection against distributed denial-of-service attacks.",
  },
];

const policies = [
  { title: "Privacy Policy", description: "How we collect, use, and protect your data." },
  { title: "Terms of Service", description: "The terms governing your use of LinkForge." },
  { title: "Data Processing Agreement", description: "For enterprise customers requiring a DPA." },
  { title: "Cookie Policy", description: "How we use cookies and tracking technologies." },
  { title: "Acceptable Use Policy", description: "Guidelines for using our platform." },
  { title: "Security Whitepaper", description: "Technical details of our security measures." },
];

export default function TrustPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Trust & Security</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
            Security you can
            <br />
            <span className="gradient-text">trust</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            LinkForge is built with security at its core. We're committed to
            protecting your data and maintaining the highest security standards.
          </p>
        </div>
      </section>

      {/* Certifications */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Compliance & Certifications
            </h2>
            <p className="text-lg text-[var(--muted)]">
              We maintain industry-leading certifications and compliance standards.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.title}
                className="bg-white rounded-xl border border-[var(--border)] p-6 text-center hover:shadow-lg hover:border-[var(--primary-light)] transition-all"
              >
                <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-full bg-[var(--primary-pale)] mb-4">
                  <cert.icon className="h-8 w-8 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">
                  {cert.title}
                </h3>
                <p className="text-sm text-[var(--muted)]">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Enterprise-grade security
            </h2>
            <p className="text-lg text-gray-300">
              Built to meet the security requirements of the world's largest companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityFeatures.map((feature) => (
              <div key={feature.title} className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-white/10">
                  <feature.icon className="h-6 w-6 text-[var(--primary-light)]" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Uptime */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-6">
                99.99% Uptime SLA
              </h2>
              <p className="text-lg text-[var(--muted)] mb-6">
                We understand that downtime costs money. That's why we guarantee
                99.99% uptime for all enterprise customers, backed by our SLA.
              </p>
              <ul className="space-y-3">
                {[
                  "Multi-region redundancy",
                  "Automatic failover",
                  "Real-time monitoring",
                  "Incident response team",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <Check className="h-5 w-5 text-green-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="text-center">
                <div className="text-6xl font-bold text-[var(--primary)] mb-2">99.99%</div>
                <div className="text-lg text-[var(--muted)]">Uptime Guarantee</div>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                {[
                  { label: "Response Time", value: "< 100ms" },
                  { label: "Data Centers", value: "5" },
                  { label: "Daily Backups", value: "Yes" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-xl font-bold text-[var(--dark)]">{stat.value}</div>
                    <div className="text-xs text-[var(--muted)]">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policies */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Legal & Policies
            </h2>
            <p className="text-lg text-[var(--muted)]">
              Review our policies and legal documents.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {policies.map((policy) => (
              <Link
                key={policy.title}
                href="/trust"
                className="bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-lg hover:border-[var(--primary-light)] transition-all"
              >
                <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">
                  {policy.title}
                </h3>
                <p className="text-[var(--muted)] text-sm">{policy.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Questions about security?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Our security team is happy to answer any questions you have.
          </p>
          <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
            <Link href="/company/contact">
              Contact us
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
