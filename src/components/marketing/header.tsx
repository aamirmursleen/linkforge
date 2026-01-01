"use client";

import * as React from "react";
import Link from "next/link";
import {
  Link2,
  QrCode,
  BarChart3,
  Plug,
  FileText,
  Building2,
  Users,
  ShoppingCart,
  Megaphone,
  Code,
  Book,
  Newspaper,
  HelpCircle,
  Search,
  Menu,
} from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "./mobile-nav";
import { SearchModal } from "./search-modal";

const products = [
  { title: "Link Management", href: "/products/link-management", description: "Create branded short links", icon: Link2 },
  { title: "QR Codes", href: "/products/qr-codes", description: "Generate dynamic QR codes", icon: QrCode },
  { title: "Analytics", href: "/products/analytics", description: "Track clicks and insights", icon: BarChart3 },
  { title: "Integrations", href: "/products/integrations", description: "Connect with your tools", icon: Plug },
  { title: "Pages", href: "/products/pages", description: "Build landing pages", icon: FileText },
];

const solutions = [
  { title: "Enterprise", href: "/solutions", description: "For large organizations", icon: Building2 },
  { title: "Small Business", href: "/solutions", description: "For growing businesses", icon: Users },
  { title: "E-commerce", href: "/solutions", description: "Drive sales with links", icon: ShoppingCart },
  { title: "Marketing", href: "/solutions", description: "Measure campaigns", icon: Megaphone },
];

const developers = [
  { title: "API Docs", href: "/developers", description: "Complete API reference", icon: Code },
  { title: "SDKs", href: "/developers", description: "Official libraries", icon: Book },
];

const resources = [
  { title: "Blog", href: "/resources", description: "Tips and best practices", icon: Newspaper },
  { title: "Help Center", href: "/resources", description: "Guides and answers", icon: HelpCircle },
];

export function Header() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [searchOpen, setSearchOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-200",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-white"
        )}
      >
        <div className="container">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-lg bg-primary flex items-center justify-center">
                <Link2 className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-xl text-dark">LinkForge</span>
            </Link>

            {/* Desktop Nav */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-2 p-4 w-[400px]">
                      {products.map((item) => (
                        <NavItem key={item.title} item={item} />
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Solutions</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-2 p-4 w-[400px]">
                      {solutions.map((item) => (
                        <NavItem key={item.title} item={item} />
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Developers</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-2 p-4 w-[320px]">
                      {developers.map((item) => (
                        <NavItem key={item.title} item={item} />
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-2 p-4 w-[320px]">
                      {resources.map((item) => (
                        <NavItem key={item.title} item={item} />
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link href="/pricing" legacyBehavior passHref>
                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                      Pricing
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            {/* Right */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex"
              >
                <Search className="h-5 w-5" />
              </Button>

              <div className="hidden sm:flex items-center gap-2">
                <Button variant="ghost" asChild>
                  <Link href="/signin">Sign in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Start free</Link>
                </Button>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

function NavItem({ item }: { item: { title: string; href: string; description: string; icon: React.ElementType } }) {
  const Icon = item.icon;
  return (
    <NavigationMenuLink asChild>
      <Link
        href={item.href}
        className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-50 transition-colors"
      >
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <div className="text-sm font-medium text-dark">{item.title}</div>
          <div className="text-sm text-muted">{item.description}</div>
        </div>
      </Link>
    </NavigationMenuLink>
  );
}
