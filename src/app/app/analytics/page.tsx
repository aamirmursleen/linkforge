import { AppHeader } from "@/components/app/app-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  { title: "Total Clicks", value: "124,589", change: "+12.5%", trend: "up" },
  { title: "Unique Visitors", value: "89,234", change: "+8.2%", trend: "up" },
  { title: "Avg. CTR", value: "4.2%", change: "+0.3%", trend: "up" },
  { title: "Bounce Rate", value: "32.1%", change: "-2.4%", trend: "down" },
];

const topLinks = [
  { title: "Summer Sale", url: "lnk.fg/summer", clicks: 12843, change: "+24%" },
  { title: "Product Launch", url: "lnk.fg/launch", clicks: 8921, change: "+18%" },
  { title: "Newsletter", url: "lnk.fg/news", clicks: 5672, change: "+5%" },
  { title: "Social Bio", url: "lnk.fg/bio", clicks: 4231, change: "+12%" },
  { title: "Webinar", url: "lnk.fg/webinar", clicks: 2341, change: "-3%" },
];

const topCountries = [
  { country: "United States", clicks: 45234, percentage: 36 },
  { country: "United Kingdom", clicks: 23456, percentage: 19 },
  { country: "Germany", clicks: 15678, percentage: 13 },
  { country: "Canada", clicks: 12345, percentage: 10 },
  { country: "Australia", clicks: 8901, percentage: 7 },
];

const devices = [
  { device: "Mobile", percentage: 58, icon: Smartphone },
  { device: "Desktop", percentage: 38, icon: Monitor },
  { device: "Tablet", percentage: 4, icon: Monitor },
];

export default function AnalyticsPage() {
  return (
    <>
      <AppHeader title="Analytics" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[var(--muted)]">{stat.title}</span>
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
                <div className="text-3xl font-bold text-[var(--dark)]">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Clicks Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Clicks Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-[var(--border)]/30 rounded-lg flex items-end justify-around p-4">
                {[45, 62, 38, 75, 52, 88, 65, 72, 48, 82, 55, 90].map((height, i) => (
                  <div
                    key={i}
                    className="w-6 bg-[var(--primary)] rounded-t hover:bg-[var(--primary-hover)] transition-colors cursor-pointer"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-around mt-2 text-xs text-[var(--muted)]">
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Countries */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-[var(--muted)]" />
                <CardTitle>Top Countries</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCountries.map((country) => (
                  <div key={country.country}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{country.country}</span>
                      <span className="text-sm text-[var(--muted)]">
                        {country.clicks.toLocaleString()} ({country.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary)] rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bottom Row */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Top Links */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Performing Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topLinks.map((link, index) => (
                  <div
                    key={link.url}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--border)]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[var(--primary-pale)] flex items-center justify-center text-sm font-semibold text-[var(--primary)]">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{link.title}</div>
                        <div className="text-sm text-[var(--primary)]">{link.url}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{link.clicks.toLocaleString()}</div>
                      <div
                        className={`text-xs ${
                          link.change.startsWith("+")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {link.change}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Devices */}
          <Card>
            <CardHeader>
              <CardTitle>Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {devices.map((device) => (
                  <div key={device.device}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <device.icon className="h-4 w-4 text-[var(--muted)]" />
                        <span className="text-sm font-medium">{device.device}</span>
                      </div>
                      <span className="text-sm font-semibold">{device.percentage}%</span>
                    </div>
                    <div className="h-3 bg-[var(--border)] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[var(--primary)] rounded-full transition-all"
                        style={{ width: `${device.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
