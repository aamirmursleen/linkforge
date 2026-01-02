import { createHash, randomBytes } from "crypto";
import dns from "dns";
import { promisify } from "util";

const resolveCname = promisify(dns.resolveCname);
const resolveTxt = promisify(dns.resolveTxt);

// ============================================
// DOMAIN VALIDATION
// ============================================

const RESERVED_DOMAINS = [
  "localhost",
  "linkforge.com",
  "linkforge.io",
  "lnk.fg",
  "bit.ly",
  "bitly.com",
];

const DOMAIN_REGEX = /^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

export function isValidDomain(domain: string): { valid: boolean; error?: string } {
  // Normalize domain
  const normalized = domain.toLowerCase().trim();

  // Check basic format
  if (!DOMAIN_REGEX.test(normalized)) {
    return { valid: false, error: "Invalid domain format" };
  }

  // Check length
  if (normalized.length > 253) {
    return { valid: false, error: "Domain name too long" };
  }

  // Check reserved domains
  for (const reserved of RESERVED_DOMAINS) {
    if (normalized === reserved || normalized.endsWith(`.${reserved}`)) {
      return { valid: false, error: "This domain is reserved" };
    }
  }

  return { valid: true };
}

export function normalizeDomain(domain: string): string {
  return domain.toLowerCase().trim().replace(/^(https?:\/\/)/, "").replace(/\/$/, "");
}

// ============================================
// VERIFICATION TOKEN GENERATION
// ============================================

export function generateVerificationToken(): string {
  return `linkforge-verify-${randomBytes(16).toString("hex")}`;
}

// ============================================
// DNS VERIFICATION
// ============================================

export interface VerificationResult {
  success: boolean;
  method: "cname" | "txt" | null;
  error?: string;
}

const CNAME_TARGET = process.env.CNAME_TARGET || "cname.linkforge.com";
const TXT_PREFIX = "linkforge-verification=";

export async function verifyDomainDNS(
  domain: string,
  verificationToken: string,
  method: "cname" | "txt" = "cname"
): Promise<VerificationResult> {
  try {
    if (method === "cname") {
      return await verifyCNAME(domain);
    } else {
      return await verifyTXT(domain, verificationToken);
    }
  } catch (error: any) {
    // DNS errors
    if (error.code === "ENODATA" || error.code === "ENOTFOUND") {
      return {
        success: false,
        method: null,
        error: "DNS record not found. Please add the required DNS record and try again.",
      };
    }
    if (error.code === "ETIMEOUT") {
      return {
        success: false,
        method: null,
        error: "DNS lookup timed out. Please try again.",
      };
    }
    return {
      success: false,
      method: null,
      error: `DNS verification failed: ${error.message}`,
    };
  }
}

async function verifyCNAME(domain: string): Promise<VerificationResult> {
  try {
    const records = await resolveCname(domain);
    const hasValidCname = records.some(
      (record) => record.toLowerCase() === CNAME_TARGET.toLowerCase()
    );

    if (hasValidCname) {
      return { success: true, method: "cname" };
    }

    return {
      success: false,
      method: "cname",
      error: `CNAME record found but points to "${records[0]}" instead of "${CNAME_TARGET}"`,
    };
  } catch (error: any) {
    throw error;
  }
}

async function verifyTXT(domain: string, token: string): Promise<VerificationResult> {
  try {
    // Check _linkforge subdomain for TXT record
    const txtDomain = `_linkforge.${domain}`;
    const records = await resolveTxt(txtDomain);
    const flatRecords = records.flat();

    const expectedValue = `${TXT_PREFIX}${token}`;
    const hasValidTxt = flatRecords.some((record) => record === expectedValue);

    if (hasValidTxt) {
      return { success: true, method: "txt" };
    }

    return {
      success: false,
      method: "txt",
      error: "TXT record found but value does not match verification token",
    };
  } catch (error: any) {
    throw error;
  }
}

// ============================================
// DNS INSTRUCTIONS
// ============================================

export interface DNSInstructions {
  cname: {
    host: string;
    type: "CNAME";
    value: string;
  };
  txt: {
    host: string;
    type: "TXT";
    value: string;
  };
}

export function getDNSInstructions(domain: string, verificationToken: string): DNSInstructions {
  return {
    cname: {
      host: domain,
      type: "CNAME",
      value: CNAME_TARGET,
    },
    txt: {
      host: `_linkforge.${domain}`,
      type: "TXT",
      value: `${TXT_PREFIX}${verificationToken}`,
    },
  };
}

// ============================================
// DOMAIN URL BUILDER
// ============================================

export function buildShortUrl(
  shortCode: string,
  customDomain?: string | null
): string {
  if (customDomain) {
    return `https://${customDomain}/${shortCode}`;
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${baseUrl}/r/${shortCode}`;
}
