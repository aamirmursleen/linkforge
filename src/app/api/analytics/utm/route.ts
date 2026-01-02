import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getDateRange } from "@/lib/analytics";

// GET /api/analytics/utm - Get UTM parameter analytics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get("range") || "30d";
    const workspaceId = searchParams.get("workspaceId");

    const { start, end } = getDateRange(range);

    // Get all links with UTM parameters and their clicks
    const where: any = {
      clickedAt: { gte: start, lte: end },
      isBot: false,
    };

    // Get click events with their linked UTM data
    const clickEvents = await prisma.clickEvent.findMany({
      where,
      include: {
        shortLink: {
          select: {
            id: true,
            shortCode: true,
            title: true,
            utmSource: true,
            utmMedium: true,
            utmCampaign: true,
            utmTerm: true,
            utmContent: true,
          },
        },
      },
    });

    // Aggregate by UTM source
    const sourceBreakdown: Record<string, { clicks: number; uniqueIps: Set<string> }> = {};
    const mediumBreakdown: Record<string, { clicks: number; uniqueIps: Set<string> }> = {};
    const campaignBreakdown: Record<string, { clicks: number; uniqueIps: Set<string> }> = {};
    const termBreakdown: Record<string, { clicks: number; uniqueIps: Set<string> }> = {};
    const contentBreakdown: Record<string, { clicks: number; uniqueIps: Set<string> }> = {};

    clickEvents.forEach((event) => {
      const link = event.shortLink;
      const ip = event.ipHash || "unknown";

      // UTM Source
      const source = link.utmSource || "(not set)";
      if (!sourceBreakdown[source]) {
        sourceBreakdown[source] = { clicks: 0, uniqueIps: new Set() };
      }
      sourceBreakdown[source].clicks++;
      sourceBreakdown[source].uniqueIps.add(ip);

      // UTM Medium
      const medium = link.utmMedium || "(not set)";
      if (!mediumBreakdown[medium]) {
        mediumBreakdown[medium] = { clicks: 0, uniqueIps: new Set() };
      }
      mediumBreakdown[medium].clicks++;
      mediumBreakdown[medium].uniqueIps.add(ip);

      // UTM Campaign
      const campaign = link.utmCampaign || "(not set)";
      if (!campaignBreakdown[campaign]) {
        campaignBreakdown[campaign] = { clicks: 0, uniqueIps: new Set() };
      }
      campaignBreakdown[campaign].clicks++;
      campaignBreakdown[campaign].uniqueIps.add(ip);

      // UTM Term
      if (link.utmTerm) {
        if (!termBreakdown[link.utmTerm]) {
          termBreakdown[link.utmTerm] = { clicks: 0, uniqueIps: new Set() };
        }
        termBreakdown[link.utmTerm].clicks++;
        termBreakdown[link.utmTerm].uniqueIps.add(ip);
      }

      // UTM Content
      if (link.utmContent) {
        if (!contentBreakdown[link.utmContent]) {
          contentBreakdown[link.utmContent] = { clicks: 0, uniqueIps: new Set() };
        }
        contentBreakdown[link.utmContent].clicks++;
        contentBreakdown[link.utmContent].uniqueIps.add(ip);
      }
    });

    const totalClicks = clickEvents.length;

    // Format results
    const formatBreakdown = (
      data: Record<string, { clicks: number; uniqueIps: Set<string> }>
    ) =>
      Object.entries(data)
        .map(([name, stats]) => ({
          name,
          clicks: stats.clicks,
          uniqueVisitors: stats.uniqueIps.size,
          percentage: totalClicks > 0 ? Math.round((stats.clicks / totalClicks) * 100) : 0,
        }))
        .sort((a, b) => b.clicks - a.clicks)
        .slice(0, 10);

    // Get campaign performance over time
    const campaignsByDay: Record<string, Record<string, number>> = {};
    clickEvents.forEach((event) => {
      const day = event.clickedAt.toISOString().split("T")[0];
      const campaign = event.shortLink.utmCampaign || "(not set)";

      if (!campaignsByDay[day]) {
        campaignsByDay[day] = {};
      }
      campaignsByDay[day][campaign] = (campaignsByDay[day][campaign] || 0) + 1;
    });

    const campaignTimeline = Object.entries(campaignsByDay)
      .map(([date, campaigns]) => ({
        date,
        ...campaigns,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json({
      success: true,
      data: {
        dateRange: { start: start.toISOString(), end: end.toISOString(), range },
        totalClicks,
        sources: formatBreakdown(sourceBreakdown),
        mediums: formatBreakdown(mediumBreakdown),
        campaigns: formatBreakdown(campaignBreakdown),
        terms: formatBreakdown(termBreakdown),
        contents: formatBreakdown(contentBreakdown),
        campaignTimeline,
      },
    });
  } catch (error) {
    console.error("Error fetching UTM analytics:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
