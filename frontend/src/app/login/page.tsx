"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    localStorage.setItem("prelegal_logged_in", "true");
    router.push("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-dark-navy">Prelegal</h1>
        <p className="mb-6 text-sm text-gray-text">
          Sign in to access the platform
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter any password"
              className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-primary focus:ring-1 focus:ring-blue-primary focus:outline-none"
            />
          </label>

          <button
            type="submit"
            className="mt-2 rounded-md bg-purple-secondary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:opacity-90"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
