import { prisma } from "@/lib/prisma";

/**
 * Generates invoice numbers like: INV-2026-0001
 * For MVP, we find the latest invoice number for the current year and increment.
 */
export async function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const prefix = `INV-${year}-`;

  const latest = await prisma.invoice.findFirst({
    where: { invoiceNumber: { startsWith: prefix } },
    orderBy: { createdAt: "desc" },
    select: { invoiceNumber: true },
  });

  if (!latest?.invoiceNumber) return `${prefix}0001`;

  const lastPart = latest.invoiceNumber.slice(prefix.length); // "0001"
  const lastNum = Number.parseInt(lastPart, 10);
  const nextNum = Number.isFinite(lastNum) ? lastNum + 1 : 1;

  return `${prefix}${String(nextNum).padStart(4, "0")}`;
}
