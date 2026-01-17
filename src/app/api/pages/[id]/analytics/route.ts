import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");

    // Get page to verify ownership
    const page = await prisma.page.findUnique({
      where: { id },
      include: { workspace: true },
    });

    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    // Calculate date range
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get all views in date range
    const views = await prisma.pageView.findMany({
      where: {
        pageId: id,
        viewedAt: { gte: startDate },
        isBot: false, // Exclude bot traffic
      },
      orderBy: { viewedAt: "asc" },
    });

    // Calculate stats
    const totalViews = views.length;
    const uniqueVisitors = new Set(views.filter(v => v.ipHash).map(v => v.ipHash)).size;

    // Views by day
    const viewsByDay: Record<string, number> = {};
    views.forEach(view => {
      const date = view.viewedAt.toISOString().split("T")[0];
      viewsByDay[date] = (viewsByDay[date] || 0) + 1;
    });

    // Fill in missing days
    const dailyViews = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split("T")[0];
      dailyViews.push({
        date: dateStr,
        views: viewsByDay[dateStr] || 0,
      });
    }

    // Views by device
    const deviceCounts: Record<string, number> = {};
    views.forEach(view => {
      const device = view.deviceType || "unknown";
      deviceCounts[device] = (deviceCounts[device] || 0) + 1;
    });
    const deviceStats = Object.entries(deviceCounts)
      .map(([device, count]) => ({ device, count, percentage: Math.round((count / totalViews) * 100) }))
      .sort((a, b) => b.count - a.count);

    // Views by source
    const sourceCounts: Record<string, number> = {};
    views.forEach(view => {
      const source = view.source || "direct";
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    const sourceStats = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count, percentage: Math.round((count / totalViews) * 100) }))
      .sort((a, b) => b.count - a.count);

    // Views by browser
    const browserCounts: Record<string, number> = {};
    views.forEach(view => {
      const browser = view.browser || "unknown";
      browserCounts[browser] = (browserCounts[browser] || 0) + 1;
    });
    const browserStats = Object.entries(browserCounts)
      .map(([browser, count]) => ({ browser, count, percentage: Math.round((count / totalViews) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Views by OS
    const osCounts: Record<string, number> = {};
    views.forEach(view => {
      const os = view.os || "unknown";
      osCounts[os] = (osCounts[os] || 0) + 1;
    });
    const osStats = Object.entries(osCounts)
      .map(([os, count]) => ({ os, count, percentage: Math.round((count / totalViews) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Top referrers
    const referrerCounts: Record<string, number> = {};
    views.forEach(view => {
      if (view.referrerHost) {
        referrerCounts[view.referrerHost] = (referrerCounts[view.referrerHost] || 0) + 1;
      }
    });
    const topReferrers = Object.entries(referrerCounts)
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Calculate growth
    const midPoint = new Date();
    midPoint.setDate(midPoint.getDate() - Math.floor(days / 2));
    const firstHalf = views.filter(v => v.viewedAt < midPoint).length;
    const secondHalf = views.filter(v => v.viewedAt >= midPoint).length;
    const growth = firstHalf > 0 ? Math.round(((secondHalf - firstHalf) / firstHalf) * 100) : 0;

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalViews,
          uniqueVisitors,
          growth,
          avgViewsPerDay: Math.round(totalViews / days),
        },
        dailyViews,
        deviceStats,
        sourceStats,
        browserStats,
        osStats,
        topReferrers,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 });
  }
}
