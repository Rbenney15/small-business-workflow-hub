"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function archiveClient(clientId: string) {
  // MVP "archive" = INACTIVE
  await prisma.client.update({
    where: { id: clientId },
    data: { status: "INACTIVE" },
  });

  redirect("/clients");
}

export async function deleteClientPermanently(clientId: string) {
  const [jobCount, invoiceCount] = await Promise.all([
    prisma.job.count({ where: { clientId } }),
    prisma.invoice.count({ where: { clientId } }),
  ]);

  if (jobCount > 0 || invoiceCount > 0) {
    throw new Error(
      "Client cannot be permanently deleted because jobs and/or invoices exist. Deactivate instead."
    );
  }

  await prisma.client.delete({
    where: { id: clientId },
  });

  redirect("/clients");
}
