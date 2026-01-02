"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  Plus,
  Copy,
  Check,
  RefreshCw,
  Trash2,
  Star,
  AlertCircle,
  ExternalLink,
} from "lucide-react";

interface Domain {
  id: string;
  domain: string;
  status: "pending" | "verifying" | "verified" | "failed";
  verificationType: string;
  verifiedAt: string | null;
  sslStatus: string;
  isDefault: boolean;
  linksCount: number;
  createdAt: string;
  dnsInstructions: {
    cname: { host: string; type: string; value: string };
    txt: { host: string; type: string; value: string };
  };
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Demo workspace ID - in production, get from auth context
  const workspaceId = "demo-workspace";

  const fetchDomains = async () => {
    try {
      const res = await fetch(`/api/domains?workspaceId=${workspaceId}`);
      const data = await res.json();
      if (data.success) {
        setDomains(data.data);
      }
    } catch (err) {
      console.error("Error fetching domains:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleAddDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setAdding(true);

    try {
      const res = await fetch("/api/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: newDomain, workspaceId }),
      });

      const data = await res.json();

      if (res.ok) {
        setNewDomain("");
        fetchDomains();
      } else {
        setError(data.error || "Failed to add domain");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setAdding(false);
    }
  };

  const handleVerify = async (domainId: string) => {
    setVerifying(domainId);

    try {
      const res = await fetch(`/api/domains/${domainId}/verify`, {
        method: "POST",
      });

      const data = await res.json();

      if (data.success || data.data) {
        fetchDomains();
      }
    } catch (err) {
      console.error("Error verifying domain:", err);
    } finally {
      setVerifying(null);
    }
  };

  const handleDelete = async (domainId: string) => {
    if (!confirm("Are you sure you want to delete this domain?")) return;

    try {
      await fetch(`/api/domains/${domainId}?force=true`, { method: "DELETE" });
      fetchDomains();
    } catch (err) {
      console.error("Error deleting domain:", err);
    }
  };

  const handleSetDefault = async (domainId: string) => {
    try {
      await fetch(`/api/domains/${domainId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isDefault: true }),
      });
      fetchDomains();
    } catch (err) {
      console.error("Error setting default:", err);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge variant="success">Verified</Badge>;
      case "verifying":
        return <Badge variant="default">Verifying...</Badge>;
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <>
      <AppHeader title="Custom Domains" />

      <div className="p-4 lg:p-6 space-y-6 max-w-4xl">
        {/* Add Domain */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-[var(--primary)]" />
              <CardTitle>Add Custom Domain</CardTitle>
            </div>
            <CardDescription>
              Use your own domain for branded short links
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddDomain} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="links.yourdomain.com"
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  disabled={adding}
                />
                <Button type="submit" disabled={adding || !newDomain}>
                  {adding ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  Add
                </Button>
              </div>
              {error && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </p>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Domains List */}
        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto text-gray-400" />
            <p className="mt-2 text-gray-500">Loading domains...</p>
          </div>
        ) : domains.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Globe className="h-12 w-12 mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No custom domains yet
              </h3>
              <p className="text-gray-500 mb-4">
                Add your first custom domain to create branded short links
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {domains.map((domain) => (
              <Card key={domain.id}>
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{domain.domain}</h3>
                        {getStatusBadge(domain.status)}
                        {domain.isDefault && (
                          <Badge variant="outline" className="gap-1">
                            <Star className="h-3 w-3" />
                            Default
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-gray-500">
                        {domain.linksCount} links • Added{" "}
                        {new Date(domain.createdAt).toLocaleDateString()}
                      </p>

                      {/* DNS Instructions for pending domains */}
                      {domain.status !== "verified" && (
                        <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                          <h4 className="font-medium text-amber-800 mb-2">
                            Configure DNS to verify ownership
                          </h4>
                          <div className="space-y-3 text-sm">
                            <div>
                              <p className="font-medium text-gray-700">
                                Option 1: CNAME Record
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="bg-white px-2 py-1 rounded text-xs flex-1">
                                  {domain.dnsInstructions.cname.host} → {domain.dnsInstructions.cname.value}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(
                                      domain.dnsInstructions.cname.value,
                                      `cname-${domain.id}`
                                    )
                                  }
                                >
                                  {copied === `cname-${domain.id}` ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                            <div>
                              <p className="font-medium text-gray-700">
                                Option 2: TXT Record
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <code className="bg-white px-2 py-1 rounded text-xs flex-1 truncate">
                                  {domain.dnsInstructions.txt.host} → {domain.dnsInstructions.txt.value}
                                </code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    copyToClipboard(
                                      domain.dnsInstructions.txt.value,
                                      `txt-${domain.id}`
                                    )
                                  }
                                >
                                  {copied === `txt-${domain.id}` ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <Copy className="h-4 w-4" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {domain.status !== "verified" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleVerify(domain.id)}
                          disabled={verifying === domain.id}
                        >
                          {verifying === domain.id ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          Verify
                        </Button>
                      )}
                      {domain.status === "verified" && !domain.isDefault && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetDefault(domain.id)}
                        >
                          <Star className="h-4 w-4" />
                          Set Default
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                        onClick={() => handleDelete(domain.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="bg-blue-50 border-blue-100">
          <CardContent className="py-4">
            <div className="flex gap-3">
              <ExternalLink className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">How custom domains work</p>
                <ul className="list-disc list-inside space-y-1 text-blue-700">
                  <li>Add your domain (e.g., go.yourbrand.com)</li>
                  <li>Configure DNS records with your domain provider</li>
                  <li>Click &quot;Verify&quot; once DNS propagates (can take up to 48 hours)</li>
                  <li>Start creating branded short links!</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
