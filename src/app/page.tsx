import Link from "next/link";
import { Navbar } from "@/components/Navbar";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight max-w-2xl">
          Your team&apos;s knowledge,{" "}
          <span className="text-orange-500">captured and kept</span>
        </h1>
        <p className="text-xl text-gray-500 dark:text-gray-400 mb-10 max-w-lg leading-relaxed">
          When people leave, their knowledge doesn&apos;t have to. Village helps small
          teams document workflows and know-how before it walks out the door.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <Link
            href="/demo"
            className="bg-orange-500 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-orange-600 transition-colors"
          >
            Try the demo
          </Link>
          <Link
            href="/auth/signup"
            className="bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-700"
          >
            Get started free
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-3 gap-12 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Workflows</div>
            Step-by-step guides your team can follow
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Knowledge</div>
            Decisions, contacts, and lessons learned
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Attribution</div>
            Always know who documented what
          </div>
        </div>
      </main>

      <footer className="py-6 px-4 text-center text-gray-400 dark:text-gray-500 text-sm border-t border-gray-100 dark:border-gray-800">
        &copy; {new Date().getFullYear()} Village
      </footer>
    </div>
  );
}
