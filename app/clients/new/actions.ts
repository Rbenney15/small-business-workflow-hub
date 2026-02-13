"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function createClient(formData: FormData) {
  const name = (formData.get("name") ?? "").toString().trim();
  const primaryContactName = (formData.get("primaryContactName") ?? "").toString().trim();
  const email = (formData.get("email") ?? "").toString().trim();
  const phone = (formData.get("phone") ?? "").toString().trim();
  const address = (formData.get("address") ?? "").toString().trim();
  const notes = (formData.get("notes") ?? "").toString().trim();

  if (!name) {
    throw new Error("Client name is required.");
  }

  const client = await prisma.client.create({
    data: {
      name,
      status: "ACTIVE",
      primaryContactName: primaryContactName || null,
      email: email || null,
      phone: phone || null,
      address: address || null,
      notes: notes || null,
    },
    select: { id: true },
  });

  redirect(`/clients/${client.id}`);
}
