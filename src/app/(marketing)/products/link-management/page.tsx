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
import { UrlShortener } from "@/components/url-shortener";

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
              <UrlShortener />
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

      {/* Use Cases Section */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Who Uses URL Shorteners?
            </h2>
            <p className="text-lg text-[var(--muted)]">
              From startups to Fortune 500 companies, branded short links drive results across industries.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Digital Marketers", desc: "Track campaign performance, A/B test landing pages, and measure ROI with detailed click analytics." },
              { title: "Social Media Managers", desc: "Share clean, branded links on Instagram, Twitter, LinkedIn, and TikTok that build trust." },
              { title: "E-commerce Brands", desc: "Create memorable product links, track affiliate sales, and retarget shoppers who clicked." },
              { title: "Content Creators", desc: "Use custom short links in YouTube descriptions, podcasts, and newsletters to track engagement." },
            ].map((useCase) => (
              <div key={useCase.title} className="bg-[var(--primary-pale)]/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-[var(--dark)] mb-2">{useCase.title}</h3>
                <p className="text-sm text-[var(--muted)]">{useCase.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section - Great for SEO Featured Snippets */}
      <section className="section bg-gray-50">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--dark)] mb-4">
              Frequently Asked Questions About URL Shorteners
            </h2>
            <p className="text-lg text-[var(--muted)]">
              Everything you need to know about link shortening and management.
            </p>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "What is a URL shortener?",
                answer: "A URL shortener is a tool that converts long, complex URLs into short, easy-to-share links. For example, LinkForge can transform a 200-character URL into a clean link like 'lnkf.io/xyz'. Short links are easier to share on social media, track for analytics, and remember."
              },
              {
                question: "Are shortened URLs safe to click?",
                answer: "Yes, shortened URLs from reputable services like LinkForge are safe. We scan all destination URLs for malware and phishing. Plus, our links use HTTPS encryption. You can also preview where a short link leads before clicking by adding '+' to the end of the URL."
              },
              {
                question: "How do branded links increase click-through rates?",
                answer: "Studies show branded short links get up to 34% more clicks than generic ones. When people see a recognizable brand domain (like 'yourbrand.link/offer'), they trust it more than random characters. This trust translates directly into higher click-through rates and better campaign performance."
              },
              {
                question: "Can I use my own custom domain for short links?",
                answer: "Yes! LinkForge supports custom branded domains. You can use your own domain (like 'go.yourbrand.com') to create professional short links. This strengthens brand recognition and builds trust with your audience. Setup takes just 5 minutes with our DNS configuration guide."
              },
              {
                question: "What analytics do I get with LinkForge?",
                answer: "LinkForge provides comprehensive link analytics including: total clicks, unique visitors, geographic location (country, city), device type (mobile, desktop, tablet), browser and OS, referral sources, click timestamps, and UTM campaign tracking. All data is available in real-time dashboards."
              },
              {
                question: "Is LinkForge better than Bitly?",
                answer: "LinkForge offers more features at a fraction of the cost. While Bitly charges $348/year for premium features, LinkForge offers lifetime access for just $27. You get unlimited links, 10 custom domains, team collaboration, and 365-day analytics retention - features that cost extra with Bitly."
              },
              {
                question: "Can I edit the destination URL after creating a short link?",
                answer: "Yes! With LinkForge, you can change where your short link redirects at any time without changing the short URL itself. This is perfect for updating campaign links, fixing typos, or redirecting old links to new pages - all without breaking existing shares."
              },
              {
                question: "Do short links expire?",
                answer: "By default, LinkForge links never expire and work forever. However, you can optionally set expiration dates for time-sensitive campaigns. After expiration, visitors see a custom message or are redirected to a fallback URL of your choice."
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-[var(--dark)] mb-3">{faq.question}</h3>
                <p className="text-[var(--muted)] leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section bg-[var(--dark)] text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Start Creating Branded Short Links Today
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Join 500,000+ marketers, businesses, and creators using LinkForge to boost their click-through rates by up to 34%. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
              <Link href="/signup">
                Create Free Short Link
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/pricing">View Pricing Plans</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-4">Free forever plan available · No credit card required · Setup in 30 seconds</p>
        </div>
      </section>
    </>
  );
}
