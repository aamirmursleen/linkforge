"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// Time range options
const timeRanges = [
  { label: "1h", value: "1h" },
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const hours = ["12a", "2a", "4a", "6a", "8a", "10a", "12p", "2p", "4p", "6p", "8p", "10p"];

// Country flags mapping
const countryFlags: Record<string, string> = {
  US: "🇺🇸", GB: "🇬🇧", DE: "🇩🇪", CA: "🇨🇦", AU: "🇦🇺", FR: "🇫🇷",
  IN: "🇮🇳", BR: "🇧🇷", JP: "🇯🇵", MX: "🇲🇽", Unknown: "🌍",
};

// Device icons
const deviceIcons: Record<string, any> = {
  mobile: Smartphone,
  desktop: Monitor,
  tablet: Tablet,
  bot: Globe,
  unknown: Globe,
};

// Device colors
const deviceColors: Record<string, string> = {
  mobile: "bg-blue-500",
  desktop: "bg-purple-500",
  tablet: "bg-orange-500",
  bot: "bg-gray-500",
  unknown: "bg-gray-400",
};

// Source colors
const sourceColors: Record<string, string> = {
  Social: "bg-pink-500",
  Search: "bg-green-500",
  Direct: "bg-blue-500",
  Email: "bg-purple-500",
  Web: "bg-gray-500",
};

interface AnalyticsData {
  dateRange: {
    start: string;
    end: string;
    range: string;
  };
  summary: {
    totalClicks: number;
    clicksChange: number;
    uniqueVisitors: number;
    visitorsChange: number;
    qrScans: number;
    qrChange: number;
    totalLinks: number;
    activeLinks: number;
  };
  clicksOverTime: Array<{ date: string; clicks: number; qrScans: number }>;
  topLinks: Array<{
    id: string;
    shortCode: string;
    title: string;
    longUrl: string;
    clicks: number;
    qrScans: number;
  }>;
  devices: Array<{ device: string; count: number; percentage: number }>;
  browsers: Array<{ browser: string; count: number; percentage: number }>;
  operatingSystems: Array<{ os: string; count: number; percentage: number }>;
  countries: Array<{ country: string; count: number; percentage: number }>;
  sources: Array<{ source: string; category: string; count: number; percentage: number }>;
  sourceCategories: Array<{ category: string; count: number; percentage: number }>;
  referrers: Array<{ referrer: string; count: number; percentage: number }>;
  heatmap: number[][];
  peakTime: { day: string; hour: number; clicks: number };
}

export default function AnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState("30d");
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchAnalytics = async (range: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`/api/analytics?range=${range}`);
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const result = await response.json();
      setData(result.data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics(selectedRange);
  }, [selectedRange]);

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const getHeatmapColor = (value: number) => {
    if (value === 0) return "bg-gray-100";
    if (value <= 3) return "bg-blue-100";
    if (value <= 6) return "bg-blue-200";
    if (value <= 9) return "bg-blue-300";
    if (value <= 12) return "bg-blue-400";
    return "bg-blue-500";
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  if (loading && !data) {
    return (
      <>
        <AppHeader title="Analytics" />
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
            <p className="text-[var(--muted)]">Loading analytics...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <AppHeader title="Analytics" />
        <div className="flex items-center justify-center h-96">
          <div className="flex flex-col items-center gap-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <p className="text-red-500">{error}</p>
            <Button onClick={() => fetchAnalytics(selectedRange)}>Try Again</Button>
          </div>
        </div>
      </>
    );
  }

  if (!data) return null;

  const maxClicks = Math.max(...data.clicksOverTime.map((d) => d.clicks), 1);

  return (
    <>
      <AppHeader title="Analytics" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Top Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex items-center gap-4">
            {/* Live Indicator */}
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium text-green-700">Live</span>
            </div>

            {/* Last Updated */}
            {lastUpdated && (
              <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                <span>Updated {lastUpdated.toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Selector */}
            <div className="flex items-center bg-[var(--border)]/50 rounded-lg p-1">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => setSelectedRange(range.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    selectedRange === range.value
                      ? "bg-white shadow text-[var(--dark)]"
                      : "text-[var(--muted)] hover:text-[var(--dark)]"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => fetchAnalytics(selectedRange)}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>

            {/* Export Button */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setShowExportMenu(!showExportMenu)}
              >
                <Download className="h-4 w-4" />
                Export
                <ChevronDown className="h-3 w-3" />
              </Button>

              {showExportMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[var(--border)] py-2 z-50">
                  <button className="w-full px-4 py-2 text-left text-sm hover:bg-[var(--border)]/50 flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Export as CSV
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              title: "Total Clicks",
              value: data.summary.totalClicks.toLocaleString(),
              change: data.summary.clicksChange,
              icon: MousePointerClick,
              subValue: `${data.summary.activeLinks} active links`,
            },
            {
              title: "Unique Visitors",
              value: data.summary.uniqueVisitors.toLocaleString(),
              change: data.summary.visitorsChange,
              icon: Users,
              subValue: `${Math.round((data.summary.uniqueVisitors / data.summary.totalClicks) * 100) || 0}% of clicks`,
            },
            {
              title: "QR Scans",
              value: data.summary.qrScans.toLocaleString(),
              change: data.summary.qrChange,
              icon: QrCode,
              subValue: `${Math.round((data.summary.qrScans / data.summary.totalClicks) * 100) || 0}% of total`,
            },
            {
              title: "Total Links",
              value: data.summary.totalLinks.toString(),
              change: 0,
              icon: Link2,
              subValue: `${data.summary.activeLinks} active`,
            },
          ].map((stat) => (
            <Card key={stat.title} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-lg bg-[var(--primary-pale)] flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-[var(--primary)]" />
                  </div>
                  {stat.change !== 0 && (
                    <Badge variant={stat.change >= 0 ? "success" : "destructive"} className="text-xs">
                      {stat.change >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {formatChange(stat.change)}
                    </Badge>
                  )}
                </div>
                <div className="text-3xl font-bold text-[var(--dark)] mb-1">{stat.value}</div>
                <div className="text-sm text-[var(--muted)]">{stat.title}</div>
                <div className="text-xs text-[var(--muted)] mt-2 pt-2 border-t border-[var(--border)]">
                  {stat.subValue}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Clicks Over Time */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Engagement Over Time</CardTitle>
                  <Badge variant="outline" className="text-xs">
                    <Activity className="h-3 w-3 mr-1" />
                    {selectedRange}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-[var(--primary)]" />
                    <span className="text-[var(--muted)]">Clicks</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                    <span className="text-[var(--muted)]">QR Scans</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-72 flex items-end gap-1 p-4 bg-[var(--border)]/20 rounded-lg overflow-x-auto">
                {data.clicksOverTime.slice(-14).map((item, i) => (
                  <div key={i} className="flex-1 min-w-[30px] flex flex-col items-center gap-1 group cursor-pointer">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--dark)] text-white text-xs px-2 py-1 rounded mb-2 whitespace-nowrap z-10">
                      <div>{item.clicks} clicks</div>
                      <div>{item.qrScans} scans</div>
                    </div>
                    <div
                      className="w-full flex flex-col gap-0.5 transition-all"
                      style={{ height: `${(item.clicks / maxClicks) * 200}px` }}
                    >
                      <div
                        className="w-full bg-[var(--primary)] rounded-t hover:bg-[var(--primary-hover)] transition-colors flex-1"
                      />
                      {item.qrScans > 0 && (
                        <div
                          className="w-full bg-purple-500 rounded-b hover:bg-purple-600 transition-colors"
                          style={{ height: `${(item.qrScans / item.clicks) * 100}%`, minHeight: "4px" }}
                        />
                      )}
                    </div>
                    <span className="text-xs text-[var(--muted)] mt-2">
                      {new Date(item.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Clicks vs QR */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-[var(--muted)]" />
                Clicks vs QR
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative h-48 flex items-center justify-center mb-4">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="none"
                    className="text-[var(--primary)]"
                    strokeDasharray={`${((data.summary.totalClicks - data.summary.qrScans) / data.summary.totalClicks) * 377} ${377}`}
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="20"
                    fill="none"
                    className="text-purple-500"
                    strokeDasharray={`${(data.summary.qrScans / data.summary.totalClicks) * 377} ${377}`}
                    strokeDashoffset={`${-((data.summary.totalClicks - data.summary.qrScans) / data.summary.totalClicks) * 377}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-[var(--dark)]">
                    {data.summary.totalClicks.toLocaleString()}
                  </span>
                  <span className="text-sm text-[var(--muted)]">Total</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[var(--primary-pale)]/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Link2 className="h-4 w-4 text-[var(--primary)]" />
                    <span className="font-medium">Link Clicks</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">
                      {(data.summary.totalClicks - data.summary.qrScans).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">QR Scans</span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold">{data.summary.qrScans.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Heatmap */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[var(--muted)]" />
                <CardTitle>Engagement Heatmap</CardTitle>
              </div>
              <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                <span>Less</span>
                <div className="flex gap-0.5">
                  {["bg-gray-100", "bg-blue-100", "bg-blue-200", "bg-blue-300", "bg-blue-400", "bg-blue-500"].map(
                    (color, i) => (
                      <div key={i} className={`w-4 h-4 rounded ${color}`} />
                    )
                  )}
                </div>
                <span>More</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="flex mb-2">
                  <div className="w-12" />
                  {hours.map((hour) => (
                    <div key={hour} className="flex-1 text-center text-xs text-[var(--muted)]">
                      {hour}
                    </div>
                  ))}
                </div>
                {data.heatmap.map((row, dayIndex) => (
                  <div key={dayIndex} className="flex items-center mb-1">
                    <div className="w-12 text-xs text-[var(--muted)] font-medium">{days[dayIndex]}</div>
                    <div className="flex-1 flex gap-0.5">
                      {row.map((value, hourIndex) => (
                        <div
                          key={hourIndex}
                          className={`flex-1 h-6 rounded cursor-pointer hover:ring-2 hover:ring-[var(--primary)] transition-all ${getHeatmapColor(value)}`}
                          title={`${days[dayIndex]} ${hourIndex}:00 - ${value} clicks`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-[var(--muted)] mt-4 text-center">
              Peak engagement: <span className="font-semibold text-[var(--dark)]">{data.peakTime.day} at {data.peakTime.hour}:00</span> ({data.peakTime.clicks} clicks)
            </p>
          </CardContent>
        </Card>

        {/* Geographic & Devices */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Countries */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--muted)]" />
                <CardTitle>Top Countries</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.countries.slice(0, 6).map((country) => (
                  <div key={country.country} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--border)]/30 transition-colors">
                    <span className="text-xl">{countryFlags[country.country] || "🌍"}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium truncate">{country.country}</span>
                        <span className="text-sm text-[var(--muted)]">{country.count.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[var(--primary)] rounded-full"
                          style={{ width: `${country.percentage}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm font-semibold w-12 text-right">{country.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Devices */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-[var(--muted)]" />
                <CardTitle>Devices</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.devices.map((device) => {
                  const Icon = deviceIcons[device.device] || Globe;
                  const color = deviceColors[device.device] || "bg-gray-500";
                  return (
                    <div key={device.device}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`h-8 w-8 rounded-lg ${color} flex items-center justify-center`}>
                            <Icon className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <span className="text-sm font-medium capitalize">{device.device}</span>
                            <p className="text-xs text-[var(--muted)]">{device.count.toLocaleString()} clicks</p>
                          </div>
                        </div>
                        <span className="text-lg font-bold">{device.percentage}%</span>
                      </div>
                      <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                        <div className={`h-full ${color} rounded-full`} style={{ width: `${device.percentage}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Browsers & OS */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Browsers */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Chrome className="h-5 w-5 text-[var(--muted)]" />
                <CardTitle>Browsers</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.browsers.map((browser, index) => (
                  <div key={browser.browser} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{browser.browser}</span>
                        <span className="text-sm text-[var(--muted)]">{browser.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${browser.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Operating Systems */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Laptop className="h-5 w-5 text-[var(--muted)]" />
                <CardTitle>Operating Systems</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.operatingSystems.map((os, index) => (
                  <div key={os.os} className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center">
                      <span className="text-xs font-bold text-white">{os.os.slice(0, 2)}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{os.os}</span>
                        <span className="text-sm text-[var(--muted)]">{os.percentage}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <div className="h-full bg-gray-600 rounded-full" style={{ width: `${os.percentage}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Traffic Sources */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Share2 className="h-5 w-5 text-[var(--muted)]" />
                <CardTitle>Traffic Sources</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.sourceCategories.map((source) => {
                  const color = sourceColors[source.category] || "bg-gray-500";
                  return (
                    <div key={source.category} className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--border)]/30 transition-colors">
                      <div className={`h-10 w-10 rounded-lg ${color} flex items-center justify-center`}>
                        <Share2 className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{source.category}</span>
                          <span className="font-semibold">{source.count.toLocaleString()}</span>
                        </div>
                        <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                          <div className={`h-full ${color} rounded-full`} style={{ width: `${source.percentage}%` }} />
                        </div>
                      </div>
                      <span className="text-lg font-bold w-14 text-right">{source.percentage}%</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top Referrers */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-[var(--muted)]" />
                <CardTitle>Top Referrers</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.referrers.slice(0, 6).map((referrer, index) => (
                  <div key={referrer.referrer} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--border)]/30 transition-colors">
                    <div className="h-8 w-8 rounded-full bg-[var(--primary-pale)] flex items-center justify-center text-sm font-semibold text-[var(--primary)]">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium truncate">{referrer.referrer}</span>
                        <span className="text-sm text-[var(--muted)]">{referrer.count.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-[var(--border)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: `${referrer.percentage}%` }} />
                      </div>
                    </div>
                    <span className="font-semibold w-12 text-right">{referrer.percentage}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Links */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Top Performing Links</CardTitle>
              <Button variant="ghost" size="sm" asChild>
                <a href="/app/links">
                  View all
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.topLinks.map((link, index) => (
                <div
                  key={link.id}
                  className="p-4 rounded-xl border border-[var(--border)] hover:border-[var(--primary)] hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 rounded-xl bg-[var(--primary-pale)] flex items-center justify-center text-lg font-bold text-[var(--primary)] group-hover:scale-110 transition-transform">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-[var(--dark)] mb-1">{link.title}</div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[var(--primary)]">/r/{link.shortCode}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyLink(`${window.location.origin}/r/${link.shortCode}`);
                            }}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copiedLink === `${window.location.origin}/r/${link.shortCode}` ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4 text-[var(--muted)] hover:text-[var(--dark)]" />
                            )}
                          </button>
                        </div>
                        <div className="text-xs text-[var(--muted)] mt-1 truncate max-w-[300px]">{link.longUrl}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div>
                          <div className="text-xs text-[var(--muted)] mb-1">Clicks</div>
                          <div className="font-bold text-lg">{link.clicks.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-xs text-[var(--muted)] mb-1">QR Scans</div>
                          <div className="font-bold text-lg text-purple-600">{link.qrScans.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
