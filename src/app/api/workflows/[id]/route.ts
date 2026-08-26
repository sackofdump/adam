import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const workflow = await prisma.workflow.findFirst({
    where: {
      id,
      companyId: session.user.companyId,
    },
    include: { steps: { orderBy: { order: "asc" } } },
  });

  if (!workflow) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(workflow);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const { title, description, steps } = await request.json();

    const existing = await prisma.workflow.findFirst({
      where: { id, companyId: session.user.companyId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // Delete existing steps and recreate
    await prisma.step.deleteMany({ where: { workflowId: id } });

    const workflow = await prisma.workflow.update({
      where: { id },
      data: {
        title,
        description: description || null,
        steps: {
          create: (steps || []).map(
            (step: { title: string; content: string }, index: number) => ({
              title: step.title,
              content: step.content,
              order: index,
            })
          ),
        },
      },
      include: { steps: { orderBy: { order: "asc" } } },
    });

    return NextResponse.json(workflow);
  } catch (error) {
    console.error("Update workflow error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  const existing = await prisma.workflow.findFirst({
    where: { id, companyId: session.user.companyId },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.workflow.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
