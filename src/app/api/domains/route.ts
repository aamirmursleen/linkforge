import { NextRequest, NextResponse } from "next/server";
import prisma, { isDbConnectionError, getDbErrorMessage } from "@/lib/db";
import {
  isValidDomain,
  normalizeDomain,
  generateVerificationToken,
  getDNSInstructions,
} from "@/lib/domains";

// Helper to get or create default workspace
async function getOrCreateDefaultWorkspace() {
  const defaultSlug = "default";

  let workspace = await prisma.workspace.findUnique({
    where: { slug: defaultSlug },
  });

  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: "My Workspace",
        slug: defaultSlug,
        plan: "free",
        linksLimit: 100,
        qrLimit: 50,
        domainsLimit: 2,
      },
    });
  }

  return workspace;
}

// GET /api/domains - List all domains
export async function GET(request: NextRequest) {
  try {
    // Get or create default workspace
    const workspace = await getOrCreateDefaultWorkspace();

    const domains = await prisma.domain.findMany({
      where: { workspaceId: workspace.id },
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
      limits: {
        used: domains.length,
        total: workspace.domainsLimit,
        plan: workspace.plan,
      },
    });
  } catch (error) {
    console.error("Error fetching domains:", error);
    if (isDbConnectionError(error)) {
      return NextResponse.json({ error: getDbErrorMessage(error) }, { status: 503 });
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

// POST /api/domains - Add a new domain
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain: rawDomain } = body;

    if (!rawDomain) {
      return NextResponse.json(
        { error: "Domain is required" },
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

    // Get or create default workspace
    const workspace = await getOrCreateDefaultWorkspace();

    // Count existing domains
    const domainCount = await prisma.domain.count({
      where: { workspaceId: workspace.id },
    });

    // Check domain limit (free tier = 2 domains)
    if (domainCount >= workspace.domainsLimit) {
      return NextResponse.json(
        {
          error: `Domain limit reached. Free plan allows ${workspace.domainsLimit} custom domains. Upgrade for unlimited domains.`,
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
        workspaceId: workspace.id,
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
    if (isDbConnectionError(error)) {
      return NextResponse.json({ error: getDbErrorMessage(error) }, { status: 503 });
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
