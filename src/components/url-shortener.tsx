"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2, ExternalLink } from "lucide-react";

interface ShortenedLink {
  id: string;
  shortCode: string;
  longUrl: string;
  shortUrl: string;
}

export function UrlShortener() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shortenedLink, setShortenedLink] = useState<ShortenedLink | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShorten = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    // Add https:// if no protocol specified
    let urlToShorten = url.trim();
    if (!urlToShorten.startsWith("http://") && !urlToShorten.startsWith("https://")) {
      urlToShorten = "https://" + urlToShorten;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url: urlToShorten }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setShortenedLink(data);
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortenedLink) return;

    try {
      await navigator.clipboard.writeText(shortenedLink.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement("textarea");
      textArea.value = shortenedLink.shortUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !loading) {
      handleShorten();
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl border border-[var(--border)] p-6">
      <div className="space-y-4">
        {/* URL Input */}
        <div className="flex items-center gap-2 p-3 bg-[var(--border)]/50 rounded-lg focus-within:ring-2 focus-within:ring-[var(--primary)] focus-within:ring-offset-1 transition-all">
          <span className="text-sm text-[var(--muted)]">https://</span>
          <input
            type="text"
            placeholder="paste your long URL here"
            className="flex-1 bg-transparent outline-none text-sm"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {/* Shortened Link Result */}
        {shortenedLink ? (
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-[var(--primary-pale)] rounded-lg flex items-center justify-between">
              <span className="text-sm font-medium text-[var(--primary)] truncate">
                {shortenedLink.shortUrl}
              </span>
              <a
                href={shortenedLink.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-[var(--primary)] hover:text-[var(--primary-dark)]"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
            <Button
              size="sm"
              onClick={handleCopy}
              variant={copied ? "secondary" : "default"}
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-1" />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-1" />
                  Copy
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex-1 p-3 bg-[var(--primary-pale)] rounded-lg">
              <span className="text-sm font-medium text-[var(--primary)]">
                lnk.fg/your-brand
              </span>
            </div>
            <Button size="sm" onClick={handleShorten} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                  Shortening...
                </>
              ) : (
                "Shorten"
              )}
            </Button>
          </div>
        )}

        {/* Create Another Link */}
        {shortenedLink && (
          <button
            onClick={() => setShortenedLink(null)}
            className="text-sm text-[var(--primary)] hover:underline"
          >
            Shorten another URL
          </button>
        )}
      </div>
    </div>
  );
}
