"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  PROCESS:  { label: "Process",            color: "bg-blue-50 text-blue-700" },
  DECISION: { label: "Decision Guide",     color: "bg-purple-50 text-purple-700" },
  CONTACTS: { label: "Contacts & Vendors", color: "bg-green-50 text-green-700" },
  WARNING:  { label: "Watch Out",          color: "bg-amber-50 text-amber-700" },
  GENERAL:  { label: "General",            color: "bg-gray-100 text-gray-600" },
};

interface Step { id: string; title: string; content: string; order: number; }
interface Workflow { id: string; title: string; description: string | null; authorName: string | null; steps: Step[]; }
interface Article { id: string; title: string; content: string; category: string; authorName: string | null; }

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setWorkflows([]); setArticles([]); setSearched(false); return; }
    setLoading(true);
    const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    setWorkflows(data.workflows ?? []);
    setArticles(data.articles ?? []);
    setLoading(false);
    setSearched(true);
  }, []);

  useEffect(() => {
    if (initialQ) doSearch(initialQ);
  }, [initialQ, doSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
    doSearch(query);
  };

  const total = workflows.length + articles.length;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search workflows, articles, steps..."
                autoFocus
                className="flex-1 px-5 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 placeholder-gray-400 text-base"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 text-white rounded-xl font-semibold hover:bg-orange-600 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {loading && (
            <p className="text-gray-400 text-center py-10">Searching...</p>
          )}

          {!loading && searched && (
            <>
              <p className="text-sm text-gray-400 mb-6">
                {total === 0
                  ? `No results for "${initialQ}"`
                  : `${total} result${total === 1 ? "" : "s"} for "${initialQ}"`}
              </p>

              {workflows.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Workflows
                  </h2>
                  <div className="space-y-3">
                    {workflows.map((w) => (
                      <Link
                        key={w.id}
                        href={`/workflows/${w.id}`}
                        className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-300 transition-colors"
                      >
                        <div className="font-semibold text-gray-900 mb-1">{w.title}</div>
                        {w.description && (
                          <p className="text-sm text-gray-500 line-clamp-1">{w.description}</p>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                          <span>{w.steps.length} steps</span>
                          {w.authorName && <span>by {w.authorName}</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {articles.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
                    Knowledge Articles
                  </h2>
                  <div className="space-y-3">
                    {articles.map((a) => {
                      const meta = CATEGORY_META[a.category] ?? CATEGORY_META.GENERAL;
                      return (
                        <Link
                          key={a.id}
                          href={`/articles/${a.id}`}
                          className="block bg-white border border-gray-200 rounded-xl p-5 hover:border-orange-300 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>
                              {meta.label}
                            </span>
                          </div>
                          <div className="font-semibold text-gray-900 mb-1">{a.title}</div>
                          <p className="text-sm text-gray-500 line-clamp-2">{a.content}</p>
                          {a.authorName && (
                            <p className="text-xs text-gray-400 mt-2">by {a.authorName}</p>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {total === 0 && (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-4xl mb-4">🔍</div>
                  <p>Nothing found. Try a different word.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
