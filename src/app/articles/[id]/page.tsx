import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

const CATEGORY_META: Record<string, { label: string; color: string; bg: string }> = {
  PROCESS:  { label: "Process",            color: "text-blue-700",   bg: "bg-blue-50 border-blue-200" },
  DECISION: { label: "Decision Guide",     color: "text-purple-700", bg: "bg-purple-50 border-purple-200" },
  CONTACTS: { label: "Contacts & Vendors", color: "text-green-700",  bg: "bg-green-50 border-green-200" },
  WARNING:  { label: "Watch Out",          color: "text-amber-700",  bg: "bg-amber-50 border-amber-200" },
  GENERAL:  { label: "General",            color: "text-gray-600",   bg: "bg-gray-50 border-gray-200" },
};

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const { id } = await params;

  const article = await prisma.knowledgeArticle.findFirst({
    where: { id, companyId: session.user.companyId },
  });

  if (!article) notFound();

  const meta = CATEGORY_META[article.category] ?? CATEGORY_META.GENERAL;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 flex items-center gap-1"
            >
              ← Back to Knowledge Hub
            </Link>
          </div>

          <div className={`rounded-2xl border p-6 mb-6 ${meta.bg}`}>
            <span className={`text-xs font-bold uppercase tracking-wide ${meta.color}`}>
              {meta.label}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{article.title}</h1>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              {article.authorName && (
                <span className="flex items-center gap-1.5">
                  <span className="inline-flex w-6 h-6 rounded-full bg-white text-orange-700 text-xs font-bold items-center justify-center border border-orange-200">
                    {article.authorName.charAt(0).toUpperCase()}
                  </span>
                  Documented by <strong className="text-gray-700 dark:text-gray-200">{article.authorName}</strong>
                </span>
              )}
              <span>
                Last updated{" "}
                {new Date(article.updatedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-8">
            <div className="prose prose-gray max-w-none">
              {article.content.split("\n").map((line, i) =>
                line.trim() === "" ? (
                  <br key={i} />
                ) : (
                  <p key={i} className="text-gray-700 dark:text-gray-200 leading-relaxed mb-4">
                    {line}
                  </p>
                )
              )}
            </div>
          </div>

          {session.user.role === "ADMIN" && (
            <div className="mt-6 flex justify-end">
              <Link
                href={`/articles/${article.id}/edit`}
                className="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Edit article
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
