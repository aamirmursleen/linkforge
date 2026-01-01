import Link from "next/link";
import {
  Newspaper,
  Book,
  Video,
  HelpCircle,
  FileText,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const resources = [
  {
    icon: Newspaper,
    title: "Blog",
    description: "Latest news, tips, and best practices for link management.",
    href: "/resources",
    count: "50+ articles",
  },
  {
    icon: Book,
    title: "Guides",
    description: "Step-by-step tutorials for getting the most out of LinkForge.",
    href: "/resources",
    count: "20+ guides",
  },
  {
    icon: Video,
    title: "Webinars",
    description: "Live and recorded sessions with link management experts.",
    href: "/resources",
    count: "12+ webinars",
  },
  {
    icon: HelpCircle,
    title: "Help Center",
    description: "Find answers to common questions and troubleshooting tips.",
    href: "/resources",
    count: "100+ articles",
  },
  {
    icon: FileText,
    title: "Case Studies",
    description: "See how other companies use LinkForge to grow their business.",
    href: "/resources",
    count: "15+ stories",
  },
  {
    icon: Lightbulb,
    title: "Templates",
    description: "Ready-to-use templates for QR codes, landing pages, and more.",
    href: "/resources",
    count: "30+ templates",
  },
];

const featuredPosts = [
  {
    title: "10 Ways to Increase Click-Through Rates with Branded Links",
    excerpt: "Learn how branded short links can boost your marketing performance.",
    date: "Dec 15, 2024",
    category: "Marketing",
  },
  {
    title: "QR Code Best Practices for 2025",
    excerpt: "Everything you need to know about creating effective QR codes.",
    date: "Dec 10, 2024",
    category: "QR Codes",
  },
  {
    title: "Getting Started with the LinkForge API",
    excerpt: "A developer's guide to integrating link management into your app.",
    date: "Dec 5, 2024",
    category: "Developers",
  },
];

export default function ResourcesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--primary-pale)] to-white py-20">
        <div className="container text-center">
          <Badge variant="secondary" className="mb-4">Resources</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--dark)] mb-6">
            Learn, grow, and
            <br />
            <span className="gradient-text">succeed with LinkForge</span>
          </h1>
          <p className="text-lg text-[var(--muted)] max-w-2xl mx-auto">
            Explore our library of guides, tutorials, and best practices to
            get the most out of your link management strategy.
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <Link
                key={resource.title}
                href={resource.href}
                className="group bg-white rounded-xl border border-[var(--border)] p-6 hover:shadow-lg hover:border-[var(--primary-light)] transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--primary-pale)] group-hover:bg-[var(--primary)] transition-colors">
                    <resource.icon className="h-6 w-6 text-[var(--primary)] group-hover:text-white transition-colors" />
                  </div>
                  <Badge variant="outline">{resource.count}</Badge>
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

      {/* Featured Posts */}
      <section className="section bg-[var(--primary-pale)]">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold text-[var(--dark)]">
              Featured articles
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/resources">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <article
                key={post.title}
                className="bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all"
              >
                <div className="h-48 bg-[var(--border)]" />
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary">{post.category}</Badge>
                    <span className="text-sm text-[var(--muted)]">{post.date}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">
                    {post.title}
                  </h3>
                  <p className="text-[var(--muted)] text-sm">{post.excerpt}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Stay up to date
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            Get the latest tips, guides, and product updates delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 h-12 px-4 rounded-lg text-[var(--foreground)] placeholder:text-[var(--muted)]"
            />
            <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90">
              Subscribe
            </Button>
          </form>
          <p className="text-sm text-gray-400 mt-4">
            No spam. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </>
  );
}
