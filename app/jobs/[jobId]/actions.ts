"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function cycleTaskStatus(jobId: string, taskId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true, status: true, jobId: true },
  });

  if (!task) throw new Error("Task not found.");
  if (task.jobId !== jobId) throw new Error("Task does not belong to this job.");

  const next =
    task.status === "TODO"
      ? "DOING"
      : task.status === "DOING"
      ? "DONE"
      : "TODO";

  await prisma.task.update({
    where: { id: taskId },
    data: {
      status: next as any,
      completedAt: next === "DONE" ? new Date() : null,
    },
  });

  redirect(`/jobs/${jobId}`);
}
