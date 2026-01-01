"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search,
  Bell,
  HelpCircle,
  Menu,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AppHeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export function AppHeader({ title = "Dashboard", onMenuClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-6">
      {/* Left Side */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--border)] transition-colors"
        >
          <Menu className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-semibold text-[var(--dark)]">{title}</h1>
      </div>

      {/* Center - Search */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
          <Input
            placeholder="Search links, QR codes..."
            className="pl-10 bg-[var(--border)]/50 border-0"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <HelpCircle className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[var(--accent)]" />
        </Button>
        <Button size="sm" className="hidden sm:flex" asChild>
          <Link href="/app/links">
            <Plus className="h-4 w-4" />
            Create
          </Link>
        </Button>
      </div>
    </header>
  );
}
