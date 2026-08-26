import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { GuidedWorkflow } from "@/components/GuidedWorkflow";

export default async function WorkflowViewPage({ params }: PageProps<"/workflows/[id]">) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  const { id } = await params;

  const workflow = await prisma.workflow.findFirst({
    where: { id, companyId: session.user.companyId },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  if (!workflow) notFound();

  if (workflow.steps.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 py-10 px-4">
          <div className="max-w-4xl mx-auto text-center py-20">
            <div className="text-5xl mb-4">📋</div>
            <h2 className="text-xl font-semibold text-gray-700">
              This workflow has no steps yet.
            </h2>
            <p className="text-gray-400 mt-2">Ask an admin to add steps.</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <GuidedWorkflow workflow={workflow} />
        </div>
      </main>
    </div>
  );
}
