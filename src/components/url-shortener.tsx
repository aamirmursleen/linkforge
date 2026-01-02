"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check, Loader2, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface ShortenedLink {
  id: string;
  shortCode: string;
  longUrl: string;
  shortUrl: string;
}

export function UrlShortener() {
  const [url, setUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [showOptions, setShowOptions] = useState(false);
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

    // Validate custom code if provided
    if (customCode && !/^[a-zA-Z0-9_-]{3,20}$/.test(customCode)) {
      setError("Custom alias must be 3-20 characters (letters, numbers, hyphens, underscores only)");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: { longUrl: string; customCode?: string } = { longUrl: urlToShorten };
      if (customCode.trim()) {
        payload.customCode = customCode.trim();
      }

      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to shorten URL");
      }

      setShortenedLink(data.data);
      setUrl("");
      setCustomCode("");
      setShowOptions(false);
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

        {/* Custom Alias Toggle */}
        <button
          type="button"
          onClick={() => setShowOptions(!showOptions)}
          className="flex items-center gap-1 text-sm text-[var(--primary)] hover:text-[var(--primary-hover)] transition-colors"
        >
          {showOptions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          Custom alias (optional)
        </button>

        {/* Custom Alias Input */}
        {showOptions && (
          <div className="flex items-center gap-2 p-3 bg-[var(--primary-pale)] rounded-lg">
            <span className="text-sm text-[var(--muted)]">lnk.fg/</span>
            <input
              type="text"
              placeholder="my-custom-link"
              className="flex-1 bg-transparent outline-none text-sm text-[var(--dark)]"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              disabled={loading}
              maxLength={20}
            />
          </div>
        )}

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
