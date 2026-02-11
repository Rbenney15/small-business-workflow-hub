"use server";

import { prisma } from "@/lib/prisma";
import { generateInvoiceNumber } from "@/lib/invoiceNumber";
import { redirect } from "next/navigation";

export async function createInvoiceForJob(jobId: string) {
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    select: { id: true, clientId: true, invoice: { select: { id: true } } },
  });

  if (!job) {
    throw new Error("Job not found.");
  }

  if (job.invoice) {
    // Invoice already exists (MVP rule: 1 invoice per job)
    redirect(`/invoices/${job.invoice.id}`);
  }

  const invoiceNumber = await generateInvoiceNumber();

  const invoice = await prisma.invoice.create({
    data: {
      jobId: job.id,
      clientId: job.clientId,
      invoiceNumber,
      status: "DRAFT",
      subtotalCents: 0,
      totalCents: 0,
    },
    select: { id: true },
  });

  redirect(`/invoices/${invoice.id}`);
}
