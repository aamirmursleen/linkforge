import Link from "next/link";
import {
  Link2,
  QrCode,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  Plus,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { prisma } from "@/lib/db";

async function getDashboardStats() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [totalClicks, totalLinks, totalQrCodes, recentClicks] = await Promise.all([
    prisma.clickEvent.count(),
    prisma.shortLink.count(),
    prisma.qRCode.count(),
    prisma.clickEvent.count({
      where: { clickedAt: { gte: sevenDaysAgo } },
    }),
  ]);

  return {
    totalClicks,
    totalLinks,
    totalQrCodes,
    recentClicks,
  };
}

async function getRecentLinks() {
  const links = await prisma.shortLink.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { clickEvents: true } },
    },
  });

  return links.map((link) => ({
    id: link.id,
    title: link.title || "Untitled Link",
    shortCode: link.shortCode,
    clicks: link._count.clickEvents,
    createdAt: link.createdAt,
  }));
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentLinks = await getRecentLinks();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const isNewUser = stats.totalLinks === 0;

  return (
    <>
      <AppHeader title="Dashboard" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--dark)] rounded-xl p-6 text-white">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {isNewUser ? "Welcome to LinkForge!" : "Welcome back!"}
              </h2>
              <p className="text-white/80">
                {isNewUser
                  ? "Create your first short link to get started."
                  : `Your links received ${stats.recentClicks.toLocaleString()} clicks in the last 7 days.`}
              </p>
            </div>
            <Button className="bg-white text-[var(--primary)] hover:bg-white/90" asChild>
              <Link href="/app/links">
                <Plus className="h-4 w-4 mr-2" />
                Create Link
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <BarChart3 className="h-5 w-5 text-[var(--muted)]" />
                {stats.totalClicks > 0 && (
                  <Badge variant="success" className="text-xs">
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    Active
                  </Badge>
                )}
              </div>
              <div className="text-2xl font-bold text-[var(--dark)]">
                {stats.totalClicks.toLocaleString()}
              </div>
              <div className="text-sm text-[var(--muted)]">Total Clicks</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <Link2 className="h-5 w-5 text-[var(--muted)]" />
              </div>
              <div className="text-2xl font-bold text-[var(--dark)]">
                {stats.totalLinks.toLocaleString()}
              </div>
              <div className="text-sm text-[var(--muted)]">Active Links</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <QrCode className="h-5 w-5 text-[var(--muted)]" />
              </div>
              <div className="text-2xl font-bold text-[var(--dark)]">
                {stats.totalQrCodes.toLocaleString()}
              </div>
              <div className="text-sm text-[var(--muted)]">QR Codes</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="h-5 w-5 text-[var(--muted)]" />
              </div>
              <div className="text-2xl font-bold text-[var(--dark)]">
                {stats.recentClicks.toLocaleString()}
              </div>
              <div className="text-sm text-[var(--muted)]">Clicks (7 days)</div>
            </CardContent>
          </Card>
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
                {recentLinks.length > 0 ? (
                  <div className="space-y-4">
                    {recentLinks.map((link) => (
                      <div
                        key={link.id}
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
                              {appUrl.replace(/https?:\/\//, "")}/r/{link.shortCode}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">{link.clicks}</div>
                          <div className="text-xs text-[var(--muted)]">
                            {formatTimeAgo(link.createdAt)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="h-12 w-12 rounded-full bg-[var(--primary-pale)] flex items-center justify-center mx-auto mb-4">
                      <Link2 className="h-6 w-6 text-[var(--primary)]" />
                    </div>
                    <h3 className="font-medium text-[var(--dark)] mb-1">No links yet</h3>
                    <p className="text-sm text-[var(--muted)] mb-4">
                      Create your first short link to get started
                    </p>
                    <Button size="sm" asChild>
                      <Link href="/app/links">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Link
                      </Link>
                    </Button>
                  </div>
                )}
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
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                  <h3 className="font-semibold text-[var(--dark)]">
                    AI Assistant
                  </h3>
                </div>
                <p className="text-sm text-[var(--muted)] mb-4">
                  Need help? Click the chat button in the corner to ask our AI assistant.
                </p>
                <Button size="sm" variant="outline" asChild>
                  <Link href="/features">
                    Learn More
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
