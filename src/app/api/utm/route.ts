import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

// GET /api/utm - List UTM presets
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json({ error: "Workspace ID required" }, { status: 400 });
    }

    const presets = await prisma.utmPreset.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ success: true, data: presets });
  } catch (error) {
    console.error("Error fetching UTM presets:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/utm - Create UTM preset
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { workspaceId, name, source, medium, campaign, term, content } = body;

    if (!workspaceId || !name) {
      return NextResponse.json(
        { error: "Workspace ID and name are required" },
        { status: 400 }
      );
    }

    // Check if preset with same name exists
    const existing = await prisma.utmPreset.findUnique({
      where: { workspaceId_name: { workspaceId, name } },
    });

    if (existing) {
      return NextResponse.json(
        { error: "A preset with this name already exists" },
        { status: 409 }
      );
    }

    const preset = await prisma.utmPreset.create({
      data: {
        workspaceId,
        name,
        source: source || null,
        medium: medium || null,
        campaign: campaign || null,
        term: term || null,
        content: content || null,
      },
    });

    return NextResponse.json({ success: true, data: preset }, { status: 201 });
  } catch (error) {
    console.error("Error creating UTM preset:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/utm - Delete UTM preset
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Preset ID required" }, { status: 400 });
    }

    await prisma.utmPreset.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Preset deleted" });
  } catch (error) {
    console.error("Error deleting UTM preset:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
