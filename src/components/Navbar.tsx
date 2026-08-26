"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/" });
  };

  return (
    <nav className="bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="font-semibold text-white">ADAM</span>
          </Link>

          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm text-gray-300 hover:text-white"
                >
                  Dashboard
                </Link>
                <div className="flex items-center gap-3">
                  <div className="text-sm">
                    <span className="text-gray-400">
                      {session.user.name}
                    </span>
                    {session.user.role === "ADMIN" && (
                      <span className="ml-2 px-2 py-0.5 bg-orange-500 text-white rounded-full text-xs font-medium">
                        Admin
                      </span>
                    )}
                  </div>
                  <button
                    onClick={handleSignOut}
                    disabled={loading}
                    className="text-sm text-gray-400 hover:text-white disabled:opacity-50"
                  >
                    {loading ? "Signing out..." : "Sign out"}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="text-sm text-gray-300 hover:text-white"
                >
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
