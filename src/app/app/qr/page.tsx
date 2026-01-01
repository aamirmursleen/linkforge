import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  QrCode,
  Plus,
  Search,
  Download,
  ExternalLink,
  MoreHorizontal,
} from "lucide-react";

const qrCodes = [
  {
    id: 1,
    title: "Restaurant Menu",
    url: "lnk.fg/menu",
    scans: 523,
    status: "active",
    created: "1 day ago",
  },
  {
    id: 2,
    title: "Business Card",
    url: "lnk.fg/contact",
    scans: 156,
    status: "active",
    created: "3 days ago",
  },
  {
    id: 3,
    title: "Product Packaging",
    url: "lnk.fg/product-info",
    scans: 892,
    status: "active",
    created: "1 week ago",
  },
];

export default function QRCodesPage() {
  return (
    <>
      <AppHeader title="QR Codes" />

      <div className="p-4 lg:p-6 space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted)]" />
            <Input placeholder="Search QR codes..." className="pl-10" />
          </div>
          <Button>
            <Plus className="h-4 w-4" />
            Create QR Code
          </Button>
        </div>

        {/* Create QR Card */}
        <Card className="border-dashed border-2">
          <CardContent className="py-8">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 w-full">
                <Input
                  placeholder="Enter URL or select a link..."
                  className="h-12 text-base"
                />
              </div>
              <Button size="lg">
                <QrCode className="h-5 w-5" />
                Generate
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* QR Codes Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
            <Card key={qr.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                {/* QR Code Preview */}
                <div className="bg-white rounded-lg p-4 mb-4 flex items-center justify-center">
                  <div className="h-32 w-32 bg-[var(--dark)] rounded-lg flex items-center justify-center">
                    <QrCode className="h-20 w-20 text-white" />
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-[var(--dark)]">{qr.title}</h3>
                    <Badge variant={qr.status === "active" ? "success" : "outline"}>
                      {qr.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--primary)]">{qr.url}</p>
                  <div className="flex items-center justify-between text-sm text-[var(--muted)]">
                    <span>{qr.scans} scans</span>
                    <span>{qr.created}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[var(--border)]">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
