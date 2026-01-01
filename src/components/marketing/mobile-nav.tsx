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
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const products = [
  { title: "Link Management", href: "/products/link-management", icon: Link2 },
  { title: "QR Codes", href: "/products/qr-codes", icon: QrCode },
  { title: "Analytics", href: "/products/analytics", icon: BarChart3 },
  { title: "Integrations", href: "/products/integrations", icon: Plug },
  { title: "Pages", href: "/products/pages", icon: FileText },
];

const solutions = [
  { title: "Enterprise", href: "/solutions", icon: Building2 },
  { title: "Small Business", href: "/solutions", icon: Users },
  { title: "E-commerce", href: "/solutions", icon: ShoppingCart },
  { title: "Marketing Teams", href: "/solutions", icon: Megaphone },
];

const developers = [
  { title: "API Documentation", href: "/developers", icon: Code },
  { title: "SDKs & Libraries", href: "/developers", icon: Book },
];

const resources = [
  { title: "Blog", href: "/resources", icon: Newspaper },
  { title: "Help Center", href: "/resources", icon: HelpCircle },
];

export function MobileNav({ open, onOpenChange }: MobileNavProps) {
  const handleLinkClick = () => {
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="border-b border-[var(--border)] pb-4 mb-4">
          <SheetTitle className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center">
              <Link2 className="h-5 w-5 text-white" />
            </div>
            <span>LinkForge</span>
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col gap-4">
          <Accordion type="single" collapsible className="w-full">
            {/* Products */}
            <AccordionItem value="products">
              <AccordionTrigger className="text-base font-medium">
                Products
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 pl-2">
                  {products.map((product) => (
                    <Link
                      key={product.title}
                      href={product.href}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[var(--primary-pale)] transition-colors"
                    >
                      <product.icon className="h-4 w-4 text-[var(--muted)]" />
                      {product.title}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Solutions */}
            <AccordionItem value="solutions">
              <AccordionTrigger className="text-base font-medium">
                Solutions
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 pl-2">
                  {solutions.map((solution) => (
                    <Link
                      key={solution.title}
                      href={solution.href}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[var(--primary-pale)] transition-colors"
                    >
                      <solution.icon className="h-4 w-4 text-[var(--muted)]" />
                      {solution.title}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Developers */}
            <AccordionItem value="developers">
              <AccordionTrigger className="text-base font-medium">
                Developers
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 pl-2">
                  {developers.map((dev) => (
                    <Link
                      key={dev.title}
                      href={dev.href}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[var(--primary-pale)] transition-colors"
                    >
                      <dev.icon className="h-4 w-4 text-[var(--muted)]" />
                      {dev.title}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Resources */}
            <AccordionItem value="resources">
              <AccordionTrigger className="text-base font-medium">
                Resources
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 pl-2">
                  {resources.map((resource) => (
                    <Link
                      key={resource.title}
                      href={resource.href}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-[var(--primary-pale)] transition-colors"
                    >
                      <resource.icon className="h-4 w-4 text-[var(--muted)]" />
                      {resource.title}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Direct Links */}
          <div className="border-t border-[var(--border)] pt-4">
            <Link
              href="/pricing"
              onClick={handleLinkClick}
              className="flex items-center rounded-lg px-3 py-2 text-base font-medium hover:bg-[var(--primary-pale)] transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/company/about"
              onClick={handleLinkClick}
              className="flex items-center rounded-lg px-3 py-2 text-base font-medium hover:bg-[var(--primary-pale)] transition-colors"
            >
              About
            </Link>
            <Link
              href="/company/contact"
              onClick={handleLinkClick}
              className="flex items-center rounded-lg px-3 py-2 text-base font-medium hover:bg-[var(--primary-pale)] transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/trust"
              onClick={handleLinkClick}
              className="flex items-center rounded-lg px-3 py-2 text-base font-medium hover:bg-[var(--primary-pale)] transition-colors"
            >
              Trust & Security
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="border-t border-[var(--border)] pt-4 flex flex-col gap-2">
            <Button variant="secondary" asChild className="w-full">
              <Link href="/signin" onClick={handleLinkClick}>
                Sign in
              </Link>
            </Button>
            <Button asChild className="w-full">
              <Link href="/signup" onClick={handleLinkClick}>
                Start free
              </Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
