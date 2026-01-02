import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getDateRange, getSourceCategory } from "@/lib/analytics";

// GET /api/links/[id]/analytics - Get analytics for a specific link
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);

    // Parse query params
    const range = searchParams.get("range") || "30d";
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const includeBots = searchParams.get("includeBots") === "true";

    // Check if link exists
    const link = await prisma.shortLink.findUnique({
      where: { id },
    });

    if (!link) {
      return NextResponse.json(
        { error: "Link not found" },
        { status: 404 }
      );
    }

    // Determine date range
    let startDate: Date;
    let endDate: Date;

    if (fromParam && toParam) {
      startDate = new Date(fromParam);
      endDate = new Date(toParam);
    } else {
      const { start, end } = getDateRange(range);
      startDate = start;
      endDate = end;
    }

    // Base where clause
    const baseWhere: any = {
      shortLinkId: id,
      clickedAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    if (!includeBots) {
      baseWhere.isBot = false;
    }

    // Fetch all click events for aggregation
    const clickEvents = await prisma.clickEvent.findMany({
      where: baseWhere,
      orderBy: { clickedAt: "asc" },
    });

    // Total clicks
    const totalClicks = clickEvents.length;
    const botClicks = clickEvents.filter((e) => e.isBot).length;
    const humanClicks = totalClicks - botClicks;

    // Unique visitors (by IP hash)
    const uniqueIpHashes = new Set(clickEvents.map((e) => e.ipHash).filter(Boolean));
    const uniqueVisitors = uniqueIpHashes.size;

    // Clicks over time (group by day)
    const clicksByDay: Record<string, { clicks: number; uniqueVisitors: Set<string> }> = {};
    clickEvents.forEach((event) => {
      const day = event.clickedAt.toISOString().split("T")[0];
      if (!clicksByDay[day]) {
        clicksByDay[day] = { clicks: 0, uniqueVisitors: new Set() };
      }
      clicksByDay[day].clicks++;
      if (event.ipHash) {
        clicksByDay[day].uniqueVisitors.add(event.ipHash);
      }
    });

    const clicksOverTime = Object.entries(clicksByDay)
      .map(([date, data]) => ({
        date,
        clicks: data.clicks,
        uniqueVisitors: data.uniqueVisitors.size,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Device breakdown
    const deviceCounts: Record<string, number> = {};
    clickEvents.forEach((event) => {
      const device = event.deviceType || "unknown";
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });

    const devices = Object.entries(deviceCounts)
      .map(([device, count]) => ({
        device,
        count,
        percentage: totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Browser breakdown
    const browserCounts: Record<string, number> = {};
    clickEvents.forEach((event) => {
      const browser = event.browser || "Unknown";
      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
    });

    const browsers = Object.entries(browserCounts)
      .map(([browser, count]) => ({
        browser,
        count,
        percentage: totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // OS breakdown
    const osCounts: Record<string, number> = {};
    clickEvents.forEach((event) => {
      const os = event.os || "Unknown";
      osCounts[os] = (osCounts[os] || 0) + 1;
    });

    const operatingSystems = Object.entries(osCounts)
      .map(([os, count]) => ({
        os,
        count,
        percentage: totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Country breakdown
    const countryCounts: Record<string, number> = {};
    clickEvents.forEach((event) => {
      const country = event.country || "Unknown";
      countryCounts[country] = (countryCounts[country] || 0) + 1;
    });

    const countries = Object.entries(countryCounts)
      .map(([country, count]) => ({
        country,
        count,
        percentage: totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Source breakdown
    const sourceCounts: Record<string, number> = {};
    clickEvents.forEach((event) => {
      const source = event.source || "direct";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });

    const sources = Object.entries(sourceCounts)
      .map(([source, count]) => ({
        source,
        category: getSourceCategory(source as any),
        count,
        percentage: totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Source category breakdown (grouped)
    const categoryCounts: Record<string, number> = {};
    sources.forEach((s) => {
      categoryCounts[s.category] = (categoryCounts[s.category] || 0) + s.count;
    });

    const sourceCategories = Object.entries(categoryCounts)
      .map(([category, count]) => ({
        category,
        count,
        percentage: totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count);

    // Top referrers
    const referrerCounts: Record<string, number> = {};
    clickEvents.forEach((event) => {
      const referrer = event.referrerHost || "Direct";
      referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1;
    });

    const referrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({
        referrer,
        count,
        percentage: totalClicks > 0 ? Math.round((count / totalClicks) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Hourly heatmap (day of week x hour of day)
    const heatmap: number[][] = Array(7)
      .fill(null)
      .map(() => Array(24).fill(0));

    clickEvents.forEach((event) => {
      const dayOfWeek = event.clickedAt.getDay(); // 0 = Sunday
      const hour = event.clickedAt.getHours();
      heatmap[dayOfWeek][hour]++;
    });

    // Peak times
    let peakDay = 0;
    let peakHour = 0;
    let peakClicks = 0;
    heatmap.forEach((dayData, day) => {
      dayData.forEach((clicks, hour) => {
        if (clicks > peakClicks) {
          peakClicks = clicks;
          peakDay = day;
          peakHour = hour;
        }
      });
    });

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    return NextResponse.json({
      success: true,
      data: {
        link: {
          id: link.id,
          shortCode: link.shortCode,
          longUrl: link.longUrl,
          title: link.title,
          createdAt: link.createdAt,
        },
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          range,
        },
        summary: {
          totalClicks,
          humanClicks,
          botClicks,
          uniqueVisitors,
        },
        clicksOverTime,
        devices,
        browsers,
        operatingSystems,
        countries,
        sources,
        sourceCategories,
        referrers,
        heatmap,
        peakTime: {
          day: dayNames[peakDay],
          hour: peakHour,
          clicks: peakClicks,
        },
      },
    });

  } catch (error) {
    console.error("Error fetching analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
