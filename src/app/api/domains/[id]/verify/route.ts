import { NextRequest, NextResponse } from "next/server";
import prisma, { isDbConnectionError, getDbErrorMessage } from "@/lib/db";
import { verifyDomainDNS, getDNSInstructions } from "@/lib/domains";

// POST /api/domains/[id]/verify - Verify domain DNS configuration
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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
          domain: domain.domain,
          status: "verified",
          verifiedAt: domain.verifiedAt,
          message: "Domain is already verified",
        },
      });
    }

    // Check rate limiting for verification attempts
    const maxAttempts = 10;
    if (domain.checkAttempts >= maxAttempts) {
      const lastCheck = domain.lastCheckAt;
      const cooldownPeriod = 60 * 60 * 1000; // 1 hour

      if (lastCheck && Date.now() - lastCheck.getTime() < cooldownPeriod) {
        return NextResponse.json(
          {
            error: "Too many verification attempts. Please wait before trying again.",
            nextAttemptAt: new Date(lastCheck.getTime() + cooldownPeriod),
          },
          { status: 429 }
        );
      }

      // Reset attempts after cooldown
      await prisma.domain.update({
        where: { id },
        data: { checkAttempts: 0 },
      });
    }

    // Update check timestamp
    await prisma.domain.update({
      where: { id },
      data: {
        lastCheckAt: new Date(),
        checkAttempts: { increment: 1 },
      },
    });

    // Verify DNS
    const result = await verifyDomainDNS(
      domain.domain,
      domain.verificationToken,
      domain.verificationType as "cname" | "txt"
    );

    if (result.success) {
      // Update domain as verified
      const updatedDomain = await prisma.domain.update({
        where: { id },
        data: {
          status: "verified",
          verifiedAt: new Date(),
          sslStatus: "active",
        },
      });

      return NextResponse.json({
        success: true,
        data: {
          domain: updatedDomain.domain,
          status: "verified",
          verifiedAt: updatedDomain.verifiedAt,
          method: result.method,
          message: "Domain verified successfully! You can now create short links with this domain.",
        },
      });
    }

    // Verification failed
    const dnsInstructions = getDNSInstructions(domain.domain, domain.verificationToken);

    return NextResponse.json({
      success: false,
      data: {
        domain: domain.domain,
        status: "pending",
        error: result.error,
        dnsInstructions,
        attemptsRemaining: maxAttempts - (domain.checkAttempts + 1),
        message: "DNS verification failed. Please check your DNS configuration.",
      },
    });
  } catch (error) {
    console.error("Error verifying domain:", error);
    if (isDbConnectionError(error)) {
      return NextResponse.json({ error: getDbErrorMessage(error) }, { status: 503 });
    }
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
