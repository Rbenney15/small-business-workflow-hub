"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createTaskForJob(jobId: string, formData: FormData) {
  const title = formData.get("title")?.toString() ?? "";
  const priority = formData.get("priority")?.toString() ?? "MEDIUM";
  const assignedUserId = formData.get("assignedUserId")?.toString();

  if (!title.trim()) {
    throw new Error("Title is required.");
  }

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true },
  });

  if (!job) {
    throw new Error("Job not found.");
  }

  await prisma.task.create({
    data: {
      jobId,
      title,
      priority: priority as any,
      assignedUserId: assignedUserId ?? "",
    },
  });

  redirect(`/jobs/${jobId}`);
}
