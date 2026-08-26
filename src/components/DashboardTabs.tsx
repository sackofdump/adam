"use client";

import { useState } from "react";
import Link from "next/link";
import { WorkflowList } from "@/components/WorkflowList";
import { ArticleList } from "@/components/ArticleList";

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

interface Article {
  id: string;
  title: string;
  content: string;
  category: string;
  authorName: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface DashboardTabsProps {
  workflows: Workflow[];
  articles: Article[];
  role: string;
}

type Tab = "workflows" | "knowledge";

export function DashboardTabs({ workflows, articles, role }: DashboardTabsProps) {
  const [tab, setTab] = useState<Tab>("workflows");

  return (
    <div>
      {/* Tab bar + action button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-xl">
          <button
            onClick={() => setTab("workflows")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "workflows"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            Workflows
            <span className="ml-2 text-xs font-semibold text-gray-400 dark:text-gray-500">
              {workflows.length}
            </span>
          </button>
          <button
            onClick={() => setTab("knowledge")}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === "knowledge"
                ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            }`}
          >
            Knowledge Base
            <span className="ml-2 text-xs font-semibold text-gray-400 dark:text-gray-500">
              {articles.length}
            </span>
          </button>
        </div>

        <Link
          href={tab === "workflows" ? "/workflows/new" : "/articles/new"}
          className="bg-orange-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-orange-600 transition-colors text-sm"
        >
          {tab === "workflows" ? "+ New Workflow" : "+ New Article"}
        </Link>
      </div>

      {tab === "workflows" ? (
        <WorkflowList workflows={workflows} role={role} />
      ) : (
        <ArticleList articles={articles} role={role} />
      )}
    </div>
  );
}
