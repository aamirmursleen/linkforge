import Link from "next/link";
import {
  Target,
  Users,
  Globe,
  Heart,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { value: "500K+", label: "Customers" },
  { value: "10B+", label: "Links Created" },
  { value: "150+", label: "Countries" },
  { value: "99.99%", label: "Uptime" },
];

const values = [
  {
    icon: Target,
    title: "Customer First",
    description: "Every decision we make starts with our customers' needs.",
  },
  {
    icon: Users,
    title: "Team Excellence",
    description: "We hire exceptional people and give them the freedom to do great work.",
  },
  {
    icon: Globe,
    title: "Global Impact",
    description: "We're building tools that help businesses connect with customers worldwide.",
  },
  {
    icon: Heart,
    title: "Integrity",
    description: "We do the right thing, even when no one is watching.",
  },
];

const team = [
  { name: "Alex Chen", role: "CEO & Co-founder" },
  { name: "Sarah Kim", role: "CTO & Co-founder" },
  { name: "Michael Ross", role: "VP of Engineering" },
  { name: "Emily Watson", role: "VP of Product" },
  { name: "David Lee", role: "VP of Sales" },
  { name: "Jessica Brown", role: "VP of Marketing" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">About Us</Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
              Making every link
              <br />
              <span className="gradient-text">count</span>
            </h1>
            <p className="text-lg text-[var(--muted)]">
              LinkForge was founded with a simple mission: help businesses create
              meaningful connections through better link management. Today, we serve
              over 500,000 customers worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-[var(--border)]">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-[var(--primary)] mb-2">
                  {stat.value}
                </div>
                <div className="text-[var(--muted)]">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-[var(--muted)]">
                <p>
                  In 2020, we noticed a problem. Businesses were sharing links everywhere -
                  social media, emails, ads, print materials - but had no way to track
                  what was working and what wasn't.
                </p>
                <p>
                  We built LinkForge to solve this problem. What started as a simple link
                  shortener has grown into a comprehensive platform for link management,
                  QR codes, and analytics.
                </p>
                <p>
                  Today, we're proud to serve over 500,000 businesses of all sizes, from
                  solo creators to Fortune 500 companies. Our mission remains the same:
                  help businesses create meaningful connections through better link management.
                </p>
              </div>
            </div>
            <div className="bg-[var(--primary-pale)] rounded-2xl p-8 lg:p-12">
              <blockquote className="text-xl font-medium text-[var(--dark)] mb-4">
                "We believe every link is an opportunity to connect with your audience.
                Our job is to make those connections count."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-semibold">
                  AC
                </div>
                <div>
                  <div className="font-semibold text-[var(--dark)]">Alex Chen</div>
                  <div className="text-sm text-[var(--muted)]">CEO & Co-founder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Our Values
            </h2>
            <p className="text-lg text-[var(--muted)]">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value) => (
              <div
                key={value.title}
                className="bg-white rounded-xl p-6 text-center"
              >
                <div className="flex h-14 w-14 mx-auto items-center justify-center rounded-full bg-[var(--primary-pale)] mb-4">
                  <value.icon className="h-7 w-7 text-[var(--primary)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">
                  {value.title}
                </h3>
                <p className="text-sm text-[var(--muted)]">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Leadership Team
            </h2>
            <p className="text-lg text-[var(--muted)]">
              Meet the people leading LinkForge.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white rounded-xl border border-[var(--border)] p-6 text-center hover:shadow-lg transition-all"
              >
                <div className="h-24 w-24 mx-auto rounded-full bg-[var(--primary)] flex items-center justify-center text-white text-2xl font-semibold mb-4">
                  {member.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <h3 className="text-lg font-semibold text-[var(--dark)]">
                  {member.name}
                </h3>
                <p className="text-[var(--muted)]">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join our team
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people to join our mission.
          </p>
          <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
            <Link href="/company/about">
              View open positions
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
