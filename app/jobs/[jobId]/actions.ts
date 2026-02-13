"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const NEXT_STATUS: Record<string, "TODO" | "DOING" | "DONE"> = {
  TODO: "DOING",
  DOING: "DONE",
  DONE: "TODO",
};

export async function cycleTaskStatus(jobId: string, taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, status: true },
  });

  if (!task) throw new Error("Task not found.");

  const next = NEXT_STATUS[task.status] ?? "TODO";

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: next,
      completedAt: next === "DONE" ? new Date() : null,
    },
  });

  redirect(`/jobs/${jobId}`);
}
