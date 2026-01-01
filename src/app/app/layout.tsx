"use client";

import { useState } from "react";
import { Sidebar } from "@/components/app/sidebar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Link2 } from "lucide-react";
import Link from "next/link";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--border)]/30">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="p-0 w-64 bg-[var(--dark)]">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="lg:pl-64 min-h-screen transition-all duration-300">
        {children}
      </div>
    </div>
  );
}
