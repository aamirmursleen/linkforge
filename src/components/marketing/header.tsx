"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Link2,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  QrCode,
  BarChart3,
  FileText,
  Plug,
  Code,
  Book,
  HelpCircle,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const products = [
  { name: "Link Management", href: "/products/link-management", description: "Create branded short links", icon: Link2 },
  { name: "QR Codes", href: "/products/qr-codes", description: "Generate dynamic QR codes", icon: QrCode },
  { name: "Analytics", href: "/products/analytics", description: "Track clicks and insights", icon: BarChart3 },
  { name: "Bio Pages", href: "/products/pages", description: "Build link-in-bio pages", icon: FileText },
  { name: "Integrations", href: "/products/integrations", description: "Connect your tools", icon: Plug },
];

const resources = [
  { name: "Features", href: "/features", description: "All features explained", icon: Zap },
  { name: "Developers", href: "/developers", description: "API documentation", icon: Code },
  { name: "Help Center", href: "/resources", description: "Guides & tutorials", icon: HelpCircle },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null);
  const pathname = usePathname();
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setMobileOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  React.useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileOpen]);

  const handleMouseEnter = (dropdown: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setActiveDropdown(dropdown);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      {/* Floating Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <nav
          className={cn(
            "mx-auto max-w-5xl transition-all duration-300 ease-out",
            "rounded-full border",
            "flex items-center justify-between",
            "px-4 sm:px-6 h-14 sm:h-16",
            isScrolled
              ? "bg-white/90 backdrop-blur-xl shadow-lg shadow-black/5 border-gray-200/50"
              : "bg-white/70 backdrop-blur-md border-gray-200/30"
          )}
        >
          {/* Left - Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-xl bg-[var(--primary)] flex items-center justify-center shadow-lg shadow-[var(--primary)]/25">
              <Link2 className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl text-[var(--dark)]">
              LinkForge
            </span>
          </Link>

          {/* Center - Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1">
            {/* Products Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("products")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  activeDropdown === "products"
                    ? "text-[var(--primary)] bg-[var(--primary-pale)]"
                    : "text-[var(--muted)] hover:text-[var(--dark)] hover:bg-gray-100"
                )}
              >
                Products
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  activeDropdown === "products" && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu */}
              <div
                className={cn(
                  "absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200",
                  activeDropdown === "products"
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-2 invisible"
                )}
              >
                <div className="p-2">
                  {products.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-9 w-9 rounded-lg bg-[var(--primary-pale)] flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-[var(--primary)]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--dark)]">{item.name}</div>
                        <div className="text-xs text-[var(--muted)]">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => handleMouseEnter("resources")}
              onMouseLeave={handleMouseLeave}
            >
              <button
                className={cn(
                  "flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                  activeDropdown === "resources"
                    ? "text-[var(--primary)] bg-[var(--primary-pale)]"
                    : "text-[var(--muted)] hover:text-[var(--dark)] hover:bg-gray-100"
                )}
              >
                Resources
                <ChevronDown className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  activeDropdown === "resources" && "rotate-180"
                )} />
              </button>

              {/* Dropdown Menu */}
              <div
                className={cn(
                  "absolute top-full left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden transition-all duration-200",
                  activeDropdown === "resources"
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 -translate-y-2 invisible"
                )}
              >
                <div className="p-2">
                  {resources.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-9 w-9 rounded-lg bg-[var(--primary-pale)] flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-[var(--primary)]" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-[var(--dark)]">{item.name}</div>
                        <div className="text-xs text-[var(--muted)]">{item.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Pricing Link */}
            <Link
              href="/pricing"
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200",
                pathname === "/pricing"
                  ? "text-[var(--primary)] bg-[var(--primary-pale)]"
                  : "text-[var(--muted)] hover:text-[var(--dark)] hover:bg-gray-100"
              )}
            >
              Pricing
            </Link>
          </div>

          {/* Right - Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Search Button (Desktop) */}
            <button
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted)] hover:text-[var(--dark)] hover:bg-gray-100 transition-colors"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </button>

            {/* Login (Desktop) */}
            <Link
              href="/sign-in"
              className="hidden sm:block text-sm font-medium text-[var(--muted)] hover:text-[var(--dark)] transition-colors px-3 py-2"
            >
              Log in
            </Link>

            {/* CTA Button */}
            <Link
              href="/sign-up"
              className={cn(
                "hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200",
                "bg-[var(--primary)] text-white",
                "hover:bg-[var(--primary-hover)] hover:shadow-lg hover:shadow-[var(--primary)]/25",
                "active:scale-95"
              )}
            >
              <Sparkles className="h-4 w-4" />
              Get Started
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className={cn(
                "lg:hidden h-9 w-9 flex items-center justify-center rounded-full transition-colors",
                mobileOpen
                  ? "bg-[var(--primary)] text-white"
                  : "text-[var(--muted)] hover:bg-gray-100"
              )}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-40 lg:hidden transition-all duration-300",
          mobileOpen ? "visible" : "invisible"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Mobile Menu Panel */}
        <div
          className={cn(
            "absolute top-20 left-4 right-4 max-h-[70vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-gray-200/50 transition-all duration-300",
            mobileOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          )}
        >
          {/* Products Section */}
          <div className="p-4">
            <div className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-3 mb-2">
              Products
            </div>
            <div className="space-y-1">
              {products.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-[var(--primary-pale)] flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-[var(--primary)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--dark)]">{item.name}</div>
                    <div className="text-xs text-[var(--muted)]">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-4" />

          {/* Resources Section */}
          <div className="p-4">
            <div className="text-xs font-semibold text-[var(--muted)] uppercase tracking-wider px-3 mb-2">
              Resources
            </div>
            <div className="space-y-1">
              {resources.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-[var(--primary-pale)] flex items-center justify-center">
                    <item.icon className="h-4 w-4 text-[var(--primary)]" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-[var(--dark)]">{item.name}</div>
                    <div className="text-xs text-[var(--muted)]">{item.description}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-4" />

          {/* Pricing */}
          <div className="p-4">
            <Link
              href="/pricing"
              className="flex items-center justify-between px-3 py-3 rounded-xl text-base font-medium text-[var(--dark)] hover:bg-gray-50 transition-colors"
            >
              Pricing
              <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-semibold">
                90% OFF
              </span>
            </Link>
          </div>

          {/* Divider */}
          <div className="h-px bg-gray-100 mx-4" />

          {/* Auth Buttons */}
          <div className="p-4 space-y-2">
            <Link
              href="/sign-in"
              className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-base font-medium text-[var(--dark)] bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-base font-semibold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors"
            >
              <Sparkles className="h-4 w-4" />
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// Keep exports for backward compatibility
export function MobileNav({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return null;
}

export function SearchModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  return null;
}
