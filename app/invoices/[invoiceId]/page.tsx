import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { addLineItem, deleteLineItem } from "./actions";

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
          <div className="text-2xl font-semibold">{dollars(invoice.totalCents)}</div>
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
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium">{it.description}</div>
                    <div className="text-xs text-gray-500">
                      Qty: {it.quantity} • Unit: {dollars(it.unitPriceCents)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="font-semibold">{dollars(it.lineTotalCents)}</div>

                    <form
                      action={async () => {
                        "use server";
                        await deleteLineItem(invoice.id, it.id);
                      }}
                    >
                      <button className="rounded-lg border px-3 py-1 text-xs font-medium hover:bg-gray-50">
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-xl border p-4 space-y-4">
        <h2 className="font-medium">Add Line Item</h2>

        <form
          action={async (formData) => {
            "use server";
            await addLineItem(invoice.id, formData);
          }}
          className="grid gap-3 md:grid-cols-12"
        >
          <div className="md:col-span-6">
            <label className="block text-xs text-gray-500 mb-1">Description</label>
            <input
              name="description"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm"
              placeholder="e.g., Labor — installation"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">Qty</label>
            <input
              name="quantity"
              defaultValue={1}
              inputMode="numeric"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs text-gray-500 mb-1">Unit Price ($)</label>
            <input
              name="unitPrice"
              placeholder="0.00"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-1 flex items-end">
            <button className="w-full rounded-lg bg-black px-3 py-2 text-sm font-medium text-white">
              Add
            </button>
          </div>
        </form>
      </section>
    </main>
  );
}
