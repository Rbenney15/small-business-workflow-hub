import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    include: {
      jobs: {
        orderBy: { createdAt: "desc" },
      },
      invoices: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!client) return notFound();

  return (
    <main className="space-y-6">
      {/* Header */}
      <header className="space-y-2">
        <div className="text-sm text-gray-500">
          <Link href="/clients" className="hover:underline">
            Clients
          </Link>{" "}
          / {client.name}
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {client.name}
            </h1>
            <p className="text-sm text-gray-600">{client.status}</p>
          </div>
          <Link
            href={`/clients/${client.id}/edit`}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
          >
            Edit Client
          </Link>
          <Link
            href={`/clients/${client.id}/delete`}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
          >
            Archive / Delete
          </Link>

          <Link
            href={`/jobs/new?clientId=${client.id}`}
            className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20"
          >
            New Job
          </Link>
        </div>
      </header>

      {/* Client Info + Stats */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 md:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-3">Client Info</h2>

          <div className="grid gap-3 text-sm">
            <div>
              <div className="text-xs font-medium text-gray-500">
                Primary Contact
              </div>
              <div className="text-gray-900">{client.primaryContactName ?? "—"}</div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Email</div>
              <div className="text-gray-900">{client.email ?? "—"}</div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Phone</div>
              <div className="text-gray-900">{client.phone ?? "—"}</div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Address</div>
              <div className="text-gray-900">{client.address ?? "—"}</div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Notes</div>
              <div className="whitespace-pre-wrap text-gray-900">
                {client.notes ?? "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Quick Stats</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-700">Jobs</span>
              <span className="font-medium text-gray-900">{client.jobs.length}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-700">Invoices</span>
              <span className="font-medium text-gray-900">{client.invoices.length}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Jobs List */}
      <section className="rounded-xl border bg-white overflow-hidden">
        <div className="flex items-center justify-between bg-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-800">Jobs</h2>
          <div className="text-xs text-gray-600">{client.jobs.length} total</div>
        </div>

        {client.jobs.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">No jobs yet.</div>
        ) : (
          <ul>
            {client.jobs.map((j) => (
              <li key={j.id} className="border-t">
                <Link
                  href={`/jobs/${j.id}`}
                  className="block px-4 py-3 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium text-gray-900">{j.title}</div>
                      <div className="text-xs text-gray-500">{j.status}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {j.scheduledDate
                        ? new Date(j.scheduledDate).toLocaleDateString()
                        : "—"}
                    </div>
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
