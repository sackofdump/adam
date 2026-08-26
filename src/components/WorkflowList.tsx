"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Step {
  id: string;
  title: string;
  content: string;
  order: number;
}

interface Workflow {
  id: string;
  title: string;
  description: string | null;
  authorName: string | null;
  steps: Step[];
  createdAt: Date | string;
}

interface WorkflowListProps {
  workflows: Workflow[];
  role: string;
}

export function WorkflowList({ workflows, role }: WorkflowListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete workflow "${title}"? This cannot be undone.`)) return;

    setDeletingId(id);
    const res = await fetch(`/api/workflows/${id}`, { method: "DELETE" });
    setDeletingId(null);

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete workflow.");
    }
  };

  if (workflows.length === 0) {
    return (
      <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-5xl mb-4">📋</div>
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">
          No workflows yet
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {role === "ADMIN"
            ? "Create your first workflow to start training your team."
            : "Your admin hasn't created any workflows yet."}
        </p>
        {role === "ADMIN" && (
          <Link
            href="/workflows/new"
            className="mt-6 inline-block bg-orange-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-orange-700 transition-colors"
          >
            Create first workflow
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {workflows.map((workflow) => (
        <div
          key={workflow.id}
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:border-orange-200 dark:hover:border-orange-500 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1 truncate">
                {workflow.title}
              </h3>
              {workflow.description && (
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-2">
                  {workflow.description}
                </p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-400 dark:text-gray-500 flex-wrap">
                <span>
                  {workflow.steps.length}{" "}
                  {workflow.steps.length === 1 ? "step" : "steps"}
                </span>
                {workflow.authorName && (
                  <span className="flex items-center gap-1">
                    <span className="inline-flex w-5 h-5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold items-center justify-center">
                      {workflow.authorName.charAt(0).toUpperCase()}
                    </span>
                    {workflow.authorName}
                  </span>
                )}
                <span>
                  Created{" "}
                  {new Date(workflow.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/workflows/${workflow.id}`}
                className="px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 rounded-lg text-sm font-medium hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
              >
                {role === "ADMIN" ? "View" : "Start"}
              </Link>
              {role === "ADMIN" && (
                <>
                  <Link
                    href={`/workflows/${workflow.id}/edit`}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(workflow.id, workflow.title)}
                    disabled={deletingId === workflow.id}
                    className="px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {deletingId === workflow.id ? "..." : "Delete"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
