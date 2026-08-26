"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/ThemeProvider";

export function Navbar() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <nav className="bg-gray-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex items-center h-16 gap-4">
          <Link href={session ? "/dashboard" : "/"} className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className="font-semibold text-white">Village</span>
          </Link>

          {session && (
            <form onSubmit={handleSearch} className="flex-1 max-w-sm">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search anything..."
                className="w-full px-4 py-1.5 bg-gray-800 text-gray-200 placeholder-gray-500 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 border border-gray-700"
              />
            </form>
          )}

          <div className="flex items-center gap-4 ml-auto">
            {session ? (
              <>
                <div className="flex items-center gap-3 text-sm">
                  <span className="text-gray-400">{session.user.name}</span>
                  {session.user.role === "ADMIN" && (
                    <span className="px-2 py-0.5 bg-orange-500 text-white rounded-full text-xs font-medium">
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                  className="text-lg text-gray-400 hover:text-white transition-colors"
                >
                  {theme === "dark" ? "☀️" : "🌙"}
                </button>
                <button
                  onClick={handleSignOut}
                  disabled={loading}
                  className="text-sm text-gray-400 hover:text-white disabled:opacity-50"
                >
                  {loading ? "Signing out..." : "Sign out"}
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={toggleTheme}
                  aria-label="Toggle dark mode"
                  className="text-lg text-gray-400 hover:text-white transition-colors"
                >
                  {theme === "dark" ? "☀️" : "🌙"}
                </button>
                <Link href="/auth/signin" className="text-sm text-gray-300 hover:text-white">
                  Sign in
                </Link>
                <Link
                  href="/auth/signup"
                  className="text-sm bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
