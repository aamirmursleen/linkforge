import Link from "next/link";
import {
  Link2,
  QrCode,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ExternalLink,
} from "lucide-react";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: "Total Clicks",
    value: "24,589",
    change: "+12.5%",
    trend: "up",
    icon: BarChart3,
  },
  {
    title: "Active Links",
    value: "847",
    change: "+8.2%",
    trend: "up",
    icon: Link2,
  },
  {
    title: "QR Scans",
    value: "3,241",
    change: "+24.1%",
    trend: "up",
    icon: QrCode,
  },
  {
    title: "Conversion Rate",
    value: "4.2%",
    change: "-0.4%",
    trend: "down",
    icon: TrendingUp,
  },
];

const recentLinks = [
  {
    title: "Summer Sale Campaign",
    shortUrl: "lnk.fg/summer-sale",
    clicks: 1243,
    created: "2 hours ago",
  },
  {
    title: "Product Launch",
    shortUrl: "lnk.fg/new-product",
    clicks: 892,
    created: "Yesterday",
  },
  {
    title: "Newsletter Signup",
    shortUrl: "lnk.fg/newsletter",
    clicks: 567,
    created: "3 days ago",
  },
  {
    title: "Social Media Bio",
    shortUrl: "lnk.fg/bio",
    clicks: 2341,
    created: "1 week ago",
  },
];

export default function DashboardPage() {
  return (
    <>
      <AppHeader title="Dashboard" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--dark)] rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">Welcome back, John!</h2>
              <p className="text-white/80">
                Your links received 2,341 clicks in the last 7 days.
              </p>
            </div>
            <Button className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
              <Link href="/app/links">
                <Plus className="h-4 w-4" />
                Create Link
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className="h-5 w-5 text-[var(--muted)]" />
                  <Badge
                    variant={stat.trend === "up" ? "success" : "destructive"}
                    className="text-xs"
                  >
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                    )}
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-[var(--dark)]">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--muted)]">{stat.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Links & Quick Actions */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Links */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Recent Links</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/app/links">View all</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentLinks.map((link) => (
                    <div
                      key={link.shortUrl}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--border)]/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[var(--primary-pale)] flex items-center justify-center">
                          <Link2 className="h-5 w-5 text-[var(--primary)]" />
                        </div>
                        <div>
                          <div className="font-medium text-[var(--dark)]">
                            {link.title}
                          </div>
                          <div className="text-sm text-[var(--primary)]">
                            {link.shortUrl}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{link.clicks}</div>
                        <div className="text-xs text-[var(--muted)]">
                          {link.created}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/app/links">
                    <Link2 className="h-4 w-4 mr-2" />
                    Create Short Link
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/app/qr">
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate QR Code
                  </Link>
                </Button>
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/app/analytics">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    View Analytics
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[var(--primary-pale)] border-[var(--primary-light)]">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-[var(--dark)] mb-2">
                  Upgrade to Pro
                </h3>
                <p className="text-sm text-[var(--muted)] mb-4">
                  Get unlimited links, advanced analytics, and custom domains.
                </p>
                <Button size="sm" asChild>
                  <Link href="/pricing">
                    Upgrade Now
                    <ExternalLink className="h-3 w-3 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
