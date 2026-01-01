import Link from "next/link";
import {
  Plug,
  Zap,
  Code,
  Webhook,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const integrations = [
  { name: "Zapier", category: "Automation" },
  { name: "Slack", category: "Communication" },
  { name: "HubSpot", category: "CRM" },
  { name: "Salesforce", category: "CRM" },
  { name: "Google Analytics", category: "Analytics" },
  { name: "Shopify", category: "E-commerce" },
  { name: "WordPress", category: "CMS" },
  { name: "Mailchimp", category: "Email" },
  { name: "Notion", category: "Productivity" },
  { name: "Airtable", category: "Database" },
  { name: "Intercom", category: "Support" },
  { name: "Segment", category: "Analytics" },
];

const features = [
  {
    icon: Zap,
    title: "Zapier Integration",
    description: "Connect to 5,000+ apps and automate your workflows without code.",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Receive real-time notifications when links are clicked or QR codes scanned.",
  },
  {
    icon: Code,
    title: "REST API",
    description: "Full API access to programmatically create and manage links.",
  },
  {
    icon: Plug,
    title: "Native Integrations",
    description: "Pre-built integrations with popular tools for quick setup.",
  },
];

export default function IntegrationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Integrations</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
            Connect with your
            <br />
            <span className="gradient-text">favorite tools</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto mb-8">
            Integrate LinkForge with 100+ apps and services. Automate workflows,
            sync data, and build custom solutions with our powerful API.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/developers">
                View API docs
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/signup">Start for free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Integration Grid */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              100+ integrations
            </h2>
            <p className="text-lg text-[var(--muted)]">
              Connect LinkForge with the tools you already use.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {integrations.map((integration) => (
              <div
                key={integration.name}
                className="bg-white rounded-xl border border-[var(--border)] p-4 text-center hover:shadow-lg hover:border-[var(--primary-light)] transition-all"
              >
                <div className="h-12 w-12 mx-auto mb-3 rounded-lg bg-[var(--primary-pale)] flex items-center justify-center">
                  <Plug className="h-6 w-6 text-[var(--primary)]" />
                </div>
                <div className="font-medium text-sm text-[var(--dark)]">{integration.name}</div>
                <div className="text-xs text-[var(--muted)]">{integration.category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
            Build something amazing
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Our API makes it easy to integrate LinkForge into your workflow.
          </p>
          <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
            <Link href="/developers">
              Explore the API
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
