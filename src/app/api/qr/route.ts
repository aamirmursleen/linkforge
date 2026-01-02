import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { generateQRContent, QRType } from "@/lib/qr";

// POST /api/qr - Create a new QR code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workspaceId,
      name,
      type = "url",
      data, // Content data based on type
      // Styling
      foregroundColor = "#000000",
      backgroundColor = "#FFFFFF",
      dotStyle = "square",
      cornerStyle = "square",
      // Logo
      logo,
      logoSize = 20,
      logoPadding = 5,
      // Frame
      frameStyle,
      frameText,
      frameColor = "#000000",
      // Template
      templateId,
      // Size
      size = 300,
      format = "png",
      // Link to short URL
      linkId,
    } = body;

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    // Check workspace limits
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
    });

    if (!workspace) {
      return NextResponse.json({ error: "Workspace not found" }, { status: 404 });
    }

    if (workspace.qrUsed >= workspace.qrLimit) {
      return NextResponse.json(
        { error: `QR code limit reached (${workspace.qrLimit}/month)` },
        { status: 403 }
      );
    }

    // Generate content string based on type
    const content = generateQRContent(type as QRType, data);

    if (!content) {
      return NextResponse.json({ error: "Invalid QR content" }, { status: 400 });
    }

    // Apply template if provided
    let styleConfig = {
      foregroundColor,
      backgroundColor,
      dotStyle,
      cornerStyle,
      logo,
      logoSize,
      logoPadding,
      frameStyle,
      frameText,
      frameColor,
    };

    if (templateId) {
      const template = await prisma.qRTemplate.findUnique({
        where: { id: templateId },
      });
      if (template) {
        const templateConfig = JSON.parse(template.config);
        styleConfig = { ...styleConfig, ...templateConfig };
      }
    }

    // Create QR code record
    const qrCode = await prisma.qRCode.create({
      data: {
        workspaceId,
        name: name || `QR Code ${new Date().toLocaleDateString()}`,
        type,
        content,
        foregroundColor: styleConfig.foregroundColor,
        backgroundColor: styleConfig.backgroundColor,
        dotStyle: styleConfig.dotStyle,
        cornerStyle: styleConfig.cornerStyle,
        logo: styleConfig.logo || null,
        logoSize: styleConfig.logoSize,
        logoPadding: styleConfig.logoPadding,
        frameStyle: styleConfig.frameStyle || null,
        frameText: styleConfig.frameText || null,
        frameColor: styleConfig.frameColor,
        templateId: templateId || null,
        size,
        format,
      },
    });

    // Link to short URL if provided
    if (linkId) {
      await prisma.shortLink.update({
        where: { id: linkId },
        data: { qrCodeId: qrCode.id },
      });
    }

    // Update workspace usage
    await prisma.workspace.update({
      where: { id: workspaceId },
      data: { qrUsed: { increment: 1 } },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: qrCode.id,
        name: qrCode.name,
        type: qrCode.type,
        content: qrCode.content,
        style: {
          foregroundColor: qrCode.foregroundColor,
          backgroundColor: qrCode.backgroundColor,
          dotStyle: qrCode.dotStyle,
          cornerStyle: qrCode.cornerStyle,
          logo: qrCode.logo,
          logoSize: qrCode.logoSize,
          frameStyle: qrCode.frameStyle,
          frameText: qrCode.frameText,
        },
        size: qrCode.size,
        format: qrCode.format,
        createdAt: qrCode.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating QR code:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/qr - List QR codes
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const skip = (page - 1) * limit;
    const where: any = { workspaceId };
    if (type) where.type = type;

    const [qrCodes, total] = await Promise.all([
      prisma.qRCode.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          shortLink: {
            select: { id: true, shortCode: true, longUrl: true },
          },
          template: {
            select: { id: true, name: true },
          },
        },
      }),
      prisma.qRCode.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: qrCodes.map((qr) => ({
        id: qr.id,
        name: qr.name,
        type: qr.type,
        content: qr.content,
        style: {
          foregroundColor: qr.foregroundColor,
          backgroundColor: qr.backgroundColor,
          dotStyle: qr.dotStyle,
          cornerStyle: qr.cornerStyle,
          logo: qr.logo,
          logoSize: qr.logoSize,
          frameStyle: qr.frameStyle,
          frameText: qr.frameText,
        },
        size: qr.size,
        format: qr.format,
        scanCount: qr.scanCount,
        lastScannedAt: qr.lastScannedAt,
        shortLink: qr.shortLink,
        template: qr.template,
        createdAt: qr.createdAt,
      })),
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
