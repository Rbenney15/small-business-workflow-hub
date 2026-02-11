import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createInvoiceForJob } from "./actions";

export default async function NewInvoicePage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: { client: true, invoice: true },
  });

  if (!job) return notFound();

  // If invoice already exists, send them to it
  if (job.invoice) {
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-semibold">Invoice already exists</h1>
        <p className="text-sm text-gray-600">
          This job already has an invoice.
        </p>
        <div className="flex gap-2">
          <Link
            href={`/invoices/${job.invoice.id}`}
            className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
          >
            View Invoice
          </Link>
          <Link
            href={`/jobs/${job.id}`}
            className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Back to Job
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-6">
      <div className="text-sm text-gray-500">
        <Link href={`/jobs/${job.id}`} className="hover:underline">
          Job
        </Link>{" "}
        / Create Invoice
      </div>

      <h1 className="text-2xl font-semibold">Create Invoice</h1>

      <div className="rounded-xl border p-4 space-y-2">
        <div className="text-sm text-gray-500">Client</div>
        <div className="font-medium">{job.client.name}</div>
        <div className="text-sm text-gray-600">Job: {job.title}</div>
      </div>

      <form
        action={async () => {
          "use server";
          await createInvoiceForJob(jobId);
        }}
      >
        <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">
          Create Draft Invoice
        </button>
      </form>
    </main>
  );
}
