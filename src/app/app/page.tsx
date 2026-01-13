import Link from "next/link";
import {
  Link2,
  QrCode,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  ExternalLink,
  Sparkles,
  MousePointerClick,
  Activity,
  Globe,
  Zap,
  Target,
  TrendingUp,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";

async function getDashboardStats() {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [totalClicks, totalLinks, totalQrCodes, recentClicks, previousClicks] = await Promise.all([
    prisma.clickEvent.count(),
    prisma.shortLink.count(),
    prisma.qRCode.count(),
    prisma.clickEvent.count({ where: { clickedAt: { gte: sevenDaysAgo } } }),
    prisma.clickEvent.count({ where: { clickedAt: { gte: fourteenDaysAgo, lt: sevenDaysAgo } } }),
  ]);

  const clicksChange = previousClicks > 0 ? ((recentClicks - previousClicks) / previousClicks) * 100 : recentClicks > 0 ? 100 : 0;
  return { totalClicks, totalLinks, totalQrCodes, recentClicks, clicksChange };
}

async function getRecentLinks() {
  const links = await prisma.shortLink.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { clickEvents: true } } },
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
  return `${days}d ago`;
}

function ProgressRing({ value, color, size = 120, strokeWidth = 10 }: { value: number; color: string; size?: number; strokeWidth?: number }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90 drop-shadow-lg">
        <defs>
          <linearGradient id={`ring-gradient-${color.replace("#", "")}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={color} stopOpacity="0.5" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={`url(#ring-gradient-${color.replace("#", "")})`} strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className="transition-all duration-1000 ease-out" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-white">{value}%</span>
        <span className="text-xs text-white/60">Complete</span>
      </div>
    </div>
  );
}

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  return <span className="tabular-nums">{value.toLocaleString()}{suffix}</span>;
}

function GlowingIcon({ icon: Icon, color }: { icon: React.ComponentType<{ className?: string }>; color: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 rounded-2xl blur-xl opacity-50" style={{ backgroundColor: color }} />
      <div className="relative p-4 rounded-2xl" style={{ backgroundColor: `${color}20` }}>
        <Icon className="h-7 w-7" style={{ color }} />
      </div>
    </div>
  );
}

function Sparkline({ data, color, height = 60 }: { data: number[]; color: string; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 200;
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height * 0.8 - height * 0.1;
    return `${x},${y}`;
  });
  const gradientId = `sparkline-${color.replace("#", "")}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="overflow-visible">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M0,${height} L${points.join(" L")} L${width},${height} Z`} fill={`url(#${gradientId})`} />
      <polyline points={points.join(" ")} fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
      <circle cx={points[points.length - 1].split(",")[0]} cy={points[points.length - 1].split(",")[1]} r="5" fill={color} style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
    </svg>
  );
}

function MiniProgress({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}, ${color}80)`, boxShadow: `0 0 10px ${color}` }} />
    </div>
  );
}

export default async function DashboardPage() {
  const stats = await getDashboardStats();
  const recentLinks = await getRecentLinks();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const sparkData = [30, 45, 35, 60, 40, 70, 55, 80, 65, 90, 75, 95];
  const performanceScore = Math.min(stats.totalLinks > 0 ? Math.floor((stats.totalClicks / stats.totalLinks) * 8) + 20 : 45, 100);

  return (
    <>
      <AppHeader title="Dashboard" />
      <div className="min-h-screen bg-[#0f0a1f]" style={{ background: "linear-gradient(135deg, #0f0a1f 0%, #1a1035 50%, #0d1025 100%)" }}>
        <div className="p-6 lg:p-8 space-y-8">
          
          {/* Hero Stats Section */}
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Main Performance Card */}
            <div className="lg:col-span-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/20 to-fuchsia-600/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all duration-500" />
              <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-white/60">Performance</span>
                  <span className="flex items-center gap-1 text-emerald-400 text-sm"><ArrowUpRight className="h-4 w-4" />12%</span>
                </div>
                <div className="flex justify-center py-4">
                  <ProgressRing value={performanceScore} color="#8b5cf6" />
                </div>
                <div className="text-center mt-2">
                  <p className="text-white/40 text-sm">Overall Score</p>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="lg:col-span-3 grid sm:grid-cols-3 gap-4">
              {/* Total Clicks */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-cyan-500/30 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <GlowingIcon icon={MousePointerClick} color="#06b6d4" />
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                      <ArrowUpRight className="h-3 w-3" />{stats.clicksChange.toFixed(0)}%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-bold text-white"><AnimatedCounter value={stats.totalClicks} /></h3>
                    <p className="text-white/50 text-sm">Total Clicks</p>
                  </div>
                  <div className="mt-4"><Sparkline data={sparkData} color="#06b6d4" height={40} /></div>
                </div>
              </div>

              {/* Active Links */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-violet-500/30 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <GlowingIcon icon={Link2} color="#8b5cf6" />
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                      <ArrowUpRight className="h-3 w-3" />8%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-bold text-white"><AnimatedCounter value={stats.totalLinks} /></h3>
                    <p className="text-white/50 text-sm">Active Links</p>
                  </div>
                  <div className="mt-4"><Sparkline data={[20, 35, 25, 45, 40, 55, 50, 65, 55, 70, 60, 75]} color="#8b5cf6" height={40} /></div>
                </div>
              </div>

              {/* QR Codes */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-amber-500/30 transition-all duration-300 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <GlowingIcon icon={QrCode} color="#f59e0b" />
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium">
                      <ArrowUpRight className="h-3 w-3" />15%
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-3xl font-bold text-white"><AnimatedCounter value={stats.totalQrCodes} /></h3>
                    <p className="text-white/50 text-sm">QR Codes</p>
                  </div>
                  <div className="mt-4"><Sparkline data={[10, 18, 15, 25, 20, 30, 28, 35, 32, 40, 38, 45]} color="#f59e0b" height={40} /></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-5 shadow-lg shadow-emerald-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-emerald-100 text-sm mb-1">This Week</p>
                  <h4 className="text-2xl font-bold text-white">{stats.recentClicks.toLocaleString()}</h4>
                  <span className="flex items-center gap-1 text-emerald-200 text-xs mt-1"><TrendingUp className="h-3 w-3" />+24.5% vs last week</span>
                </div>
                <Activity className="h-10 w-10 text-emerald-300/50" />
              </div>
              <div className="mt-4"><MiniProgress value={78} color="#a7f3d0" /></div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-5 shadow-lg shadow-blue-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm mb-1">Avg. Daily</p>
                  <h4 className="text-2xl font-bold text-white">{Math.floor(stats.recentClicks / 7)}</h4>
                  <span className="flex items-center gap-1 text-blue-200 text-xs mt-1"><Zap className="h-3 w-3" />Peak: 2.4K</span>
                </div>
                <Target className="h-10 w-10 text-blue-300/50" />
              </div>
              <div className="mt-4"><MiniProgress value={65} color="#93c5fd" /></div>
            </div>

            <div className="bg-gradient-to-br from-purple-600 to-violet-700 rounded-2xl p-5 shadow-lg shadow-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm mb-1">Reach</p>
                  <h4 className="text-2xl font-bold text-white">{Math.min(stats.totalClicks + 15, 180)}+</h4>
                  <span className="flex items-center gap-1 text-purple-200 text-xs mt-1"><Globe className="h-3 w-3" />Countries</span>
                </div>
                <Globe className="h-10 w-10 text-purple-300/50" />
              </div>
              <div className="mt-4"><MiniProgress value={92} color="#c4b5fd" /></div>
            </div>

            <div className="bg-gradient-to-br from-rose-600 to-pink-700 rounded-2xl p-5 shadow-lg shadow-rose-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-rose-100 text-sm mb-1">Success Rate</p>
                  <h4 className="text-2xl font-bold text-white">98.5%</h4>
                  <span className="flex items-center gap-1 text-rose-200 text-xs mt-1"><CheckCircle2 className="h-3 w-3" />Uptime</span>
                </div>
                <CheckCircle2 className="h-10 w-10 text-rose-300/50" />
              </div>
              <div className="mt-4"><MiniProgress value={98} color="#fda4af" /></div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Recent Links */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 rounded-3xl" />
                <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Recent Links</h3>
                      <p className="text-sm text-white/40">Your latest shortened URLs</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-violet-400 hover:text-violet-300 hover:bg-violet-500/10" asChild>
                      <Link href="/app/links">View All<ArrowUpRight className="h-4 w-4 ml-1" /></Link>
                    </Button>
                  </div>
                  <div className="p-4">
                    {recentLinks.length > 0 ? (
                      <div className="space-y-2">
                        {recentLinks.map((link, index) => {
                          const colors = ["#06b6d4", "#8b5cf6", "#f59e0b", "#ec4899", "#10b981"];
                          const color = colors[index % colors.length];
                          return (
                            <div key={link.id} className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 transition-all duration-300">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <div className="absolute inset-0 rounded-xl blur-md opacity-50 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: color }} />
                                  <div className="relative h-12 w-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
                                    <Link2 className="h-5 w-5" style={{ color }} />
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium text-white group-hover:text-white transition-colors">{link.title}</h4>
                                  <p className="text-sm text-white/40 group-hover:text-white/60 transition-colors">{appUrl.replace(/https?:\/\//, "")}/r/{link.shortCode}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg font-semibold text-white">{link.clicks}</span>
                                  <span className="text-xs text-white/40">clicks</span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-white/30">
                                  <Clock className="h-3 w-3" />{formatTimeAgo(link.createdAt)}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-16">
                        <div className="relative mx-auto w-20 h-20 mb-6">
                          <div className="absolute inset-0 bg-violet-500/30 rounded-2xl blur-xl" />
                          <div className="relative h-20 w-20 rounded-2xl bg-violet-500/20 flex items-center justify-center">
                            <Link2 className="h-10 w-10 text-violet-400" />
                          </div>
                        </div>
                        <h3 className="font-semibold text-white text-lg mb-2">No links yet</h3>
                        <p className="text-white/40 mb-6 max-w-sm mx-auto">Create your first shortened link and start tracking your clicks</p>
                        <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white shadow-lg shadow-violet-500/30" asChild>
                          <Link href="/app/links"><Plus className="h-4 w-4 mr-2" />Create Your First Link</Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
                <div className="p-6 border-b border-white/10">
                  <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                </div>
                <div className="p-4 space-y-2">
                  <Link href="/app/links" className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 hover:from-cyan-500/20 hover:to-blue-500/20 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group">
                    <div className="p-2 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 transition-colors">
                      <Link2 className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Create Link</p>
                      <p className="text-xs text-white/40">Shorten any URL</p>
                    </div>
                  </Link>
                  <Link href="/app/qr" className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20 border border-violet-500/20 hover:border-violet-500/40 transition-all duration-300 group">
                    <div className="p-2 rounded-xl bg-violet-500/20 group-hover:bg-violet-500/30 transition-colors">
                      <QrCode className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Generate QR</p>
                      <p className="text-xs text-white/40">Create QR codes</p>
                    </div>
                  </Link>
                  <Link href="/app/analytics" className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/20 hover:border-amber-500/40 transition-all duration-300 group">
                    <div className="p-2 rounded-xl bg-amber-500/20 group-hover:bg-amber-500/30 transition-colors">
                      <BarChart3 className="h-5 w-5 text-amber-400" />
                    </div>
                    <div>
                      <p className="font-medium text-white">Analytics</p>
                      <p className="text-xs text-white/40">View detailed stats</p>
                    </div>
                  </Link>
                </div>
              </div>

              {/* AI Assistant Card */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative bg-gradient-to-br from-violet-600 to-fuchsia-600 rounded-3xl p-6 overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-xl bg-white/20">
                        <Sparkles className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-white text-lg">AI Assistant</h3>
                    </div>
                    <p className="text-white/80 text-sm mb-4">Get instant help with link optimization, analytics insights, and more.</p>
                    <Button size="sm" className="bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-sm" asChild>
                      <Link href="/features">Explore Features<ExternalLink className="h-3 w-3 ml-2" /></Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
