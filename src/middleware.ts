import { NextRequest, NextResponse } from "next/server";

// Custom domain redirect middleware
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") || "";
  const pathname = request.nextUrl.pathname;

  // Skip for localhost and the main app domain
  const mainDomains = [
    "localhost",
    "localhost:3000",
    "localhost:3001",
    "localhost:3002",
    "127.0.0.1",
    "linkforge.io",
    "www.linkforge.io",
    "linkforge.vercel.app",
  ];

  // Check if this is the main domain (also handle ports)
  const hostnameWithoutPort = hostname.split(":")[0];
  const isMainDomain = mainDomains.some(
    (domain) => hostname === domain || hostnameWithoutPort === domain || hostname.endsWith(`.${domain}`)
  );

  if (isMainDomain) {
    // Allow normal routing for main domain
    return NextResponse.next();
  }

  // This is a custom domain request
  // Skip API routes, static files, and internal Next.js routes
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.includes(".") // Has file extension
  ) {
    return NextResponse.next();
  }

  // Extract short code from path (e.g., /abc123 -> abc123)
  const shortCode = pathname.slice(1); // Remove leading slash

  if (!shortCode) {
    // Root of custom domain - could redirect to a default page or 404
    return NextResponse.rewrite(new URL("/custom-domain-landing", request.url));
  }

  // Rewrite to internal redirect handler with custom domain context
  const redirectUrl = new URL("/api/redirect/custom", request.url);
  redirectUrl.searchParams.set("domain", hostname);
  redirectUrl.searchParams.set("code", shortCode);

  return NextResponse.rewrite(redirectUrl);
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes that should pass through
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
