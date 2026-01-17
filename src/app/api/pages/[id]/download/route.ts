import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// Theme CSS configurations
const THEME_STYLES: Record<string, { bg: string; card: string; text: string; textMuted: string }> = {
  default: {
    bg: "background: linear-gradient(to bottom right, #f8fafc, #f1f5f9);",
    card: "background: white; box-shadow: 0 1px 3px rgba(0,0,0,0.1);",
    text: "color: #0f172a;",
    textMuted: "color: #475569;",
  },
  dark: {
    bg: "background: linear-gradient(to bottom right, #0f172a, #1e293b);",
    card: "background: #1e293b; border: 1px solid #334155;",
    text: "color: white;",
    textMuted: "color: #94a3b8;",
  },
  ocean: {
    bg: "background: linear-gradient(to bottom right, #06b6d4, #2563eb);",
    card: "background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); box-shadow: 0 4px 6px rgba(0,0,0,0.1);",
    text: "color: #0f172a;",
    textMuted: "color: #475569;",
  },
  sunset: {
    bg: "background: linear-gradient(to bottom right, #fb923c, #ec4899, #9333ea);",
    card: "background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); box-shadow: 0 4px 6px rgba(0,0,0,0.1);",
    text: "color: #0f172a;",
    textMuted: "color: #475569;",
  },
  forest: {
    bg: "background: linear-gradient(to bottom right, #16a34a, #059669);",
    card: "background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); box-shadow: 0 4px 6px rgba(0,0,0,0.1);",
    text: "color: #0f172a;",
    textMuted: "color: #475569;",
  },
  minimal: {
    bg: "background: white;",
    card: "border: 2px solid #e2e8f0;",
    text: "color: #0f172a;",
    textMuted: "color: #475569;",
  },
};

// Social icons as inline SVGs
const SOCIAL_SVGS: Record<string, string> = {
  instagram: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
  twitter: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>`,
  youtube: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15 5-3-5-3z"/></svg>`,
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
  github: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>`,
};

const ICON_SVGS = {
  mail: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
  phone: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  mapPin: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`,
  externalLink: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" x2="21" y1="14" y2="3"/></svg>`,
  globe: `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" x2="22" y1="12" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`,
};

function generateBlockHTML(block: any, theme: typeof THEME_STYLES.default): string {
  switch (block.type) {
    case "header":
      return `
        <div style="text-align: center; margin-bottom: 2rem;">
          ${block.content.avatar ? `
            <div style="width: 96px; height: 96px; margin: 0 auto 1rem; border-radius: 50%; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
              <img src="${block.content.avatar}" alt="${block.content.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
          ` : ''}
          <h1 style="font-size: 1.5rem; font-weight: bold; margin-bottom: 0.5rem; ${theme.text}">${block.content.title || ''}</h1>
          ${block.content.subtitle ? `<p style="font-size: 0.875rem; ${theme.textMuted}">${block.content.subtitle}</p>` : ''}
          ${block.content.bio ? `<p style="margin-top: 0.75rem; font-size: 0.875rem; max-width: 28rem; margin-left: auto; margin-right: auto; ${theme.textMuted}">${block.content.bio}</p>` : ''}
        </div>
      `;

    case "link":
      return `
        <a href="${block.content.url || '#'}" target="_blank" rel="noopener noreferrer"
           style="display: block; width: 100%; padding: 1rem; border-radius: 0.75rem; text-align: center; text-decoration: none; transition: transform 0.2s; ${theme.card}">
          <div style="display: flex; align-items: center; justify-content: center; gap: 0.75rem;">
            <span style="font-weight: 500; ${theme.text}">${block.content.title || 'Link'}</span>
            <span style="${theme.textMuted}">${ICON_SVGS.externalLink}</span>
          </div>
        </a>
      `;

    case "social":
      const socialLinks = block.content.links || [];
      return `
        <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 0.75rem;">
          ${socialLinks.map((social: any) => `
            <a href="${social.url || '#'}" target="_blank" rel="noopener noreferrer"
               style="padding: 0.75rem; border-radius: 50%; text-decoration: none; transition: transform 0.2s; ${theme.card} ${theme.text}">
              ${SOCIAL_SVGS[social.platform] || ICON_SVGS.globe}
            </a>
          `).join('')}
        </div>
      `;

    case "text":
      return `
        <div style="padding: 1rem; border-radius: 0.75rem; ${theme.card}">
          ${block.content.title ? `<h3 style="font-weight: 600; margin-bottom: 0.5rem; ${theme.text}">${block.content.title}</h3>` : ''}
          <p style="font-size: 0.875rem; white-space: pre-wrap; ${theme.textMuted}">${block.content.text || ''}</p>
        </div>
      `;

    case "divider":
      return `
        <div style="display: flex; align-items: center; gap: 1rem; padding: 0.5rem 0;">
          <div style="flex: 1; height: 1px; ${theme.textMuted} opacity: 0.3; background: currentColor;"></div>
          ${block.content.text ? `<span style="font-size: 0.75rem; ${theme.textMuted}">${block.content.text}</span>` : ''}
          <div style="flex: 1; height: 1px; ${theme.textMuted} opacity: 0.3; background: currentColor;"></div>
        </div>
      `;

    case "image":
      return `
        <div style="border-radius: 0.75rem; overflow: hidden; ${theme.card}">
          <img src="${block.content.url || ''}" alt="${block.content.alt || 'Image'}" style="width: 100%; height: auto;" />
          ${block.content.caption ? `<p style="padding: 0.75rem; font-size: 0.875rem; text-align: center; ${theme.textMuted}">${block.content.caption}</p>` : ''}
        </div>
      `;

    case "video":
      if (block.content.type === "youtube" && block.content.videoId) {
        return `
          <div style="border-radius: 0.75rem; overflow: hidden; ${theme.card}">
            <div style="position: relative; padding-bottom: 56.25%; height: 0;">
              <iframe src="https://www.youtube.com/embed/${block.content.videoId}"
                      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none;"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowfullscreen></iframe>
            </div>
          </div>
        `;
      }
      return '';

    case "contact":
      return `
        <div style="padding: 1rem; border-radius: 0.75rem; ${theme.card}">
          ${block.content.email ? `
            <a href="mailto:${block.content.email}" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none; margin-bottom: 0.75rem;">
              <span style="${theme.textMuted}">${ICON_SVGS.mail}</span>
              <span style="font-size: 0.875rem; ${theme.text}">${block.content.email}</span>
            </a>
          ` : ''}
          ${block.content.phone ? `
            <a href="tel:${block.content.phone}" style="display: flex; align-items: center; gap: 0.75rem; text-decoration: none; margin-bottom: 0.75rem;">
              <span style="${theme.textMuted}">${ICON_SVGS.phone}</span>
              <span style="font-size: 0.875rem; ${theme.text}">${block.content.phone}</span>
            </a>
          ` : ''}
          ${block.content.address ? `
            <div style="display: flex; align-items: center; gap: 0.75rem;">
              <span style="${theme.textMuted}">${ICON_SVGS.mapPin}</span>
              <span style="font-size: 0.875rem; ${theme.text}">${block.content.address}</span>
            </div>
          ` : ''}
        </div>
      `;

    case "form":
      return `
        <div style="padding: 1rem; border-radius: 0.75rem; ${theme.card}">
          <h3 style="font-weight: 600; margin-bottom: 0.25rem; ${theme.text}">${block.content.title || 'Subscribe'}</h3>
          ${block.content.description ? `<p style="font-size: 0.875rem; margin-bottom: 0.75rem; ${theme.textMuted}">${block.content.description}</p>` : ''}
          <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            ${(block.content.fields || ['email']).map((field: string) => `
              <input type="${field === 'email' ? 'email' : 'text'}" placeholder="${field.charAt(0).toUpperCase() + field.slice(1)}"
                     style="width: 100%; padding: 0.75rem; font-size: 0.875rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; background: #f8fafc;" />
            `).join('')}
            <button style="width: 100%; padding: 0.75rem; background: #8b5cf6; color: white; font-size: 0.875rem; font-weight: 500; border-radius: 0.5rem; border: none; cursor: pointer;">
              ${block.content.buttonText || 'Submit'}
            </button>
          </div>
        </div>
      `;

    default:
      return '';
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const page = await prisma.page.findUnique({
      where: { id },
      include: { workspace: true },
    });

    if (!page) {
      return NextResponse.json({ success: false, error: "Page not found" }, { status: 404 });
    }

    // Parse blocks
    let blocks: any[] = [];
    try {
      blocks = typeof page.blocks === "string" ? JSON.parse(page.blocks) : page.blocks;
    } catch {
      blocks = [];
    }

    const theme = THEME_STYLES[page.theme] || THEME_STYLES.default;

    // Generate HTML
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${page.title}</title>
  <meta name="description" content="${page.description || page.title}">
  ${page.metaTitle ? `<meta property="og:title" content="${page.metaTitle}">` : ''}
  ${page.metaDescription ? `<meta property="og:description" content="${page.metaDescription}">` : ''}
  ${page.ogImage ? `<meta property="og:image" content="${page.ogImage}">` : ''}
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      min-height: 100vh;
      ${theme.bg}
      ${page.backgroundImage ? `background-image: url('${page.backgroundImage}'); background-size: cover; background-position: center;` : ''}
    }
    .container {
      max-width: 28rem;
      margin: 0 auto;
      padding: 3rem 1rem;
    }
    .block {
      margin-bottom: 1rem;
    }
    a:hover { opacity: 0.9; transform: scale(1.02); }
    .footer {
      padding-top: 2rem;
      text-align: center;
    }
    .footer a {
      font-size: 0.75rem;
      opacity: 0.6;
      text-decoration: none;
      ${theme.textMuted}
    }
    .footer a:hover { opacity: 1; }
  </style>
</head>
<body>
  <div class="container">
    ${blocks.map(block => `<div class="block">${generateBlockHTML(block, theme)}</div>`).join('\n')}
    <div class="footer">
      <a href="https://linkforge.com">Powered by LinkForge</a>
    </div>
  </div>
</body>
</html>`;

    // Return as downloadable file
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="${page.slug}-page.html"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json({ success: false, error: "Failed to generate download" }, { status: 500 });
  }
}
