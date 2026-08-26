import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { ArticleEditor } from "@/components/ArticleEditor";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;

  const article = await prisma.knowledgeArticle.findFirst({
    where: { id, companyId: session.user.companyId },
  });

  if (!article) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Edit Article</h1>
            <p className="text-gray-500 mt-1">{article.title}</p>
          </div>
          <ArticleEditor
            initialTitle={article.title}
            initialContent={article.content}
            initialCategory={article.category}
            articleId={article.id}
          />
        </div>
      </main>
    </div>
  );
}
