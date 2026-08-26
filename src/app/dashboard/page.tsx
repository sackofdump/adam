import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { DashboardTabs } from "@/components/DashboardTabs";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const [workflows, articles, company] = await Promise.all([
    prisma.workflow.findMany({
      where: { companyId: session.user.companyId },
      include: { steps: { orderBy: { order: "asc" } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.knowledgeArticle.findMany({
      where: { companyId: session.user.companyId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.company.findUnique({
      where: { id: session.user.companyId },
    }),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Knowledge Hub</h1>
            <p className="text-gray-500 mt-1">
              {company?.name} &mdash; Workflows and knowledge captured for your team
            </p>
          </div>

          <DashboardTabs
            workflows={workflows}
            articles={articles}
            role={session.user.role}
          />
        </div>
      </main>
    </div>
  );
}
