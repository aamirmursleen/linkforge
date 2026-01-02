// ============================================
// QR CODE CONTENT GENERATORS
// ============================================

export interface VCardData {
  firstName: string;
  lastName: string;
  organization?: string;
  title?: string;
  email?: string;
  phone?: string;
  website?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
  };
}

export interface WifiData {
  ssid: string;
  password?: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden?: boolean;
}

export interface SmsData {
  phone: string;
  message?: string;
}

export interface EmailData {
  to: string;
  subject?: string;
  body?: string;
}

// Generate vCard string
export function generateVCard(data: VCardData): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName}`,
  ];

  if (data.organization) lines.push(`ORG:${data.organization}`);
  if (data.title) lines.push(`TITLE:${data.title}`);
  if (data.email) lines.push(`EMAIL:${data.email}`);
  if (data.phone) lines.push(`TEL:${data.phone}`);
  if (data.website) lines.push(`URL:${data.website}`);

  if (data.address) {
    const addr = data.address;
    lines.push(
      `ADR:;;${addr.street || ""};${addr.city || ""};${addr.state || ""};${addr.zip || ""};${addr.country || ""}`
    );
  }

  lines.push("END:VCARD");
  return lines.join("\n");
}

// Generate WiFi config string
export function generateWifiString(data: WifiData): string {
  const hidden = data.hidden ? "H:true" : "";
  const password = data.password ? `P:${data.password}` : "";
  return `WIFI:T:${data.encryption};S:${data.ssid};${password};${hidden};`;
}

// Generate SMS string
export function generateSmsString(data: SmsData): string {
  if (data.message) {
    return `SMSTO:${data.phone}:${data.message}`;
  }
  return `SMSTO:${data.phone}`;
}

// Generate Email string
export function generateEmailString(data: EmailData): string {
  let url = `mailto:${data.to}`;
  const params: string[] = [];

  if (data.subject) params.push(`subject=${encodeURIComponent(data.subject)}`);
  if (data.body) params.push(`body=${encodeURIComponent(data.body)}`);

  if (params.length > 0) {
    url += "?" + params.join("&");
  }

  return url;
}

// ============================================
// QR STYLING OPTIONS
// ============================================

export interface QRStyleOptions {
  // Colors
  foregroundColor: string;
  backgroundColor: string;

  // Dot style
  dotStyle: "square" | "rounded" | "dots" | "classy" | "classy-rounded";

  // Corner square style
  cornerSquareStyle: "square" | "dot" | "extra-rounded";

  // Corner dot style
  cornerDotStyle: "square" | "dot";

  // Logo
  logo?: string; // Base64 or URL
  logoSize?: number; // Percentage (0-40)
  logoPadding?: number;
  logoBackgroundColor?: string;

  // Frame
  frameStyle?: "none" | "bottom" | "top" | "balloon";
  frameText?: string;
  frameColor?: string;
  frameTextColor?: string;

  // Size
  width: number;
  height: number;

  // Error correction
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
}

export const DEFAULT_QR_STYLE: QRStyleOptions = {
  foregroundColor: "#000000",
  backgroundColor: "#FFFFFF",
  dotStyle: "square",
  cornerSquareStyle: "square",
  cornerDotStyle: "square",
  width: 300,
  height: 300,
  errorCorrectionLevel: "M",
};

// ============================================
// QR TEMPLATE PRESETS
// ============================================

export const QR_TEMPLATES = {
  classic: {
    name: "Classic",
    description: "Simple black and white QR code",
    config: {
      foregroundColor: "#000000",
      backgroundColor: "#FFFFFF",
      dotStyle: "square",
      cornerSquareStyle: "square",
      cornerDotStyle: "square",
    },
  },
  rounded: {
    name: "Rounded",
    description: "Soft rounded corners",
    config: {
      foregroundColor: "#1a1a1a",
      backgroundColor: "#FFFFFF",
      dotStyle: "rounded",
      cornerSquareStyle: "extra-rounded",
      cornerDotStyle: "dot",
    },
  },
  dots: {
    name: "Dots",
    description: "Circular dot pattern",
    config: {
      foregroundColor: "#2563eb",
      backgroundColor: "#FFFFFF",
      dotStyle: "dots",
      cornerSquareStyle: "dot",
      cornerDotStyle: "dot",
    },
  },
  classy: {
    name: "Classy",
    description: "Elegant diamond pattern",
    config: {
      foregroundColor: "#7c3aed",
      backgroundColor: "#FFFFFF",
      dotStyle: "classy",
      cornerSquareStyle: "extra-rounded",
      cornerDotStyle: "square",
    },
  },
  gradient: {
    name: "Gradient",
    description: "Modern gradient look",
    config: {
      foregroundColor: "#ec4899",
      backgroundColor: "#fdf2f8",
      dotStyle: "classy-rounded",
      cornerSquareStyle: "dot",
      cornerDotStyle: "dot",
    },
  },
  dark: {
    name: "Dark Mode",
    description: "Inverted dark theme",
    config: {
      foregroundColor: "#FFFFFF",
      backgroundColor: "#1f2937",
      dotStyle: "rounded",
      cornerSquareStyle: "extra-rounded",
      cornerDotStyle: "dot",
    },
  },
};

// ============================================
// QR TYPE DEFINITIONS
// ============================================

export type QRType = "url" | "vcard" | "wifi" | "sms" | "email" | "text";

export interface QRTypeConfig {
  type: QRType;
  label: string;
  description: string;
  icon: string;
  fields: {
    name: string;
    label: string;
    type: "text" | "email" | "tel" | "url" | "textarea" | "select";
    required?: boolean;
    placeholder?: string;
    options?: { value: string; label: string }[];
  }[];
}

export const QR_TYPES: QRTypeConfig[] = [
  {
    type: "url",
    label: "URL",
    description: "Link to any website",
    icon: "link",
    fields: [
      {
        name: "url",
        label: "URL",
        type: "url",
        required: true,
        placeholder: "https://example.com",
      },
    ],
  },
  {
    type: "vcard",
    label: "Contact Card",
    description: "Share contact information",
    icon: "user",
    fields: [
      { name: "firstName", label: "First Name", type: "text", required: true },
      { name: "lastName", label: "Last Name", type: "text", required: true },
      { name: "organization", label: "Organization", type: "text" },
      { name: "title", label: "Job Title", type: "text" },
      { name: "email", label: "Email", type: "email" },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "website", label: "Website", type: "url" },
    ],
  },
  {
    type: "wifi",
    label: "WiFi",
    description: "Share WiFi credentials",
    icon: "wifi",
    fields: [
      { name: "ssid", label: "Network Name (SSID)", type: "text", required: true },
      { name: "password", label: "Password", type: "text" },
      {
        name: "encryption",
        label: "Security",
        type: "select",
        required: true,
        options: [
          { value: "WPA", label: "WPA/WPA2" },
          { value: "WEP", label: "WEP" },
          { value: "nopass", label: "None" },
        ],
      },
    ],
  },
  {
    type: "sms",
    label: "SMS",
    description: "Pre-filled text message",
    icon: "message-square",
    fields: [
      { name: "phone", label: "Phone Number", type: "tel", required: true },
      { name: "message", label: "Message", type: "textarea" },
    ],
  },
  {
    type: "email",
    label: "Email",
    description: "Pre-filled email",
    icon: "mail",
    fields: [
      { name: "to", label: "Email Address", type: "email", required: true },
      { name: "subject", label: "Subject", type: "text" },
      { name: "body", label: "Message", type: "textarea" },
    ],
  },
  {
    type: "text",
    label: "Plain Text",
    description: "Any text content",
    icon: "type",
    fields: [
      { name: "text", label: "Text", type: "textarea", required: true },
    ],
  },
];

// ============================================
// CONTENT GENERATOR
// ============================================

export function generateQRContent(type: QRType, data: Record<string, any>): string {
  switch (type) {
    case "url":
      return data.url;
    case "vcard":
      return generateVCard(data as VCardData);
    case "wifi":
      return generateWifiString(data as WifiData);
    case "sms":
      return generateSmsString(data as SmsData);
    case "email":
      return generateEmailString(data as EmailData);
    case "text":
      return data.text;
    default:
      return data.content || "";
  }
}

// ============================================
// FRAME TEXT PRESETS
// ============================================

export const FRAME_TEXT_PRESETS = [
  "Scan Me",
  "Scan to Connect",
  "Scan for Details",
  "Scan to Download",
  "Scan to Order",
  "Scan for Menu",
  "Scan to Pay",
  "Scan for WiFi",
  "Scan to Follow",
  "Scan to Subscribe",
];
