import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { ArticleEditor } from "@/components/ArticleEditor";

export default async function NewArticlePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">New Knowledge Article</h1>
            <p className="text-gray-500 mt-1">
              Capture what you know — decisions, processes, contacts, and gotchas — so it stays with the team.
            </p>
          </div>
          <ArticleEditor />
        </div>
      </main>
    </div>
  );
}
