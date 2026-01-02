import { createHash } from "crypto";
import { UAParser } from "ua-parser-js";

// ============================================
// MOBILE DETECTION
// ============================================

export interface DeviceInfo {
  type: "mobile" | "tablet" | "desktop" | "unknown";
  os: "ios" | "android" | "windows" | "macos" | "linux" | "unknown";
  browser: string | null;
}

export function detectDevice(userAgent: string | null): DeviceInfo {
  if (!userAgent) {
    return { type: "unknown", os: "unknown", browser: null };
  }

  const parser = new UAParser(userAgent);
  const result = parser.getResult();

  // Determine device type
  let type: DeviceInfo["type"] = "desktop";
  if (result.device.type === "mobile") {
    type = "mobile";
  } else if (result.device.type === "tablet") {
    type = "tablet";
  }

  // Determine OS
  let os: DeviceInfo["os"] = "unknown";
  const osName = result.os.name?.toLowerCase() || "";
  if (osName.includes("ios")) {
    os = "ios";
  } else if (osName.includes("android")) {
    os = "android";
  } else if (osName.includes("windows")) {
    os = "windows";
  } else if (osName.includes("mac")) {
    os = "macos";
  } else if (osName.includes("linux")) {
    os = "linux";
  }

  return {
    type,
    os,
    browser: result.browser.name || null,
  };
}

// ============================================
// DEEP LINK ROUTING
// ============================================

export interface DeepLinkConfig {
  iosScheme?: string | null;
  iosAppStore?: string | null;
  androidScheme?: string | null;
  androidPlay?: string | null;
}

export function getDeepLinkUrl(
  device: DeviceInfo,
  config: DeepLinkConfig,
  fallbackUrl: string
): string {
  // iOS device
  if (device.os === "ios") {
    if (config.iosScheme) {
      // Return app scheme - browser will fallback if app not installed
      return config.iosScheme;
    }
    if (config.iosAppStore) {
      return config.iosAppStore;
    }
  }

  // Android device
  if (device.os === "android") {
    if (config.androidScheme) {
      return config.androidScheme;
    }
    if (config.androidPlay) {
      return config.androidPlay;
    }
  }

  return fallbackUrl;
}

// ============================================
// URL WITH UTM PARAMETERS
// ============================================

export interface UTMParams {
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmTerm?: string | null;
  utmContent?: string | null;
}

export function appendUTMParams(url: string, params: UTMParams): string {
  try {
    const urlObj = new URL(url);

    if (params.utmSource && !urlObj.searchParams.has("utm_source")) {
      urlObj.searchParams.set("utm_source", params.utmSource);
    }
    if (params.utmMedium && !urlObj.searchParams.has("utm_medium")) {
      urlObj.searchParams.set("utm_medium", params.utmMedium);
    }
    if (params.utmCampaign && !urlObj.searchParams.has("utm_campaign")) {
      urlObj.searchParams.set("utm_campaign", params.utmCampaign);
    }
    if (params.utmTerm && !urlObj.searchParams.has("utm_term")) {
      urlObj.searchParams.set("utm_term", params.utmTerm);
    }
    if (params.utmContent && !urlObj.searchParams.has("utm_content")) {
      urlObj.searchParams.set("utm_content", params.utmContent);
    }

    return urlObj.toString();
  } catch {
    return url;
  }
}

// ============================================
// LINK STATUS CHECKS
// ============================================

export type LinkStatus =
  | "active"
  | "scheduled"
  | "expired"
  | "disabled"
  | "password_required";

export interface LinkStatusResult {
  status: LinkStatus;
  canAccess: boolean;
  message?: string;
}

export function checkLinkStatus(link: {
  disabled: boolean;
  status: string;
  startsAt: Date | null;
  expiresAt: Date | null;
  password: string | null;
}): LinkStatusResult {
  const now = new Date();

  // Check if disabled
  if (link.disabled) {
    return {
      status: "disabled",
      canAccess: false,
      message: "This link has been disabled",
    };
  }

  // Check if scheduled (not yet active)
  if (link.startsAt && link.startsAt > now) {
    return {
      status: "scheduled",
      canAccess: false,
      message: "This link is not active yet",
    };
  }

  // Check if expired
  if (link.expiresAt && link.expiresAt < now) {
    return {
      status: "expired",
      canAccess: false,
      message: "This link has expired",
    };
  }

  // Check if password protected
  if (link.password) {
    return {
      status: "password_required",
      canAccess: false,
      message: "This link is password protected",
    };
  }

  return {
    status: "active",
    canAccess: true,
  };
}

// ============================================
// PASSWORD VERIFICATION
// ============================================

export function hashPassword(password: string): string {
  const salt = process.env.LINK_PASSWORD_SALT || "linkforge-password-salt";
  return createHash("sha256")
    .update(password + salt)
    .digest("hex");
}

export function verifyPassword(inputPassword: string, hashedPassword: string): boolean {
  const inputHash = hashPassword(inputPassword);
  return inputHash === hashedPassword;
}

// Password attempt tracking for rate limiting
const passwordAttempts = new Map<string, { count: number; lockedUntil: number }>();
const MAX_PASSWORD_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function checkPasswordAttempts(linkId: string): { allowed: boolean; remainingAttempts: number } {
  const now = Date.now();
  const record = passwordAttempts.get(linkId);

  if (!record) {
    return { allowed: true, remainingAttempts: MAX_PASSWORD_ATTEMPTS };
  }

  // Check if locked out
  if (record.lockedUntil > now) {
    return { allowed: false, remainingAttempts: 0 };
  }

  // Reset if lockout expired
  if (record.lockedUntil <= now && record.count >= MAX_PASSWORD_ATTEMPTS) {
    passwordAttempts.delete(linkId);
    return { allowed: true, remainingAttempts: MAX_PASSWORD_ATTEMPTS };
  }

  return {
    allowed: record.count < MAX_PASSWORD_ATTEMPTS,
    remainingAttempts: MAX_PASSWORD_ATTEMPTS - record.count,
  };
}

export function recordPasswordAttempt(linkId: string, success: boolean): void {
  if (success) {
    passwordAttempts.delete(linkId);
    return;
  }

  const record = passwordAttempts.get(linkId) || { count: 0, lockedUntil: 0 };
  record.count++;

  if (record.count >= MAX_PASSWORD_ATTEMPTS) {
    record.lockedUntil = Date.now() + LOCKOUT_DURATION;
  }

  passwordAttempts.set(linkId, record);
}

// ============================================
// COOKIE HELPERS FOR PASSWORD SESSIONS
// ============================================

export function generatePasswordSessionToken(linkId: string): string {
  const secret = process.env.PASSWORD_SESSION_SECRET || "default-session-secret";
  const timestamp = Date.now();
  const data = `${linkId}:${timestamp}`;
  const signature = createHash("sha256")
    .update(data + secret)
    .digest("hex")
    .substring(0, 16);
  return Buffer.from(`${data}:${signature}`).toString("base64");
}

export function verifyPasswordSessionToken(token: string, linkId: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const [storedLinkId, timestamp, signature] = decoded.split(":");

    if (storedLinkId !== linkId) {
      return false;
    }

    // Token expires after 1 hour
    const age = Date.now() - parseInt(timestamp, 10);
    if (age > 60 * 60 * 1000) {
      return false;
    }

    // Verify signature
    const secret = process.env.PASSWORD_SESSION_SECRET || "default-session-secret";
    const expectedSignature = createHash("sha256")
      .update(`${storedLinkId}:${timestamp}` + secret)
      .digest("hex")
      .substring(0, 16);

    return signature === expectedSignature;
  } catch {
    return false;
  }
}
