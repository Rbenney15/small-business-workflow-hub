import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ invoiceId: string }>;
}) {
  const { invoiceId } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id: invoiceId },
    include: {
      client: true,
      job: true,
      items: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!invoice) return notFound();

  return (
    <main className="p-6 space-y-6">
      <div className="text-sm text-gray-500">
        <Link href={`/jobs/${invoice.jobId}`} className="hover:underline">
          Job
        </Link>{" "}
        / Invoice
      </div>

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">{invoice.invoiceNumber}</h1>
          <p className="text-sm text-gray-600">{invoice.status}</p>
        </div>

        <Link
          href={`/jobs/${invoice.jobId}`}
          className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          Back to Job
        </Link>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4 md:col-span-2 space-y-2">
          <div className="text-sm text-gray-500">Client</div>
          <div className="font-medium">{invoice.client.name}</div>
          <div className="text-sm text-gray-600">Job: {invoice.job.title}</div>
        </div>

        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Total</div>
          <div className="text-2xl font-semibold">
            {dollars(invoice.totalCents)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Subtotal: {dollars(invoice.subtotalCents)}
          </div>
        </div>
      </section>

      <section className="rounded-xl border overflow-hidden">
        <div className="bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
          Line Items
        </div>

        {invoice.items.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No line items yet.</div>
        ) : (
          <ul>
            {invoice.items.map((it) => (
              <li key={it.id} className="border-t px-4 py-3">
                <div className="flex justify-between gap-4">
                  <div>
                    <div className="font-medium">{it.description}</div>
                    <div className="text-xs text-gray-500">
                      Qty: {it.quantity} • Unit: {dollars(it.unitPriceCents)}
                    </div>
                  </div>
                  <div className="font-semibold">
                    {dollars(it.lineTotalCents)}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-gray-400">
        Next step: we’ll add “Add line item” + auto-recalc totals.
      </p>
    </main>
  );
}
