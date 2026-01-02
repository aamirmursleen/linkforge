import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateShortCode, isValidUrl } from "@/lib/analytics";
import { buildShortUrl } from "@/lib/domains";

interface BulkLinkRow {
  longUrl: string;
  title?: string;
  customCode?: string;
  tags?: string;
  folderId?: string;
}

interface BulkResult {
  row: number;
  success: boolean;
  shortUrl?: string;
  shortCode?: string;
  error?: string;
}

// POST /api/links/bulk - Bulk create links from CSV data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { rows, workspaceId, domainId } = body;

    if (!rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: "Rows array is required" }, { status: 400 });
    }

    if (rows.length > 100) {
      return NextResponse.json(
        { error: "Maximum 100 links per batch" },
        { status: 400 }
      );
    }

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID is required" }, { status: 400 });
    }

    // Check workspace limits
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    const remainingLinks = workspace.linksLimit - workspace.linksUsed;
    if (rows.length > remainingLinks) {
      return NextResponse.json({
        error: `Exceeds plan limit. You can create ${remainingLinks} more links this month.`,
      }, { status: 403 });
    }

    // Validate domain if provided
    let domain = null;
    if (domainId) {
      domain = await prisma.domain.findUnique({ where: { id: domainId } });
      if (!domain || domain.status !== "verified") {
        return NextResponse.json({ error: "Invalid or unverified domain" }, { status: 400 });
      }
    }

    const results: BulkResult[] = [];
    let successCount = 0;
    let errorCount = 0;

    // Process each row
    for (let i = 0; i < rows.length; i++) {
      const row: BulkLinkRow = rows[i];
      const rowNum = i + 1;

      try {
        // Validate URL
        if (!row.longUrl || !isValidUrl(row.longUrl)) {
          results.push({
            row: rowNum,
            success: false,
            error: "Invalid or missing URL",
          });
          errorCount++;
          continue;
        }

        // Generate or validate short code
        let shortCode: string;
        if (row.customCode) {
          if (!/^[a-zA-Z0-9_-]{3,50}$/.test(row.customCode)) {
            results.push({
              row: rowNum,
              success: false,
              error: "Invalid custom code format",
            });
            errorCount++;
            continue;
          }

          const existing = await prisma.shortLink.findFirst({
            where: { shortCode: row.customCode, domainId: domainId || null },
          });

          if (existing) {
            results.push({
              row: rowNum,
              success: false,
              error: "Custom code already exists",
            });
            errorCount++;
            continue;
          }

          shortCode = row.customCode;
        } else {
          let attempts = 0;
          do {
            shortCode = generateShortCode();
            const existing = await prisma.shortLink.findFirst({
              where: { shortCode, domainId: domainId || null },
            });
            if (!existing) break;
            attempts++;
          } while (attempts < 5);

          if (attempts >= 5) {
            results.push({
              row: rowNum,
              success: false,
              error: "Failed to generate unique code",
            });
            errorCount++;
            continue;
          }
        }

        // Create link
        const link = await prisma.shortLink.create({
          data: {
            shortCode,
            longUrl: row.longUrl,
            title: row.title || null,
            workspaceId,
            domainId: domainId || null,
            folderId: row.folderId || null,
            status: "active",
          },
        });

        // Handle tags
        if (row.tags) {
          const tagNames = row.tags.split(",").map((t) => t.trim()).filter(Boolean);
          for (const tagName of tagNames) {
            let tag = await prisma.tag.findFirst({
              where: { workspaceId, name: tagName },
            });
            if (!tag) {
              tag = await prisma.tag.create({
                data: { workspaceId, name: tagName },
              });
            }
            await prisma.linkTag.create({
              data: { linkId: link.id, tagId: tag.id },
            });
          }
        }

        const shortUrl = buildShortUrl(shortCode, domain?.domain);

        results.push({
          row: rowNum,
          success: true,
          shortCode,
          shortUrl,
        });
        successCount++;
      } catch (error: any) {
        results.push({
          row: rowNum,
          success: false,
          error: error.message || "Unknown error",
        });
        errorCount++;
      }
    }

    // Update workspace usage
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { linksUsed: { increment: successCount } },
    });

    return NextResponse.json({
      success: true,
      data: {
        total: rows.length,
        successCount,
        errorCount,
        results,
      },
    });
  } catch (error) {
    console.error("Error in bulk import:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/links/bulk/template - Download CSV template
export async function GET() {
  const template = `long_url,title,custom_code,tags,folder_id
https://example.com/page1,My First Link,custom1,"marketing,social",
https://example.com/page2,My Second Link,,,
https://example.com/page3,Third Link,link3,"promo",`;

  return new NextResponse(template, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": "attachment; filename=linkforge-import-template.csv",
    },
  });
}
