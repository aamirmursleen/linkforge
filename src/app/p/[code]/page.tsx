"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function PasswordGatePage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/links/verify-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirect to destination
        router.push(`/r/${code}`);
      } else {
        setAttempts((prev) => prev + 1);
        setError(data.error || "Incorrect password");
        setPassword("");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isLocked = attempts >= 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center">
              <Lock className="h-8 w-8 text-indigo-600" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Protected Link
          </h1>
          <p className="text-gray-500 text-center mb-6">
            This link is password protected. Please enter the password to continue.
          </p>

          {isLocked ? (
            <div className="text-center">
              <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                <AlertCircle className="h-6 w-6 mx-auto mb-2" />
                <p className="font-medium">Too many attempts</p>
                <p className="text-sm mt-1">
                  Please wait 15 minutes before trying again.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Password Input */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-12"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                  {attempts > 0 && attempts < 5 && (
                    <span className="ml-auto text-xs">
                      {5 - attempts} attempts left
                    </span>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !password}
                className="w-full py-3 px-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Verifying...
                  </span>
                ) : (
                  "Continue"
                )}
              </button>
            </form>
          )}

          {/* Footer */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Powered by LinkForge
          </p>
        </div>
      </div>
    </div>
  );
}
