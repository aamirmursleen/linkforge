import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { QR_TEMPLATES } from "@/lib/qr";

// GET /api/qr/templates - List QR templates
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");
    const includeSystem = searchParams.get("includeSystem") !== "false";

    // Get system templates (built-in)
    const systemTemplates = includeSystem
      ? Object.entries(QR_TEMPLATES).map(([key, template]) => ({
          id: `system-${key}`,
          name: template.name,
          description: template.description,
          config: template.config,
          isSystem: true,
          isPublic: true,
        }))
      : [];

    // Get custom templates
    const where: any = {};
    if (workspaceId) {
      where.OR = [
        { workspaceId },
        { isPublic: true },
        { workspaceId: null }, // System templates stored in DB
      ];
    } else {
      where.isPublic = true;
    }

    const customTemplates = await prisma.qRTemplate.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: { select: { qrCodes: true } },
      },
    });

    const templates = [
      ...systemTemplates,
      ...customTemplates.map((t) => ({
        id: t.id,
        name: t.name,
        description: t.description,
        thumbnail: t.thumbnail,
        config: JSON.parse(t.config),
        isSystem: false,
        isPublic: t.isPublic,
        usageCount: t._count.qrCodes,
        createdAt: t.createdAt,
      })),
    ];

    return NextResponse.json({ success: true, data: templates });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/qr/templates - Create custom template
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      workspaceId,
      name,
      description,
      thumbnail,
      config,
      isPublic = false,
    } = body;

    if (!name || !config) {
      return NextResponse.json(
        { error: "Name and config are required" },
        { status: 400 }
      );
    }

    const template = await prisma.qRTemplate.create({
      data: {
        workspaceId: workspaceId || null,
        name,
        description: description || null,
        thumbnail: thumbnail || null,
        config: JSON.stringify(config),
        isPublic,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        id: template.id,
        name: template.name,
        description: template.description,
        config: JSON.parse(template.config),
        isPublic: template.isPublic,
        createdAt: template.createdAt,
      },
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/qr/templates - Delete template
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Template ID required" }, { status: 400 });
    }

    // Can't delete system templates
    if (id.startsWith("system-")) {
      return NextResponse.json(
        { error: "Cannot delete system templates" },
        { status: 400 }
      );
    }

    // Unlink from QR codes
    await prisma.qRCode.updateMany({
      where: { templateId: id },
      data: { templateId: null },
    });

    await prisma.qRTemplate.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Template deleted" });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
