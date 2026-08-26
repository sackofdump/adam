import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";

  if (!q) return NextResponse.json({ workflows: [], articles: [] });

  const [workflows, articles] = await Promise.all([
    prisma.workflow.findMany({
      where: {
        companyId: session.user.companyId,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
          { steps: { some: { title: { contains: q, mode: "insensitive" } } } },
          { steps: { some: { content: { contains: q, mode: "insensitive" } } } },
        ],
      },
      include: { steps: { orderBy: { order: "asc" } } },
    }),
    prisma.knowledgeArticle.findMany({
      where: {
        companyId: session.user.companyId,
        OR: [
          { title: { contains: q, mode: "insensitive" } },
          { content: { contains: q, mode: "insensitive" } },
        ],
      },
    }),
  ]);

  return NextResponse.json({ workflows, articles });
}
