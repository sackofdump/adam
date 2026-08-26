import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/Navbar";
import { WorkflowEditor } from "@/components/WorkflowEditor";

export default async function EditWorkflowPage({ params }: PageProps<"/workflows/[id]/edit">) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");
  if (session.user.role !== "ADMIN") redirect("/dashboard");

  const { id } = await params;

  const workflow = await prisma.workflow.findFirst({
    where: { id, companyId: session.user.companyId },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  if (!workflow) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Edit workflow</h1>
            <p className="text-gray-500 mt-1">
              Update &ldquo;{workflow.title}&rdquo; and its steps
            </p>
          </div>

          <WorkflowEditor
            initialTitle={workflow.title}
            initialDescription={workflow.description || ""}
            initialSteps={workflow.steps}
            workflowId={workflow.id}
          />
        </div>
      </main>
    </div>
  );
}
