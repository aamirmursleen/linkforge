"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app/app-header";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  ArrowUpRight,
  ArrowDownRight,
  MousePointerClick,
  Users,
  Target,
  Clock,
  Download,
  RefreshCw,
  Calendar,
  QrCode,
  Link2,
  Chrome,
  Laptop,
  Share2,
  Search,
  Mail,
  ExternalLink,
  ChevronDown,
  Filter,
  Zap,
  Activity,
  PieChart,
  MapPin,
  Layers,
  Copy,
  Check,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Glowing Icon Component
function GlowingIcon({ icon: Icon, color, size = "md" }: { icon: any; color: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  const containerSizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
  const glowSizes = { sm: "h-6 w-6", md: "h-8 w-8", lg: "h-10 w-10" };

  return (
    <div className={`relative ${containerSizes[size]} flex items-center justify-center`}>
      <div className={`absolute ${glowSizes[size]} rounded-full ${color} opacity-40 blur-lg`} />
      <div className={`relative ${containerSizes[size]} rounded-xl ${color} bg-opacity-20 flex items-center justify-center backdrop-blur-sm border border-white/10`}>
        <Icon className={`${sizes[size]} text-white`} />
      </div>
    </div>
  );
}

const timeRanges = [
  { label: "1h", value: "1h" },
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = ["12a", "2a", "4a", "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"];

const countryFlags: Record<string, string> = {
  "United States": "US", "United Kingdom": "UK", Germany: "DE", Canada: "CA",
  Australia: "AU", France: "FR", India: "IN", Brazil: "BR",
  Japan: "JP", Mexico: "MX", Unknown: "??",
};

const deviceIcons: Record<string, any> = {
  mobile: Smartphone, desktop: Monitor, tablet: Tablet, bot: Globe, unknown: Globe,
};

const deviceColors: Record<string, string> = {
  mobile: "bg-cyan-500", desktop: "bg-violet-500", tablet: "bg-amber-500", bot: "bg-gray-500", unknown: "bg-gray-400",
};

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = async (range: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics?range=${range}`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      } else {
        setData(getEmptyData(range));
      }
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
      setData(getEmptyData(range));
    } finally {
      setLoading(false);
    }
  };

  function getEmptyData(range: string) {
    return {
      dateRange: { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), end: new Date().toISOString(), range },
      summary: { totalClicks: 0, clicksChange: 0, uniqueVisitors: 0, visitorsChange: 0, qrScans: 0, qrChange: 0, totalLinks: 0, activeLinks: 0 },
      clicksOverTime: [],
      topLinks: [],
      devices: [],
      browsers: [],
      operatingSystems: [],
      countries: [],
      sources: [],
      sourceCategories: [],
      referrers: [],
      heatmap: Array.from({ length: 7 }, () => Array.from({ length: 12 }, () => 0)),
      peakTime: { day: "N/A", hour: 0, clicks: 0 },
    };
  }

  useEffect(() => {
    fetchAnalytics(selectedRange);
  }, [selectedRange]);

  const getHeatmapColor = (value: number) => {
    if (value === 0) return "bg-white/5";
    if (value <= 3) return "bg-violet-500/20";
    if (value <= 6) return "bg-violet-500/40";
    if (value <= 9) return "bg-violet-500/60";
    if (value <= 12) return "bg-violet-500/80";
    return "bg-violet-500";
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  if (loading && !data) {
    return (
      <div className="min-h-screen bg-[#0f0a1f]">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10">
          <AppHeader title="Analytics" />
          <div className="flex items-center justify-center h-96">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
              <p className="text-gray-400">Loading analytics...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const maxClicks = Math.max(...data.clicksOverTime.map((d: any) => d.clicks), 1);

  return (
    <div className="min-h-screen bg-[#0f0a1f]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <AppHeader title="Analytics" />

        <div className="p-4 lg:p-6 space-y-6">
          {/* Top Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex items-center gap-4">
              {/* Live Indicator */}
              <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
                <span className="text-sm font-medium text-emerald-400">Live</span>
              </div>

              {lastUpdated && (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  <span>Updated {lastUpdated.toLocaleTimeString()}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="flex items-center bg-white/5 rounded-xl p-1 border border-white/10">
                {timeRanges.map((range) => (
                  <button
                    key={range.value}
                    onClick={() => setSelectedRange(range.value)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                      selectedRange === range.value
                        ? "bg-violet-500 text-white shadow-lg shadow-violet-500/25"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {range.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => fetchAnalytics(selectedRange)}
                disabled={loading}
                className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-400 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              </button>

              <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm transition-colors">
                <Download className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Total Clicks", value: data.summary.totalClicks, change: data.summary.clicksChange, icon: MousePointerClick, color: "bg-violet-500", subValue: `${data.summary.activeLinks} active links` },
              { title: "Unique Visitors", value: data.summary.uniqueVisitors, change: data.summary.visitorsChange, icon: Users, color: "bg-emerald-500", subValue: `${Math.round((data.summary.uniqueVisitors / data.summary.totalClicks) * 100) || 0}% of clicks` },
              { title: "QR Scans", value: data.summary.qrScans, change: data.summary.qrChange, icon: QrCode, color: "bg-cyan-500", subValue: `${Math.round((data.summary.qrScans / data.summary.totalClicks) * 100) || 0}% of total` },
              { title: "Total Links", value: data.summary.totalLinks, change: 0, icon: Link2, color: "bg-amber-500", subValue: `${data.summary.activeLinks} active` },
            ].map((stat) => (
              <div key={stat.title} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-5 hover:border-white/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <GlowingIcon icon={stat.icon} color={stat.color} size="md" />
                  {stat.change !== 0 && (
                    <span className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                      stat.change >= 0 ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {stat.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                      {formatChange(stat.change)}
                    </span>
                  )}
                </div>
                <div className="text-3xl font-bold text-white mb-1">{stat.value.toLocaleString()}</div>
                <div className="text-sm text-gray-400">{stat.title}</div>
                <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-white/10">{stat.subValue}</div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Clicks Over Time */}
            <div className="lg:col-span-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-violet-400" />
                  <h3 className="font-semibold text-white">Engagement Over Time</h3>
                  <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-500/20 text-violet-400">{selectedRange}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-violet-500" />
                    <span className="text-gray-400">Clicks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-fuchsia-500" />
                    <span className="text-gray-400">QR Scans</span>
                  </div>
                </div>
              </div>
              <div className="h-64 flex items-end gap-1 p-4 bg-white/5 rounded-xl overflow-x-auto">
                {data.clicksOverTime.slice(-14).map((item: any, i: number) => (
                  <div key={i} className="flex-1 min-w-[30px] flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#1a1425] border border-white/10 text-white text-xs px-2 py-1 rounded mb-2 whitespace-nowrap z-10">
                      <div>{Math.round(item.clicks)} clicks</div>
                      <div>{Math.round(item.qrScans)} scans</div>
                    </div>
                    <div
                      className="w-full flex flex-col gap-0.5 transition-all"
                      style={{ height: `${(item.clicks / maxClicks) * 180}px` }}
                    >
                      <div className="w-full bg-gradient-to-t from-violet-600 to-violet-400 rounded-t hover:from-violet-500 hover:to-violet-300 transition-colors flex-1" />
                      {item.qrScans > 0 && (
                        <div
                          className="w-full bg-gradient-to-t from-fuchsia-600 to-fuchsia-400 rounded-b hover:from-fuchsia-500 transition-colors"
                          style={{ height: `${(item.qrScans / item.clicks) * 100}%`, minHeight: "4px" }}
                        />
                      )}
                    </div>
                    <span className="text-xs text-gray-500 mt-2">
                      {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Clicks vs QR */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-6">
                <PieChart className="h-5 w-5 text-violet-400" />
                <h3 className="font-semibold text-white">Clicks vs QR</h3>
              </div>
              <div className="relative h-48 flex items-center justify-center mb-4">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="60" stroke="currentColor" strokeWidth="20" fill="none" className="text-violet-500"
                    strokeDasharray={`${((data.summary.totalClicks - data.summary.qrScans) / data.summary.totalClicks) * 377} ${377}`}
                  />
                  <circle cx="80" cy="80" r="60" stroke="currentColor" strokeWidth="20" fill="none" className="text-fuchsia-500"
                    strokeDasharray={`${(data.summary.qrScans / data.summary.totalClicks) * 377} ${377}`}
                    strokeDashoffset={`${-((data.summary.totalClicks - data.summary.qrScans) / data.summary.totalClicks) * 377}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-white">{data.summary.totalClicks.toLocaleString()}</span>
                  <span className="text-sm text-gray-400">Total</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-violet-500/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-violet-400" />
                    <span className="font-medium text-gray-300">Link Clicks</span>
                  </div>
                  <span className="font-semibold text-white">{(data.summary.totalClicks - data.summary.qrScans).toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-fuchsia-500/10 rounded-xl">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-fuchsia-400" />
                    <span className="font-medium text-gray-300">QR Scans</span>
                  </div>
                  <span className="font-semibold text-white">{data.summary.qrScans.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Heatmap */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-violet-400" />
                <h3 className="font-semibold text-white">Engagement Heatmap</h3>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>Less</span>
                <div className="flex gap-0.5">
                  {["bg-white/5", "bg-violet-500/20", "bg-violet-500/40", "bg-violet-500/60", "bg-violet-500/80", "bg-violet-500"].map((color, i) => (
                    <div key={i} className={`w-4 h-4 rounded ${color}`} />
                  ))}
                </div>
                <span>More</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="flex mb-2">
                  <div className="w-12" />
                  {hours.map((hour) => (
                    <div key={hour} className="flex-1 text-center text-xs text-gray-500">{hour}</div>
                  ))}
                </div>
                {data.heatmap.map((row: number[], dayIndex: number) => (
                  <div key={dayIndex} className="flex items-center mb-1">
                    <div className="w-12 text-xs text-gray-400 font-medium">{days[dayIndex]}</div>
                    <div className="flex-1 flex gap-0.5">
                      {row.map((value: number, hourIndex: number) => (
                        <div
                          key={hourIndex}
                          className={`flex-1 h-6 rounded cursor-pointer hover:ring-2 hover:ring-violet-500 transition-all ${getHeatmapColor(value)}`}
                          title={`${days[dayIndex]} ${hourIndex * 2}:00 - ${value} clicks`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-400 mt-4 text-center">
              Peak engagement: <span className="font-semibold text-white">{data.peakTime.day} at {data.peakTime.hour}:00</span> ({data.peakTime.clicks} clicks)
            </p>
          </div>

          {/* Geographic & Devices */}
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Countries */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Globe className="h-5 w-5 text-violet-400" />
                <h3 className="font-semibold text-white">Top Countries</h3>
              </div>
              <div className="space-y-3">
                {data.countries.slice(0, 6).map((country: any) => (
                  <div key={country.country} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
                    <span className="text-sm font-medium text-gray-400 w-8">{countryFlags[country.country] || "??"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-white truncate">{country.country}</span>
                        <span className="text-sm text-gray-400">{country.count.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" style={{ width: `${country.percentage}%` }} />
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-white w-12 text-right">{country.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Devices */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
              <div className="flex items-center gap-2 mb-6">
                <Smartphone className="h-5 w-5 text-violet-400" />
                <h3 className="font-semibold text-white">Devices</h3>
              </div>
              <div className="space-y-4">
                {data.devices.map((device: any) => {
                  const Icon = deviceIcons[device.device] || Globe;
                  const color = deviceColors[device.device] || "bg-gray-500";
                  return (
                    <div key={device.device}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`h-10 w-10 rounded-xl ${color} bg-opacity-20 flex items-center justify-center`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-white capitalize">{device.device}</span>
                            <p className="text-xs text-gray-400">{device.count.toLocaleString()} clicks</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold text-white">{device.percentage}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${device.percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
