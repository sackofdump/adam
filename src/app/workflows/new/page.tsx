import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { WorkflowEditor } from "@/components/WorkflowEditor";

export default async function NewWorkflowPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/signin");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Create new workflow
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Build a step-by-step training workflow for your team
            </p>
          </div>

          <WorkflowEditor />
        </div>
      </main>
    </div>
  );
}
