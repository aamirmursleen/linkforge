import Link from "next/link";
import {
  Code,
  Book,
  Terminal,
  Webhook,
  Key,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const features = [
  {
    icon: Terminal,
    title: "REST API",
    description: "Full-featured REST API for creating, managing, and tracking links programmatically.",
  },
  {
    icon: Webhook,
    title: "Webhooks",
    description: "Receive real-time notifications when links are clicked or QR codes are scanned.",
  },
  {
    icon: Key,
    title: "API Keys",
    description: "Secure API key management with granular permissions and rate limiting.",
  },
  {
    icon: Zap,
    title: "SDKs",
    description: "Official SDKs for JavaScript, Python, Ruby, Go, and more.",
  },
];

const codeExample = `// Create a short link
const response = await fetch('https://api.linkforge.com/v1/links', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com/long-url',
    domain: 'lnk.fg',
    title: 'My Campaign Link'
  })
});

const link = await response.json();
console.log(link.short_url); // https://lnk.fg/abc123`;

export default function DevelopersPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="secondary" className="mb-4">Developers</Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
                Build with the
                <br />
                <span className="gradient-text">LinkForge API</span>
              </h1>
              <p className="text-lg text-[var(--muted)] mb-8">
                Integrate link management into your applications with our powerful
                REST API, SDKs, and webhooks.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">
                    Get API key
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/developers">View docs</Link>
                </Button>
              </div>
            </div>
            <div>
              <div className="bg-[var(--dark)] rounded-xl p-6 font-mono text-sm">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <pre className="text-green-400 overflow-x-auto">
                  <code>{codeExample}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* SDKs */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Official SDKs
            </h2>
            <p className="text-lg text-[var(--muted)]">
              Get started quickly with our official SDKs for popular languages.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {["JavaScript", "Python", "Ruby", "Go", "PHP", "Java"].map((lang) => (
              <div
                key={lang}
                className="bg-white rounded-xl p-4 text-center hover:shadow-lg transition-all"
              >
                <Code className="h-8 w-8 mx-auto mb-2 text-[var(--primary)]" />
                <div className="font-medium text-sm">{lang}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Book,
                title: "API Reference",
                description: "Complete documentation for all API endpoints.",
              },
              {
                icon: Code,
                title: "Code Examples",
                description: "Sample code for common use cases and integrations.",
              },
              {
                icon: Terminal,
                title: "CLI Tool",
                description: "Command-line interface for managing links.",
              },
            ].map((resource) => (
              <Link
                key={resource.title}
                href="/developers"
                className="group bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-lg hover:border-[var(--primary-light)] transition-all"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary-pale)] mb-4 group-hover:bg-[var(--primary)] transition-colors">
                  <resource.icon className="h-6 w-6 text-[var(--primary)] group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">
                  {resource.title}
                </h3>
                <p className="text-[var(--muted)]">{resource.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start building today
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Get your API key and start integrating in minutes.
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
