import { z } from "zod";
import { prisma } from "@/lib/db";
import { ALLOWED_TOOLS, AI_CONFIG } from "./config";

// Tool definitions with schemas
export const toolSchemas = {
  create_support_ticket: z.object({
    subject: z.string().min(5).max(200),
    description: z.string().min(10).max(2000),
    priority: z.enum(["low", "medium", "high"]).default("medium"),
  }),

  create_link: z.object({
    url: z.string().url(),
    title: z.string().max(100).optional(),
    customAlias: z.string().max(50).optional(),
  }),

  get_link_analytics: z.object({
    linkId: z.string().optional(),
    timeRange: z.enum(["1h", "24h", "7d", "30d", "90d"]).default("7d"),
  }),

  generate_qr_code: z.object({
    content: z.string().max(2000),
    type: z.enum(["url", "text", "wifi", "contact"]).default("url"),
  }),

  navigate_to_page: z.object({
    page: z.enum([
      "dashboard",
      "links",
      "qr-codes",
      "analytics",
      "bio-pages",
      "utm-builder",
      "settings",
      "help",
    ]),
  }),

  get_account_info: z.object({
    infoType: z.enum(["plan", "usage", "limits"]).default("usage"),
  }),
};

export type ToolName = keyof typeof toolSchemas;

export interface ToolResult {
  success: boolean;
  data?: unknown;
  message: string;
  actionRequired?: string;
}

export interface ToolDefinition {
  name: ToolName;
  description: string;
  parameters: z.ZodObject<any>;
  requiresAuth: boolean;
  requiresConfirmation: boolean;
  rateLimit: number;
}

export const toolDefinitions: ToolDefinition[] = [
  {
    name: "create_support_ticket",
    description: "Create a support ticket for the user when they need help with an issue",
    parameters: toolSchemas.create_support_ticket,
    requiresAuth: false,
    requiresConfirmation: false,
    rateLimit: 5,
  },
  {
    name: "create_link",
    description: "Create a new short link for the user",
    parameters: toolSchemas.create_link,
    requiresAuth: true,
    requiresConfirmation: false,
    rateLimit: 20,
  },
  {
    name: "get_link_analytics",
    description: "Get analytics data for user's links",
    parameters: toolSchemas.get_link_analytics,
    requiresAuth: true,
    requiresConfirmation: false,
    rateLimit: 30,
  },
  {
    name: "generate_qr_code",
    description: "Generate a QR code for the user",
    parameters: toolSchemas.generate_qr_code,
    requiresAuth: false,
    requiresConfirmation: false,
    rateLimit: 10,
  },
  {
    name: "navigate_to_page",
    description: "Navigate user to a specific page in the app",
    parameters: toolSchemas.navigate_to_page,
    requiresAuth: false,
    requiresConfirmation: false,
    rateLimit: 100,
  },
  {
    name: "get_account_info",
    description: "Get information about user's account, plan, or usage",
    parameters: toolSchemas.get_account_info,
    requiresAuth: true,
    requiresConfirmation: false,
    rateLimit: 30,
  },
];

// Tool execution functions
async function executeCreateSupportTicket(
  params: z.infer<typeof toolSchemas.create_support_ticket>
): Promise<ToolResult> {
  // TODO: Integrate with actual ticketing system
  return {
    success: true,
    message: `Support ticket created successfully! Our team will respond to "${params.subject}" within 24 hours.`,
    data: {
      ticketId: `TKT-${Date.now().toString(36).toUpperCase()}`,
      subject: params.subject,
      priority: params.priority,
    },
  };
}

async function executeCreateLink(
  params: z.infer<typeof toolSchemas.create_link>,
  userId?: string
): Promise<ToolResult> {
  if (!userId) {
    return {
      success: false,
      message: "You need to be logged in to create links. Would you like me to help you sign in?",
      actionRequired: "login",
    };
  }

  // Generate short code
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let shortCode = params.customAlias || "";
  if (!shortCode) {
    for (let i = 0; i < 7; i++) {
      shortCode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }

  try {
    const link = await prisma.shortLink.create({
      data: {
        shortCode,
        longUrl: params.url,
        title: params.title,
        userId,
      },
    });

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    return {
      success: true,
      message: `Link created successfully! Your short link is: ${appUrl}/r/${shortCode}`,
      data: {
        shortCode,
        shortUrl: `${appUrl}/r/${shortCode}`,
        originalUrl: params.url,
      },
    };
  } catch (error: any) {
    if (error.code === "P2002") {
      return {
        success: false,
        message: "That custom alias is already taken. Please try a different one.",
      };
    }
    return {
      success: false,
      message: "Failed to create link. Please try again.",
    };
  }
}

async function executeGetLinkAnalytics(
  params: z.infer<typeof toolSchemas.get_link_analytics>,
  userId?: string
): Promise<ToolResult> {
  if (!userId) {
    return {
      success: false,
      message: "You need to be logged in to view analytics.",
      actionRequired: "login",
    };
  }

  const timeRangeHours: Record<string, number> = {
    "1h": 1,
    "24h": 24,
    "7d": 168,
    "30d": 720,
    "90d": 2160,
  };

  const hours = timeRangeHours[params.timeRange];
  const since = new Date(Date.now() - hours * 60 * 60 * 1000);

  const stats = await prisma.clickEvent.aggregate({
    where: {
      shortLink: { userId },
      clickedAt: { gte: since },
    },
    _count: true,
  });

  const linkCount = await prisma.shortLink.count({
    where: { userId },
  });

  return {
    success: true,
    message: `In the last ${params.timeRange}, you had ${stats._count} clicks across ${linkCount} links.`,
    data: {
      totalClicks: stats._count,
      totalLinks: linkCount,
      timeRange: params.timeRange,
    },
  };
}

async function executeGenerateQrCode(
  params: z.infer<typeof toolSchemas.generate_qr_code>
): Promise<ToolResult> {
  return {
    success: true,
    message: `I'll help you create a ${params.type} QR code. Let me open the QR code generator for you.`,
    data: {
      type: params.type,
      content: params.content,
    },
    actionRequired: "navigate",
  };
}

async function executeNavigateToPage(
  params: z.infer<typeof toolSchemas.navigate_to_page>
): Promise<ToolResult> {
  const pageUrls: Record<string, string> = {
    dashboard: "/app",
    links: "/app/links",
    "qr-codes": "/app/qr",
    analytics: "/app/analytics",
    "bio-pages": "/app/pages",
    "utm-builder": "/app/utm-builder",
    settings: "/app/settings",
    help: "/features",
  };

  return {
    success: true,
    message: `I'll take you to the ${params.page} page.`,
    data: {
      url: pageUrls[params.page],
      page: params.page,
    },
    actionRequired: "navigate",
  };
}

async function executeGetAccountInfo(
  params: z.infer<typeof toolSchemas.get_account_info>,
  userId?: string
): Promise<ToolResult> {
  if (!userId) {
    return {
      success: false,
      message: "You need to be logged in to view account information.",
      actionRequired: "login",
    };
  }

  // TODO: Get actual workspace/plan info
  return {
    success: true,
    message: "Here's your account information:",
    data: {
      plan: "Free",
      linksUsed: 3,
      linksLimit: 5,
      qrUsed: 1,
      qrLimit: 2,
    },
  };
}

// Main tool executor
export async function executeTool(
  toolName: ToolName,
  params: unknown,
  context: { userId?: string; sessionId?: string; ipAddress?: string }
): Promise<ToolResult> {
  const startTime = Date.now();
  let result: ToolResult;

  try {
    // Validate tool name
    if (!ALLOWED_TOOLS.includes(toolName as any)) {
      throw new Error(`Unknown tool: ${toolName}`);
    }

    // Validate parameters
    const schema = toolSchemas[toolName];
    const validatedParams = schema.parse(params);

    // Execute tool
    switch (toolName) {
      case "create_support_ticket":
        result = await executeCreateSupportTicket(validatedParams as any);
        break;
      case "create_link":
        result = await executeCreateLink(validatedParams as any, context.userId);
        break;
      case "get_link_analytics":
        result = await executeGetLinkAnalytics(validatedParams as any, context.userId);
        break;
      case "generate_qr_code":
        result = await executeGenerateQrCode(validatedParams as any);
        break;
      case "navigate_to_page":
        result = await executeNavigateToPage(validatedParams as any);
        break;
      case "get_account_info":
        result = await executeGetAccountInfo(validatedParams as any, context.userId);
        break;
      default:
        result = { success: false, message: "Tool not implemented" };
    }
  } catch (error: any) {
    result = {
      success: false,
      message: error.message || "Tool execution failed",
    };
  }

  // Log tool execution
  const executionMs = Date.now() - startTime;
  try {
    await prisma.aIToolLog.create({
      data: {
        sessionId: context.sessionId,
        userId: context.userId,
        toolName,
        toolInput: JSON.stringify(params),
        toolOutput: JSON.stringify(result),
        success: result.success,
        errorMessage: result.success ? null : result.message,
        executionMs,
        ipAddress: context.ipAddress,
      },
    });
  } catch (e) {
    console.error("Failed to log tool execution:", e);
  }

  return result;
}

// Convert tool definitions to Anthropic format
export function getToolsForAnthropic() {
  return toolDefinitions.map((tool) => ({
    name: tool.name,
    description: tool.description,
    input_schema: {
      type: "object" as const,
      properties: Object.fromEntries(
        Object.entries(tool.parameters.shape).map(([key, schema]) => {
          const zodSchema = schema as z.ZodTypeAny;
          return [key, zodToJsonSchema(zodSchema)];
        })
      ),
      required: Object.entries(tool.parameters.shape)
        .filter(([_, schema]) => !(schema as any).isOptional?.())
        .map(([key]) => key),
    },
  }));
}

// Helper to convert Zod schema to JSON Schema
function zodToJsonSchema(schema: unknown): Record<string, unknown> {
  // Handle ZodString
  if (schema && typeof schema === "object" && "_def" in schema) {
    const def = (schema as any)._def;
    const typeName = def?.typeName;

    if (typeName === "ZodString") {
      return { type: "string" };
    }
    if (typeName === "ZodNumber") {
      return { type: "number" };
    }
    if (typeName === "ZodBoolean") {
      return { type: "boolean" };
    }
    if (typeName === "ZodEnum") {
      return { type: "string", enum: def.values };
    }
    if (typeName === "ZodOptional") {
      return zodToJsonSchema(def.innerType);
    }
    if (typeName === "ZodDefault") {
      return zodToJsonSchema(def.innerType);
    }
  }
  return { type: "string" };
}
