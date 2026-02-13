import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { jobs: true, invoices: true } },
    },
  });

  return (
    <main className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Clients</h1>
          <p className="text-sm text-gray-600">
            Manage client info and view related jobs and invoices.
          </p>
        </div>

        <Link
          href="/clients/new"
          className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
        >
          New Client
        </Link>
      </header>

      <section className="rounded-xl border bg-white overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-100 px-4 py-3 text-xs font-semibold text-gray-700">
          <div className="col-span-5">Client</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2 text-right">Jobs</div>
          <div className="col-span-2 text-right">Invoices</div>
        </div>

        {clients.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">No clients yet.</div>
        ) : (
          <ul>
            {clients.map((c) => (
              <li key={c.id} className="border-t">
                <Link
                  href={`/clients/${c.id}`}
                  className="grid grid-cols-12 px-4 py-3 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
                >
                  <div className="col-span-5">
                    <div className="font-medium text-gray-900">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.status}</div>
                  </div>

                  <div className="col-span-3 text-sm text-gray-700">
                    {c.primaryContactName ?? "—"}
                  </div>

                  <div className="col-span-2 text-right text-sm text-gray-900">
                    {c._count.jobs}
                  </div>

                  <div className="col-span-2 text-right text-sm text-gray-900">
                    {c._count.invoices}
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
