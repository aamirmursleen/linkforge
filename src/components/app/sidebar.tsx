"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Link2,
  QrCode,
  BarChart3,
  Settings,
  Home,
  Plus,
  ChevronLeft,
  ChevronRight,
  Globe,
  FolderOpen,
  Tag,
  Target,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  { icon: Home, label: "Dashboard", href: "/app" },
  { icon: Link2, label: "Links", href: "/app/links" },
  { icon: QrCode, label: "QR Codes", href: "/app/qr" },
  { icon: FileText, label: "Pages", href: "/app/pages" },
  { icon: BarChart3, label: "Analytics", href: "/app/analytics" },
  { icon: Target, label: "UTM Builder", href: "/app/utm-builder" },
  { icon: Globe, label: "Domains", href: "/app/domains" },
  { icon: Settings, label: "Settings", href: "/app/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen bg-[var(--dark)] text-white flex flex-col transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
        <Link
          href="/app"
          className={cn(
            "flex items-center gap-2 font-bold text-lg",
            collapsed && "justify-center"
          )}
        >
          <div className="h-8 w-8 rounded-lg bg-[var(--primary)] flex items-center justify-center shrink-0">
            <Link2 className="h-5 w-5 text-white" />
          </div>
          {!collapsed && <span>LinkForge</span>}
        </Link>
      </div>

      {/* Create Button */}
      <div className="p-4">
        <Button
          className={cn(
            "w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)]",
            collapsed && "px-0"
          )}
          asChild
        >
          <Link href="/app/links">
            <Plus className="h-5 w-5" />
            {!collapsed && <span>Create New</span>}
          </Link>
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== "/app" && pathname.startsWith(item.href));

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white",
                    collapsed && "justify-center px-2"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Collapse Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 text-gray-400 hover:text-white transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <>
              <ChevronLeft className="h-5 w-5 mr-2" />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>

      {/* User */}
      {!collapsed && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-[var(--primary)] flex items-center justify-center text-sm font-medium">
              JD
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">John Doe</p>
              <p className="text-xs text-gray-400 truncate">john@example.com</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
