"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateJob(jobId: string, formData: FormData) {
  const clientId = (formData.get("clientId") ?? "").toString().trim();
  const title = (formData.get("title") ?? "").toString().trim();
  const description = (formData.get("description") ?? "").toString().trim();
  const assignedUserId = (formData.get("assignedUserId") ?? "").toString().trim();
  const status = (formData.get("status") ?? "").toString().trim();

  const scheduledDateRaw = (formData.get("scheduledDate") ?? "").toString().trim();
  const dueDateRaw = (formData.get("dueDate") ?? "").toString().trim();

  if (!clientId) throw new Error("Client is required.");
  if (!title) throw new Error("Job title is required.");
  if (!assignedUserId) throw new Error("Assignee is required.");
  if (!status) throw new Error("Status is required.");

  const [client, user] = await Promise.all([
    prisma.client.findUnique({ where: { id: clientId }, select: { id: true } }),
    prisma.user.findUnique({ where: { id: assignedUserId }, select: { id: true } }),
  ]);
  if (!client) throw new Error("Client not found.");
  if (!user) throw new Error("Assigned user not found.");

  const scheduledDate = scheduledDateRaw ? new Date(scheduledDateRaw) : null;
  const dueDate = dueDateRaw ? new Date(dueDateRaw) : null;

  await prisma.job.update({
    where: { id: jobId },
    data: {
      clientId,
      title,
      description: description || null,
      assignedUserId,
      status: status as any,
      scheduledDate,
      dueDate,
    },
  });

  redirect(`/jobs/${jobId}`);
}
