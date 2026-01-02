import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getDNSInstructions } from "@/lib/domains";

// GET /api/domains/[id] - Get single domain details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const domain = await prisma.domain.findUnique({
      where: { id },
      include: {
        _count: {
          select: { shortLinks: true },
        },
      },
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: domain.id,
        domain: domain.domain,
        status: domain.status,
        verificationType: domain.verificationType,
        verifiedAt: domain.verifiedAt,
        lastCheckAt: domain.lastCheckAt,
        checkAttempts: domain.checkAttempts,
        sslStatus: domain.sslStatus,
        sslExpiresAt: domain.sslExpiresAt,
        isDefault: domain.isDefault,
        notFoundUrl: domain.notFoundUrl,
        linksCount: domain._count.shortLinks,
        createdAt: domain.createdAt,
        dnsInstructions: getDNSInstructions(domain.domain, domain.verificationToken),
      },
    });
  } catch (error) {
    console.error("Error fetching domain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH /api/domains/[id] - Update domain settings
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { isDefault, notFoundUrl } = body;

    const domain = await prisma.domain.findUnique({
      where: { id },
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    // If setting as default, must be verified
    if (isDefault && domain.status !== "verified") {
      return NextResponse.json(
        { error: "Only verified domains can be set as default" },
        { status: 400 }
      );
    }

    // If setting as default, unset other defaults in workspace
    if (isDefault) {
      await prisma.domain.updateMany({
        where: {
          workspaceId: domain.workspaceId,
          id: { not: id },
        },
        data: { isDefault: false },
      });
    }

    const updatedDomain = await prisma.domain.update({
      where: { id },
      data: {
        ...(isDefault !== undefined && { isDefault }),
        ...(notFoundUrl !== undefined && { notFoundUrl }),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedDomain,
    });
  } catch (error) {
    console.error("Error updating domain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE /api/domains/[id] - Delete domain
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const force = searchParams.get("force") === "true";

    const domain = await prisma.domain.findUnique({
      where: { id },
      include: {
        _count: {
          select: { shortLinks: true },
        },
      },
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    // Check if domain has active links
    if (domain._count.shortLinks > 0 && !force) {
      return NextResponse.json(
        {
          error: `This domain has ${domain._count.shortLinks} active links. Use force=true to delete anyway (links will be reassigned to default domain).`,
          linksCount: domain._count.shortLinks,
          requiresForce: true,
        },
        { status: 400 }
      );
    }

    // If force delete, reassign links to null (default domain)
    if (domain._count.shortLinks > 0) {
      await prisma.shortLink.updateMany({
        where: { domainId: id },
        data: { domainId: null },
      });
    }

    // Delete domain
    await prisma.domain.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "Domain deleted successfully",
      reassignedLinks: domain._count.shortLinks,
    });
  } catch (error) {
    console.error("Error deleting domain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
