"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateClient(clientId: string, formData: FormData) {
  const name = (formData.get("name") ?? "").toString().trim();
  const status = (formData.get("status") ?? "ACTIVE").toString().trim();

  const primaryContactName = (formData.get("primaryContactName") ?? "")
    .toString()
    .trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const phone = (formData.get("phone") ?? "").toString().trim();
  const address = (formData.get("address") ?? "").toString().trim();
  const notes = (formData.get("notes") ?? "").toString().trim();

  if (!name) {
    throw new Error("Client name is required.");
  }

  // Safety check
  const existing = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true },
  });

  if (!existing) {
    throw new Error("Client not found.");
  }

  await prisma.client.update({
    where: { id: clientId },
    data: {
      name,
      status: status as any, // ACTIVE | ARCHIVED (or whatever your enum supports)
      primaryContactName: primaryContactName || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      notes: notes || null,
    },
  });

  redirect(`/clients/${clientId}`);
}
