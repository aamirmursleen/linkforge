import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const contactMethods = [
  {
    icon: Mail,
    title: "Email",
    description: "Our team typically responds within 24 hours.",
    value: "hello@linkforge.com",
    href: "mailto:hello@linkforge.com",
  },
  {
    icon: Phone,
    title: "Phone",
    description: "Available Monday to Friday, 9am to 6pm EST.",
    value: "+1 (555) 123-4567",
    href: "tel:+15551234567",
  },
  {
    icon: MapPin,
    title: "Office",
    description: "Come visit us at our headquarters.",
    value: "123 Tech Street, San Francisco, CA 94107",
    href: "#",
  },
];

const departments = [
  {
    title: "Sales",
    description: "Talk to our sales team about enterprise solutions.",
    email: "sales@linkforge.com",
  },
  {
    title: "Support",
    description: "Get help with your account or technical issues.",
    email: "support@linkforge.com",
  },
  {
    title: "Partnerships",
    description: "Explore partnership and integration opportunities.",
    email: "partners@linkforge.com",
  },
  {
    title: "Press",
    description: "Media inquiries and press resources.",
    email: "press@linkforge.com",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">Contact</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
              Get in touch
            </h1>
            <p className="text-lg text-[var(--muted)]">
              Have questions? We'd love to hear from you. Send us a message
              and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Methods */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-8">
              <h2 className="text-2xl font-bold text-[var(--dark)] mb-6">
                Send us a message
              </h2>
              <form className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                      First name
                    </label>
                    <Input id="firstName" placeholder="John" />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                      Last name
                    </label>
                    <Input id="lastName" placeholder="Doe" />
                  </div>
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <label htmlFor="company" className="block text-sm font-medium mb-2">
                    Company
                  </label>
                  <Input id="company" placeholder="Acme Inc." />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">
                    Subject
                  </label>
                  <Input id="subject" placeholder="How can we help?" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="flex w-full rounded-lg border border-[var(--border)] bg-white px-4 py-3 text-sm transition-colors placeholder:text-[var(--muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:border-transparent"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <Button size="lg" className="w-full">
                  Send message
                </Button>
              </form>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              {contactMethods.map((method) => (
                <a
                  key={method.title}
                  href={method.href}
                  className="flex items-start gap-4 bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-lg hover:border-[var(--primary-light)] transition-all"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--primary-pale)]">
                    <method.icon className="h-6 w-6 text-[var(--primary)]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--dark)] mb-1">
                      {method.title}
                    </h3>
                    <p className="text-sm text-[var(--muted)] mb-2">
                      {method.description}
                    </p>
                    <p className="font-medium text-[var(--primary)]">
                      {method.value}
                    </p>
                  </div>
                </a>
              ))}

              {/* Response Time */}
              <div className="bg-[var(--primary-pale)] rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-[var(--primary)]" />
                  <span className="font-semibold text-[var(--dark)]">
                    Average response time
                  </span>
                </div>
                <p className="text-[var(--muted)]">
                  We typically respond within <strong>4 hours</strong> during business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Departments */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Contact the right team
            </h2>
            <p className="text-lg text-[var(--muted)]">
              Reach out directly to the team that can help you best.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {departments.map((dept) => (
              <a
                key={dept.title}
                href={`mailto:${dept.email}`}
                className="bg-white rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-[var(--dark)] mb-2">
                  {dept.title}
                </h3>
                <p className="text-sm text-[var(--muted)] mb-3">
                  {dept.description}
                </p>
                <p className="text-sm font-medium text-[var(--primary)]">
                  {dept.email}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <MessageSquare className="h-12 w-12 mx-auto mb-6 text-[var(--primary-light)]" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Looking for quick answers?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Check out our Help Center for answers to frequently asked questions.
          </p>
          <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
            <Link href="/resources">
              Visit Help Center
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
