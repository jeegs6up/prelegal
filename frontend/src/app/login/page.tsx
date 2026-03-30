"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const endpoint =
        mode === "signin" ? "/api/auth/signin" : "/api/auth/signup";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.detail || "Something went wrong");
        return;
      }

      router.push("/");
    } catch {
      setError("Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-dark-navy">Prelegal</h1>
          <p className="mt-2 text-sm text-gray-text">
            Draft legal agreements with AI assistance
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => {
                setMode("signin");
                setError("");
              }}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "border-b-2 border-blue-primary text-blue-primary"
                  : "text-gray-text hover:text-dark-navy"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className={`flex-1 py-3 text-center text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "border-b-2 border-blue-primary text-blue-primary"
                  : "text-gray-text hover:text-dark-navy"
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
            {error && (
              <div className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </div>
            )}

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-dark-navy">Email</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
              />
            </label>

            <label className="flex flex-col gap-1">
              <span className="text-sm font-medium text-dark-navy">
                Password
              </span>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={
                  mode === "signup" ? "Min 6 characters" : "Enter password"
                }
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
              />
            </label>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-md bg-purple-secondary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90 disabled:opacity-50"
            >
              {loading
                ? "Please wait..."
                : mode === "signin"
                  ? "Sign In"
                  : "Create Account"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-text">
          Documents generated are drafts and subject to legal review.
        </p>
      </div>
    </div>
  );
}
