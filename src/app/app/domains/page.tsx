"use client";

import { useState, useEffect } from "react";
import { AppHeader } from "@/components/app/app-header";
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
  Shield,
  Link2,
  Zap,
} from "lucide-react";

// Glowing Icon Component
function GlowingIcon({ icon: Icon, color, size = "md" }: { icon: any; color: string; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "h-4 w-4", md: "h-5 w-5", lg: "h-6 w-6" };
  const containerSizes = { sm: "h-8 w-8", md: "h-10 w-10", lg: "h-12 w-12" };
  const glowSizes = { sm: "h-6 w-6", md: "h-8 w-8", lg: "h-10 w-10" };

  return (
    <div className={`relative ${containerSizes[size]} flex items-center justify-center`}>
      <div className={`absolute ${glowSizes[size]} rounded-full ${color} opacity-40 blur-lg`} />
      <div className={`relative ${containerSizes[size]} rounded-xl ${color} bg-opacity-20 flex items-center justify-center backdrop-blur-sm border border-white/10`}>
        <Icon className={`${sizes[size]} text-white`} />
      </div>
    </div>
  );
}

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
  dnsInstructions: { cname: { host: string; type: string; value: string }; txt: { host: string; type: string; value: string } };
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(true);
  const [newDomain, setNewDomain] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [verifying, setVerifying] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const workspaceId = "demo-workspace";

  const fetchDomains = async () => {
    try {
      const res = await fetch(`/api/domains?workspaceId=${workspaceId}`);
      const data = await res.json();
      if (data.success) setDomains(data.data);
    } catch (err) {
      console.error("Error fetching domains:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDomains(); }, []);

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
      if (res.ok) { setNewDomain(""); fetchDomains(); }
      else setError(data.error || "Failed to add domain");
    } catch { setError("Something went wrong"); }
    finally { setAdding(false); }
  };

  const handleVerify = async (domainId: string) => {
    setVerifying(domainId);
    try {
      const res = await fetch(`/api/domains/${domainId}/verify`, { method: "POST" });
      const data = await res.json();
      if (data.success || data.data) fetchDomains();
    } catch (err) { console.error("Error verifying domain:", err); }
    finally { setVerifying(null); }
  };

  const handleDelete = async (domainId: string) => {
    if (!confirm("Are you sure you want to delete this domain?")) return;
    try { await fetch(`/api/domains/${domainId}?force=true`, { method: "DELETE" }); fetchDomains(); }
    catch (err) { console.error("Error deleting domain:", err); }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50";

  return (
    <div className="min-h-screen bg-[#0f0a1f]">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <AppHeader title="Domains" />

        <div className="p-4 lg:p-6 space-y-6">
          {/* Stats Header */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Globe} color="bg-violet-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{domains.length}</div>
                  <div className="text-xs text-gray-400">Total Domains</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Check} color="bg-emerald-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{domains.filter(d => d.status === "verified").length}</div>
                  <div className="text-xs text-gray-400">Verified</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Shield} color="bg-cyan-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{domains.filter(d => d.sslStatus === "active").length}</div>
                  <div className="text-xs text-gray-400">SSL Active</div>
                </div>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Link2} color="bg-amber-500" size="sm" />
                <div>
                  <div className="text-2xl font-bold text-white">{domains.reduce((acc, d) => acc + d.linksCount, 0)}</div>
                  <div className="text-xs text-gray-400">Links Using</div>
                </div>
              </div>
            </div>
          </div>

          {/* Add Domain */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <h3 className="font-semibold text-white mb-4">Add Custom Domain</h3>
            <form onSubmit={handleAddDomain} className="flex gap-3">
              <input
                type="text"
                placeholder="links.yourdomain.com"
                value={newDomain}
                onChange={(e) => setNewDomain(e.target.value)}
                className={`flex-1 ${inputClass}`}
              />
              <button
                type="submit"
                disabled={adding || !newDomain}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 disabled:opacity-50 text-white font-medium rounded-xl transition-all"
              >
                <Plus className="h-4 w-4" />
                {adding ? "Adding..." : "Add Domain"}
              </button>
            </form>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </div>

          {/* Domains List */}
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-gray-400">Loading domains...</div>
            ) : domains.length > 0 ? (
              domains.map((domain) => (
                <div key={domain.id} className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <GlowingIcon icon={Globe} color={domain.status === "verified" ? "bg-emerald-500" : "bg-amber-500"} size="md" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{domain.domain}</h3>
                          {domain.isDefault && <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-violet-500/20 text-violet-400">Default</span>}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400 mt-1">
                          <span>{domain.linksCount} links</span>
                          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            domain.status === "verified" ? "bg-emerald-500/20 text-emerald-400" :
                            domain.status === "pending" ? "bg-amber-500/20 text-amber-400" : "bg-red-500/20 text-red-400"
                          }`}>{domain.status}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {domain.status !== "verified" && (
                        <button
                          onClick={() => handleVerify(domain.id)}
                          disabled={verifying === domain.id}
                          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm transition-colors"
                        >
                          <RefreshCw className={`h-4 w-4 ${verifying === domain.id ? "animate-spin" : ""}`} />
                          Verify
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(domain.id)}
                        className="p-2 hover:bg-white/10 rounded-xl text-red-400 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {domain.status !== "verified" && domain.dnsInstructions && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-sm font-medium text-gray-300 mb-3">DNS Configuration Required</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <span className="text-xs text-gray-500">CNAME Record</span>
                            <p className="text-sm text-gray-300">{domain.dnsInstructions.cname.host} → {domain.dnsInstructions.cname.value}</p>
                          </div>
                          <button
                            onClick={() => copyToClipboard(domain.dnsInstructions.cname.value, `cname-${domain.id}`)}
                            className="p-2 hover:bg-white/10 rounded-lg text-gray-400"
                          >
                            {copied === `cname-${domain.id}` ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl border-2 border-dashed border-white/10 p-12 text-center">
                <div className="relative h-16 w-16 mx-auto mb-4">
                  <div className="absolute inset-0 bg-violet-500 rounded-full opacity-20 blur-xl" />
                  <div className="relative h-16 w-16 rounded-2xl bg-violet-500/20 flex items-center justify-center border border-white/10">
                    <Globe className="h-8 w-8 text-violet-400" />
                  </div>
                </div>
                <h3 className="font-semibold text-white text-lg mb-2">No Custom Domains</h3>
                <p className="text-gray-400 mb-6">Add your first custom domain for branded short links</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
