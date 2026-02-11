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
    <main className="p-6 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-sm text-gray-500">
            Manage client info and view related jobs/invoices.
          </p>
        </div>

        <Link
          href="/clients/new"
          className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          New Client
        </Link>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-medium text-gray-600">
          <div className="col-span-5">Client</div>
          <div className="col-span-3">Contact</div>
          <div className="col-span-2 text-right">Jobs</div>
          <div className="col-span-2 text-right">Invoices</div>
        </div>

        {clients.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No clients yet.</div>
        ) : (
          <ul>
            {clients.map((c) => (
              <li key={c.id} className="border-t">
                <Link
                  href={`/clients/${c.id}`}
                  className="grid grid-cols-12 px-4 py-3 hover:bg-gray-50"
                >
                  <div className="col-span-5">
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-gray-500">{c.status}</div>
                  </div>

                  <div className="col-span-3 text-sm text-gray-700">
                    {c.primaryContactName ?? "—"}
                  </div>

                  <div className="col-span-2 text-right text-sm">
                    {c._count.jobs}
                  </div>

                  <div className="col-span-2 text-right text-sm">
                    {c._count.invoices}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
