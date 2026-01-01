import { AppHeader } from "@/components/app/app-header";
import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Link2,
  Plus,
  Search,
  Copy,
  ExternalLink,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";

const links = [
  {
    id: 1,
    title: "Summer Sale Campaign",
    shortUrl: "lnk.fg/summer-sale",
    originalUrl: "https://example.com/products/summer-collection?utm_source=email&utm_campaign=summer2024",
    clicks: 1243,
    status: "active",
    created: "2 hours ago",
  },
  {
    id: 2,
    title: "Product Launch",
    shortUrl: "lnk.fg/new-product",
    originalUrl: "https://example.com/products/new-widget",
    clicks: 892,
    status: "active",
    created: "Yesterday",
  },
  {
    id: 3,
    title: "Newsletter Signup",
    shortUrl: "lnk.fg/newsletter",
    originalUrl: "https://example.com/newsletter/subscribe",
    clicks: 567,
    status: "active",
    created: "3 days ago",
  },
  {
    id: 4,
    title: "Webinar Registration",
    shortUrl: "lnk.fg/webinar-q1",
    originalUrl: "https://example.com/events/webinar-q1-2024",
    clicks: 234,
    status: "expired",
    created: "1 week ago",
  },
];

export default function LinksPage() {
  return (
    <>
      <AppHeader title="Links" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
            <Input placeholder="Search links..." className="pl-10" />
          </div>
          <Button>
            <Plus className="h-4 w-4" />
            Create Link
          </Button>
        </div>

        {/* Create Link Card */}
        <Card className="border-dashed border-2">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <Input
                  placeholder="Paste your long URL here..."
                  className="h-12 text-base"
                />
              </div>
              <Button size="lg">
                <Link2 className="h-5 w-5" />
                Shorten
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Links List */}
        <div className="space-y-4">
          {links.length > 0 ? (
            links.map((link) => (
              <Card key={link.id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Link Info */}
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-lg bg-[var(--primary-pale)] flex items-center justify-center shrink-0">
                        <Link2 className="h-6 w-6 text-[var(--primary)]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-[var(--dark)] truncate">
                            {link.title}
                          </h3>
                          <Badge
                            variant={link.status === "active" ? "success" : "outline"}
                            className="shrink-0"
                          >
                            {link.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <a
                            href={`https://${link.shortUrl}`}
                            className="text-[var(--primary)] font-medium hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {link.shortUrl}
                          </a>
                          <button className="p-1 hover:bg-[var(--border)] rounded">
                            <Copy className="h-3 w-3 text-[var(--muted)]" />
                          </button>
                        </div>
                        <p className="text-xs text-[var(--muted)] truncate mt-1">
                          {link.originalUrl}
                        </p>
                      </div>
                    </div>

                    {/* Stats & Actions */}
                    <div className="flex items-center gap-6 pl-15 lg:pl-0">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-[var(--dark)] flex items-center gap-1">
                          {link.clicks}
                          <ArrowUpRight className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="text-xs text-[var(--muted)]">clicks</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-[var(--muted)]">
                          {link.created}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <EmptyState
              icon={Link2}
              title="No links yet"
              description="Create your first short link to get started."
              actionLabel="Create Link"
              actionHref="/app/links"
            />
          )}
        </div>
      </div>
    </>
  );
}
