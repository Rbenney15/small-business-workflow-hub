import Link from "next/link";
import { prisma } from "@/lib/prisma";

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true, job: true },
  });

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Invoices</h1>
        <p className="text-sm text-gray-600">
          View invoices and their current status.
        </p>
      </header>

      <section className="rounded-xl border bg-white overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-100 px-4 py-3 text-xs font-semibold text-gray-700">
          <div className="col-span-4">Invoice</div>
          <div className="col-span-4">Client</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {invoices.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">No invoices yet.</div>
        ) : (
          <ul>
            {invoices.map((inv) => (
              <li key={inv.id} className="border-t">
                <Link
                  href={`/invoices/${inv.id}`}
                  className="grid grid-cols-12 px-4 py-3 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
                >
                  <div className="col-span-4">
                    <div className="font-medium text-gray-900">
                      {inv.invoiceNumber}
                    </div>
                    <div className="text-xs text-gray-500">
                      Job: {inv.job.title}
                    </div>
                  </div>

                  <div className="col-span-4 text-sm text-gray-700">
                    {inv.client.name}
                  </div>

                  <div className="col-span-2 text-right text-sm font-medium text-gray-900">
                    {dollars(inv.totalCents)}
                  </div>

                  <div className="col-span-2 text-right text-sm text-gray-700">
                    {inv.status}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
