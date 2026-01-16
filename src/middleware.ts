import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define protected routes that require authentication
const isProtectedRoute = createRouteMatcher([
  "/app(.*)",
]);

// Define public routes that don't need auth
const isPublicRoute = createRouteMatcher([
  "/",
  "/signin(.*)",
  "/signup(.*)",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/pricing(.*)",
  "/products(.*)",
  "/features(.*)",
  "/solutions(.*)",
  "/resources(.*)",
  "/company(.*)",
  "/trust(.*)",
  "/developers(.*)",
  "/api/public(.*)",
  "/api/redirect(.*)",
  "/bio(.*)",
  "/r/(.*)",
]);

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  const hostname = request.headers.get("host") || "";

  // Handle custom domain redirects
  const mainDomains = [
    "localhost",
    "127.0.0.1",
    "linkforge.io",
    "www.linkforge.io",
    "linkforge.vercel.app",
    "linkforge-saas.vercel.app",
    "linkforge-saas-atif-lovs-projects.vercel.app",
  ];

  const hostnameWithoutPort = hostname.split(":")[0];
  const isMainDomain = mainDomains.some(
    (domain) => hostname === domain || hostnameWithoutPort === domain || hostname.endsWith(`.${domain}`)
  );

  // Handle custom domain requests
  if (!isMainDomain) {
    if (
      pathname.startsWith("/api/") ||
      pathname.startsWith("/_next/") ||
      pathname.startsWith("/static/") ||
      pathname.includes(".")
    ) {
      return NextResponse.next();
    }

    const shortCode = pathname.slice(1);
    if (!shortCode) {
      return NextResponse.rewrite(new URL("/custom-domain-landing", request.url));
    }

    const redirectUrl = new URL("/api/redirect/custom", request.url);
    redirectUrl.searchParams.set("domain", hostname);
    redirectUrl.searchParams.set("code", shortCode);
    return NextResponse.rewrite(redirectUrl);
  }

  // Protect /app routes - require authentication
  if (isProtectedRoute(request)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL("/signin", request.url);
      signInUrl.searchParams.set("redirect_url", pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
