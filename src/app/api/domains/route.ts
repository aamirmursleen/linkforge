import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  isValidDomain,
  normalizeDomain,
  generateVerificationToken,
  getDNSInstructions,
} from "@/lib/domains";

// GET /api/domains - List all domains for workspace
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const workspaceId = searchParams.get("workspaceId");

    if (!workspaceId) {
      return NextResponse.json(
        { error: "Workspace ID is required" },
        { status: 400 }
      );
    }

    const domains = await prisma.domain.findMany({
      where: { workspaceId },
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { shortLinks: true },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: domains.map((domain) => ({
        id: domain.id,
        domain: domain.domain,
        status: domain.status,
        verificationType: domain.verificationType,
        verifiedAt: domain.verifiedAt,
        sslStatus: domain.sslStatus,
        isDefault: domain.isDefault,
        linksCount: domain._count.shortLinks,
        createdAt: domain.createdAt,
        dnsInstructions: getDNSInstructions(domain.domain, domain.verificationToken),
      })),
    });
  } catch (error) {
    console.error("Error fetching domains:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/domains - Add a new domain
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain: rawDomain, workspaceId } = body;

    if (!rawDomain || !workspaceId) {
      return NextResponse.json(
        { error: "Domain and workspace ID are required" },
        { status: 400 }
      );
    }

    // Normalize domain
    const domain = normalizeDomain(rawDomain);

    // Validate domain format
    const validation = isValidDomain(domain);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Check workspace exists and domain limits
    const workspace = await prisma.workspace.findUnique({
      where: { id: workspaceId },
      include: {
        _count: {
          select: { domains: true },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(
        { error: "Workspace not found" },
        { status: 404 }
      );
    }

    // Check domain limit
    if (workspace._count.domains >= workspace.domainsLimit) {
      return NextResponse.json(
        {
          error: `Domain limit reached. Your plan allows ${workspace.domainsLimit} custom domains. Please upgrade to add more.`,
        },
        { status: 403 }
      );
    }

    // Check if domain already exists
    const existingDomain = await prisma.domain.findUnique({
      where: { domain },
    });

    if (existingDomain) {
      return NextResponse.json(
        { error: "This domain is already registered" },
        { status: 409 }
      );
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();

    // Create domain
    const newDomain = await prisma.domain.create({
      data: {
        workspaceId,
        domain,
        verificationToken,
        status: "pending",
        verificationType: "cname",
      },
    });

    // Get DNS instructions
    const dnsInstructions = getDNSInstructions(domain, verificationToken);

    return NextResponse.json(
      {
        success: true,
        data: {
          id: newDomain.id,
          domain: newDomain.domain,
          status: newDomain.status,
          dnsInstructions,
          message: "Domain added. Please configure DNS records to verify ownership.",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating domain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
