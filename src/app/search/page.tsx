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
                className="flex-1 px-5 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 text-base bg-white dark:bg-gray-700"
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
            <p className="text-gray-400 dark:text-gray-500 text-center py-10">Searching...</p>
          )}

          {!loading && searched && (
            <>
              <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
                {total === 0
                  ? `No results for "${initialQ}"`
                  : `${total} result${total === 1 ? "" : "s"} for "${initialQ}"`}
              </p>

              {workflows.length > 0 && (
                <div className="mb-8">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                    Workflows
                  </h2>
                  <div className="space-y-3">
                    {workflows.map((w) => {
                      const q = initialQ.toLowerCase();
                      const matchingSteps = w.steps.filter(
                        (s) =>
                          s.title.toLowerCase().includes(q) ||
                          s.content.toLowerCase().includes(q)
                      );
                      return (
                        <div key={w.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden hover:border-orange-300 dark:hover:border-orange-500 transition-colors">
                          <Link href={`/workflows/${w.id}`} className="block p-5">
                            <div className="font-semibold text-gray-900 dark:text-white mb-1">{w.title}</div>
                            {w.description && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{w.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 dark:text-gray-500">
                              <span>{w.steps.length} steps</span>
                              {w.authorName && <span>by {w.authorName}</span>}
                            </div>
                          </Link>
                          {matchingSteps.length > 0 && (
                            <div className="border-t border-gray-100 dark:border-gray-800">
                              {matchingSteps.map((s) => {
                                const idx = s.content.toLowerCase().indexOf(q);
                                const snippet = idx >= 0
                                  ? s.content.slice(Math.max(0, idx - 40), idx + 120).trim()
                                  : s.content.slice(0, 160).trim();
                                return (
                                  <Link
                                    key={s.id}
                                    href={`/workflows/${w.id}`}
                                    className="flex items-start gap-3 px-5 py-3 bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors border-b border-orange-100 dark:border-orange-900/30 last:border-0"
                                  >
                                    <span className="shrink-0 mt-0.5 text-xs font-bold text-orange-500 bg-white dark:bg-gray-800 border border-orange-200 dark:border-orange-700 rounded-full w-5 h-5 flex items-center justify-center">
                                      {s.order + 1}
                                    </span>
                                    <div>
                                      <div className="text-xs font-semibold text-orange-700 dark:text-orange-400 mb-0.5">{s.title}</div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">...{snippet}...</p>
                                    </div>
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {articles.length > 0 && (
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-3">
                    Knowledge Articles
                  </h2>
                  <div className="space-y-3">
                    {articles.map((a) => {
                      const meta = CATEGORY_META[a.category] ?? CATEGORY_META.GENERAL;
                      return (
                        <Link
                          key={a.id}
                          href={`/articles/${a.id}`}
                          className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-orange-300 dark:hover:border-orange-500 transition-colors"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>
                              {meta.label}
                            </span>
                          </div>
                          <div className="font-semibold text-gray-900 dark:text-white mb-1">{a.title}</div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{a.content}</p>
                          {a.authorName && (
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">by {a.authorName}</p>
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {total === 0 && (
                <div className="text-center py-16 text-gray-400 dark:text-gray-500">
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
