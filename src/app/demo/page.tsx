"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function DemoPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Setting up demo...");

  useEffect(() => {
    async function startDemo() {
      try {
        setStatus("Loading demo company...");
        const res = await fetch("/api/demo", { method: "POST" });
        const { email, password } = await res.json();

        setStatus("Signing you in...");
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.ok) {
          router.push("/dashboard");
        } else {
          setStatus("Something went wrong. Try refreshing.");
        }
      } catch {
        setStatus("Something went wrong. Try refreshing.");
      }
    }

    startDemo();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center mx-auto mb-6">
          <span className="text-white font-bold text-xl">A</span>
        </div>
        <p className="text-gray-300 text-lg">{status}</p>
      </div>
    </div>
  );
}
