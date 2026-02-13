import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  addLineItem,
  deleteLineItem,
  setInvoiceStatus,
} from "./actions";

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const btnPrimary =
  "inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20";

const btnSecondary =
  "inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10";

const btnSmall =
  "inline-flex items-center rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10";

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
    <main className="space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <div className="text-sm text-gray-500">
          <Link href={`/jobs/${invoice.jobId}`} className="hover:underline">
            Job
          </Link>{" "}
          / Invoice
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {invoice.invoiceNumber}
            </h1>

            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className="text-gray-600">Status:</span>
              <span
                className={`inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold ${
                  invoice.status === "PAID"
                    ? "bg-green-50 text-green-800 border-green-200"
                    : invoice.status === "SENT"
                    ? "bg-blue-50 text-blue-800 border-blue-200"
                    : "bg-gray-50 text-gray-800 border-gray-200"
                }`}
              >
                {invoice.status}
              </span>
            </div>

            {/* Status Buttons */}
            <div
              className="mt-3 flex flex-wrap gap-2"
              aria-label="Invoice status actions"
            >
              {(["DRAFT", "SENT", "PAID"] as const).map((status) => {
                const isActive = invoice.status === status;

                return (
                  <form
                    key={status}
                    action={async () => {
                      "use server";
                      await setInvoiceStatus(invoice.id, status);
                    }}
                  >
                    <button
                      className={
                        isActive
                          ? "inline-flex items-center rounded-lg bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
                          : btnSmall
                      }
                      aria-pressed={isActive}
                    >
                      Mark {status}
                    </button>
                  </form>
                );
              })}
            </div>
          </div>

          <Link href={`/jobs/${invoice.jobId}`} className={btnSecondary}>
            Back to Job
          </Link>
        </div>
      </header>

      {/* Summary Cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 md:col-span-2 space-y-2">
          <div className="text-sm text-gray-600">Client</div>
          <div className="font-medium text-gray-900">
            {invoice.client.name}
          </div>
          <div className="text-sm text-gray-600">
            Job: {invoice.job.title}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-600">Total</div>
          <div className="mt-1 text-2xl font-semibold text-gray-900">
            {dollars(invoice.totalCents)}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            Subtotal: {dollars(invoice.subtotalCents)}
          </div>
        </div>
      </section>

      {/* Line Items */}
      <section className="rounded-xl border bg-white overflow-hidden">
        <div className="bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-800">
          Line Items
        </div>

        {invoice.items.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">
            No line items yet.
          </div>
        ) : (
          <ul>
            {invoice.items.map((item) => (
              <li key={item.id} className="border-t px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {item.description}
                    </div>
                    <div className="text-xs text-gray-500">
                      Qty: {item.quantity} • Unit:{" "}
                      {dollars(item.unitPriceCents)}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="font-semibold text-gray-900">
                      {dollars(item.lineTotalCents)}
                    </div>

                    <form
                      action={async () => {
                        "use server";
                        await deleteLineItem(invoice.id, item.id);
                      }}
                    >
                      <button className={btnSmall}>Delete</button>
                    </form>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Totals Row */}
        <div className="border-t bg-white px-4 py-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-700">Subtotal</span>
            <span className="font-medium text-gray-900">
              {dollars(invoice.subtotalCents)}
            </span>
          </div>
          <div className="mt-1 flex justify-between">
            <span className="text-gray-700">Total</span>
            <span className="font-semibold text-gray-900">
              {dollars(invoice.totalCents)}
            </span>
          </div>
        </div>
      </section>

      {/* Add Line Item */}
      <section className="rounded-xl border bg-white p-4 space-y-4">
        <h2 className="font-semibold text-gray-900">Add Line Item</h2>

        <form
          action={async (formData) => {
            "use server";
            await addLineItem(invoice.id, formData);
          }}
          className="grid gap-3 md:grid-cols-12"
        >
          <div className="md:col-span-6">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Description
            </label>
            <input
              name="description"
              required
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              placeholder="e.g., Labor — installation"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Qty
            </label>
            <input
              name="quantity"
              defaultValue={1}
              inputMode="numeric"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Unit Price ($)
            </label>
            <input
              name="unitPrice"
              placeholder="0.00"
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
            />
          </div>

          <div className="md:col-span-1 flex items-end">
            <button className={btnPrimary}>Add</button>
          </div>
        </form>

        <p className="text-xs text-gray-500">
          Tip: Use 12.50 for $12.50.
        </p>
      </section>
    </main>
  );
}
