import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyDomainDNS, getDNSInstructions } from "@/lib/domains";

// Rate limit verification attempts
const verifyRateLimitStore = new Map<string, { count: number; resetAt: number }>();
const VERIFY_RATE_LIMIT = 5; // per 5 minutes
const VERIFY_RATE_WINDOW = 5 * 60 * 1000;

function checkVerifyRateLimit(domainId: string): boolean {
  const now = Date.now();
  const record = verifyRateLimitStore.get(domainId);

  if (!record || record.resetAt < now) {
    verifyRateLimitStore.set(domainId, { count: 1, resetAt: now + VERIFY_RATE_WINDOW });
    return true;
  }

  if (record.count >= VERIFY_RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

// POST /api/domains/[id]/verify - Verify domain DNS
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Rate limit check
    if (!checkVerifyRateLimit(id)) {
      return NextResponse.json(
        {
          error: "Too many verification attempts. Please wait 5 minutes and try again.",
        },
        { status: 429 }
      );
    }

    const domain = await prisma.domain.findUnique({
      where: { id },
    });

    if (!domain) {
      return NextResponse.json(
        { error: "Domain not found" },
        { status: 404 }
      );
    }

    // Already verified
    if (domain.status === "verified") {
      return NextResponse.json({
        success: true,
        data: {
          status: "verified",
          verifiedAt: domain.verifiedAt,
          message: "Domain is already verified",
        },
      });
    }

    // Update status to verifying
    await prisma.domain.update({
      where: { id },
      data: {
        status: "verifying",
        lastCheckAt: new Date(),
        checkAttempts: { increment: 1 },
      },
    });

    // Try CNAME first, then TXT
    let result = await verifyDomainDNS(
      domain.domain,
      domain.verificationToken,
      "cname"
    );

    // If CNAME fails, try TXT
    if (!result.success) {
      result = await verifyDomainDNS(
        domain.domain,
        domain.verificationToken,
        "txt"
      );
    }

    if (result.success) {
      // Verification successful
      const updatedDomain = await prisma.domain.update({
        where: { id },
        data: {
          status: "verified",
          verificationType: result.method || "cname",
          verifiedAt: new Date(),
          sslStatus: "provisioning", // Start SSL provisioning
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          status: "verified",
          verifiedAt: updatedDomain.verifiedAt,
          verificationType: result.method,
          message: "Domain verified successfully! SSL certificate is being provisioned.",
        },
      });
    } else {
      // Verification failed
      await prisma.domain.update({
        where: { id },
        data: {
          status: domain.checkAttempts >= 10 ? "failed" : "pending",
        },
      });

      return NextResponse.json({
        success: false,
        data: {
          status: "pending",
          error: result.error,
          checkAttempts: domain.checkAttempts + 1,
          dnsInstructions: getDNSInstructions(domain.domain, domain.verificationToken),
          message: "DNS verification failed. Please ensure records are configured correctly.",
        },
      });
    }
  } catch (error) {
    console.error("Error verifying domain:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
