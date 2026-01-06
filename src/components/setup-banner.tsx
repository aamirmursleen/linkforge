"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Database, ExternalLink, CheckCircle2 } from "lucide-react";

interface SetupStatus {
  status: string;
  database: boolean;
  urlConfigured?: boolean;
  message: string;
  setup?: {
    steps: string[];
    alternative: string;
  };
}

export function SetupBanner() {
  const [status, setStatus] = useState<SetupStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch(() => {
        setStatus({
          status: "error",
          database: false,
          message: "Could not check system status",
        });
        setLoading(false);
      });
  }, []);

  if (loading || !status || status.database || dismissed) {
    return null;
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
          <Database className="h-6 w-6 text-amber-600" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Database Setup Required
            </h3>
            <button
              onClick={() => setDismissed(true)}
              className="text-amber-600 hover:text-amber-800 text-sm"
            >
              Dismiss
            </button>
          </div>
          <p className="text-amber-700 mt-1 mb-4">
            To start creating and tracking links, you need to connect a PostgreSQL database.
          </p>

          {status.setup && (
            <div className="space-y-4">
              <div className="bg-white rounded-lg p-4 border border-amber-200">
                <h4 className="font-medium text-amber-800 mb-3">Quick Setup (Recommended)</h4>
                <ol className="space-y-2">
                  {status.setup.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-amber-700">
                      <span className="h-5 w-5 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <p className="text-sm text-amber-600">
                {status.setup.alternative}
              </p>

              <div className="flex gap-3">
                <a
                  href="https://vercel.com/dashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors text-sm font-medium"
                >
                  Open Vercel Dashboard
                  <ExternalLink className="h-4 w-4" />
                </a>
                <a
                  href="https://neon.tech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-white text-amber-700 border border-amber-300 rounded-lg hover:bg-amber-50 transition-colors text-sm font-medium"
                >
                  Try Neon (Free)
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function DatabaseStatus() {
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/status")
      .then((res) => res.json())
      .then((data) => setConnected(data.database))
      .catch(() => setConnected(false));
  }, []);

  if (connected === null) return null;

  return (
    <div className={`flex items-center gap-2 text-sm ${connected ? "text-green-600" : "text-amber-600"}`}>
      {connected ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          Database Connected
        </>
      ) : (
        <>
          <AlertTriangle className="h-4 w-4" />
          Database Not Configured
        </>
      )}
    </div>
  );
}
