"use server";

import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

function toInt(val: FormDataEntryValue | null, fallback = 0) {
  const n = Number.parseInt((val ?? "").toString(), 10);
  return Number.isFinite(n) ? n : fallback;
}

function toCents(val: FormDataEntryValue | null) {
  const raw = (val ?? "").toString().trim();
  if (!raw) return 0;
  // allow "1200" or "12.00"
  const num = Number(raw);
  if (!Number.isFinite(num)) return 0;
  return Math.round(num * 100);
}

async function recalcInvoice(invoiceId: string) {
  const items = await prisma.invoiceLineItem.findMany({
    where: { invoiceId },
    select: { lineTotalCents: true },
  });

  const subtotal = items.reduce((sum, i) => sum + i.lineTotalCents, 0);

  await prisma.invoice.update({
    where: { id: invoiceId },
    data: {
      subtotalCents: subtotal,
      totalCents: subtotal,
    },
  });
}

export async function addLineItem(invoiceId: string, formData: FormData) {
  const description = (formData.get("description") ?? "").toString().trim();
  const quantity = toInt(formData.get("quantity"), 1);
  const unitPriceCents = toCents(formData.get("unitPrice"));

  if (!description) throw new Error("Description is required.");

  const lineTotalCents = quantity * unitPriceCents;

  // Determine next sortOrder
  const last = await prisma.invoiceLineItem.findFirst({
    where: { invoiceId },
    orderBy: { sortOrder: "desc" },
    select: { sortOrder: true },
  });

  await prisma.invoiceLineItem.create({
    data: {
      invoiceId,
      description,
      quantity,
      unitPriceCents,
      lineTotalCents,
      sortOrder: (last?.sortOrder ?? 0) + 1,
    },
  });

  await recalcInvoice(invoiceId);
  redirect(`/invoices/${invoiceId}`);
}

export async function deleteLineItem(invoiceId: string, itemId: string) {
  await prisma.invoiceLineItem.delete({
    where: { id: itemId },
  });

  await recalcInvoice(invoiceId);
  redirect(`/invoices/${invoiceId}`);
}
export async function setInvoiceStatus(
  invoiceId: string,
  status: "DRAFT" | "SENT" | "PAID"
) {
  await prisma.invoice.update({
    where: { id: invoiceId },
    data: { status },
  });

  redirect(`/invoices/${invoiceId}`);
}