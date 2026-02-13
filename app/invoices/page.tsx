import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function InvoicesPage() {
  const invoices = await prisma.invoice.findMany({
    orderBy: { createdAt: "desc" },
    include: { client: true, job: true },
  });

  return (
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Invoices</h1>

      <div className="rounded-xl border overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-600">
          <div className="col-span-4">Invoice</div>
          <div className="col-span-4">Client</div>
          <div className="col-span-2 text-right">Total</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {invoices.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No invoices yet.</div>
        ) : (
          <ul>
            {invoices.map((inv) => (
              <li key={inv.id} className="border-t">
                <Link
                  href={`/invoices/${inv.id}`}
                  className="grid grid-cols-12 px-4 py-3 hover:bg-gray-50"
                >
                  <div className="col-span-4 font-medium">{inv.invoiceNumber}</div>
                  <div className="col-span-4 text-sm text-gray-700">{inv.client.name}</div>
                  <div className="col-span-2 text-right text-sm">
                    ${(inv.totalCents / 100).toFixed(2)}
                  </div>
                  <div className="col-span-2 text-right text-sm">{inv.status}</div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
