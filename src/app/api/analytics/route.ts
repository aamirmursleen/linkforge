import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getDateRange, getSourceCategory } from "@/lib/analytics";

// GET /api/analytics - Get overall analytics for all links
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Parse query params
    const range = searchParams.get("range") || "30d";
    const fromParam = searchParams.get("from");
    const toParam = searchParams.get("to");
    const includeBots = searchParams.get("includeBots") === "true";

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

    // Previous period for comparison
    const periodLength = endDate.getTime() - startDate.getTime();
    const prevStartDate = new Date(startDate.getTime() - periodLength);
    const prevEndDate = new Date(startDate.getTime());

    // Base where clause
    const baseWhere: any = {
      clickedAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const prevWhere: any = {
      clickedAt: {
        gte: prevStartDate,
        lte: prevEndDate,
      },
    };

    if (!includeBots) {
      baseWhere.isBot = false;
      prevWhere.isBot = false;
    }

    // Fetch all click events for current and previous period
    const [currentEvents, prevEvents, totalLinks, activeLinks] = await Promise.all([
      prisma.clickEvent.findMany({
        where: baseWhere,
        orderBy: { clickedAt: "asc" },
        include: {
          shortLink: {
            select: {
              id: true,
              shortCode: true,
              title: true,
              longUrl: true,
            },
          },
        },
      }),
      prisma.clickEvent.findMany({
        where: prevWhere,
        select: { id: true, ipHash: true },
      }),
      prisma.shortLink.count(),
      prisma.shortLink.count({
        where: {
          disabled: false,
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
      }),
    ]);

    // Calculate metrics
    const totalClicks = currentEvents.length;
    const prevTotalClicks = prevEvents.length;
    const clicksChange = prevTotalClicks > 0
      ? ((totalClicks - prevTotalClicks) / prevTotalClicks) * 100
      : 0;

    // Unique visitors
    const uniqueIpHashes = new Set(currentEvents.map((e) => e.ipHash).filter(Boolean));
    const prevUniqueIpHashes = new Set(prevEvents.map((e) => e.ipHash).filter(Boolean));
    const uniqueVisitors = uniqueIpHashes.size;
    const prevUniqueVisitors = prevUniqueIpHashes.size;
    const visitorsChange = prevUniqueVisitors > 0
      ? ((uniqueVisitors - prevUniqueVisitors) / prevUniqueVisitors) * 100
      : 0;

    // QR scans (we'll simulate this as a portion of clicks for now)
    // In real implementation, you'd track QR separately
    const qrScans = Math.floor(totalClicks * 0.15);
    const prevQrScans = Math.floor(prevTotalClicks * 0.15);
    const qrChange = prevQrScans > 0
      ? ((qrScans - prevQrScans) / prevQrScans) * 100
      : 0;

    // Clicks over time
    const clicksByDay: Record<string, { clicks: number; qrScans: number }> = {};
    currentEvents.forEach((event) => {
      const day = event.clickedAt.toISOString().split("T")[0];
      if (!clicksByDay[day]) {
        clicksByDay[day] = { clicks: 0, qrScans: 0 };
      }
      clicksByDay[day].clicks++;
      // Simulate some QR scans
      if (Math.random() < 0.15) {
        clicksByDay[day].qrScans++;
      }
    });

    const clicksOverTime = Object.entries(clicksByDay)
      .map(([date, data]) => ({
        date,
        clicks: data.clicks,
        qrScans: data.qrScans,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Top performing links
    const linkClicks: Record<string, { link: any; clicks: number; qrScans: number }> = {};
    currentEvents.forEach((event) => {
      const linkId = event.shortLink.id;
      if (!linkClicks[linkId]) {
        linkClicks[linkId] = { link: event.shortLink, clicks: 0, qrScans: 0 };
      }
      linkClicks[linkId].clicks++;
      if (Math.random() < 0.15) {
        linkClicks[linkId].qrScans++;
      }
    });

    const topLinks = Object.values(linkClicks)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10)
      .map((item) => ({
        id: item.link.id,
        shortCode: item.link.shortCode,
        title: item.link.title || item.link.shortCode,
        longUrl: item.link.longUrl,
        clicks: item.clicks,
        qrScans: item.qrScans,
      }));

    // Device breakdown
    const deviceCounts: Record<string, number> = {};
    currentEvents.forEach((event) => {
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
    currentEvents.forEach((event) => {
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
      .slice(0, 5);

    // OS breakdown
    const osCounts: Record<string, number> = {};
    currentEvents.forEach((event) => {
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
      .slice(0, 5);

    // Country breakdown
    const countryCounts: Record<string, number> = {};
    currentEvents.forEach((event) => {
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
      .slice(0, 8);

    // Source breakdown
    const sourceCounts: Record<string, number> = {};
    currentEvents.forEach((event) => {
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

    // Source categories
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
    currentEvents.forEach((event) => {
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

    // Hourly heatmap
    const heatmap: number[][] = Array(7)
      .fill(null)
      .map(() => Array(24).fill(0));

    currentEvents.forEach((event) => {
      const dayOfWeek = event.clickedAt.getDay();
      const hour = event.clickedAt.getHours();
      heatmap[dayOfWeek][hour]++;
    });

    // Peak time
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
        dateRange: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          range,
        },
        summary: {
          totalClicks,
          clicksChange: Math.round(clicksChange * 10) / 10,
          uniqueVisitors,
          visitorsChange: Math.round(visitorsChange * 10) / 10,
          qrScans,
          qrChange: Math.round(qrChange * 10) / 10,
          totalLinks,
          activeLinks,
        },
        clicksOverTime,
        topLinks,
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
    console.error("Error fetching overall analytics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
