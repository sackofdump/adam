"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORY_META: Record<string, { label: string; color: string }> = {
  PROCESS:  { label: "Process",           color: "bg-blue-50 text-blue-700" },
  DECISION: { label: "Decision Guide",    color: "bg-purple-50 text-purple-700" },
  CONTACTS: { label: "Contacts & Vendors",color: "bg-green-50 text-green-700" },
  WARNING:  { label: "Watch Out",         color: "bg-amber-50 text-amber-700" },
  GENERAL:  { label: "General",           color: "bg-gray-100 text-gray-600" },
};

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface ArticleListProps {
  articles: Article[];
  role: string;
}

export function ArticleList({ articles, role }: ArticleListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setDeletingId(id);
    const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
    setDeletingId(null);
    if (res.ok) router.refresh();
    else alert("Failed to delete article.");
  };

  if (articles.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-5xl mb-4">📚</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">No articles yet</h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {role === "ADMIN"
            ? "Capture your team's knowledge before it walks out the door."
            : "Your admin hasn't published any knowledge articles yet."}
        </p>
        {role === "ADMIN" && (
          <Link
            href="/articles/new"
            className="mt-6 inline-block bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors"
          >
            Write first article
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {articles.map((article) => {
        const meta = CATEGORY_META[article.category] ?? CATEGORY_META.GENERAL;
        const preview = article.content.slice(0, 160).replace(/\n/g, " ");

        return (
          <div
            key={article.id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-orange-200 dark:hover:border-orange-500 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${meta.color}`}>
                    {meta.label}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                  {article.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">{preview}…</p>
                <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500">
                  {article.authorName && (
                    <span className="flex items-center gap-1">
                      <span className="inline-block w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold flex items-center justify-center">
                        {article.authorName.charAt(0).toUpperCase()}
                      </span>
                      {article.authorName}
                    </span>
                  )}
                  <span>
                    Updated{" "}
                    {new Date(article.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/articles/${article.id}`}
                  className="px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  Read
                </Link>
                {role === "ADMIN" && (
                  <>
                    <Link
                      href={`/articles/${article.id}/edit`}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(article.id, article.title)}
                      disabled={deletingId === article.id}
                      className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deletingId === article.id ? "..." : "Delete"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
