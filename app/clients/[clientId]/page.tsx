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
    <main className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-gray-500">
            <Link href="/clients" className="hover:underline">
              Clients
            </Link>{" "}
            / {client.name}
          </div>
          <h1 className="text-2xl font-semibold">{client.name}</h1>
          <p className="text-sm text-gray-600">{client.status}</p>
        </div>

        <Link
          href={`/jobs/new?clientId=${client.id}`}
          className="inline-flex items-center rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
        >
          New Job
        </Link>
      </div>

      {/* Client Info + Stats */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border p-4 md:col-span-2">
          <h2 className="font-medium mb-3">Client Info</h2>

          <div className="grid gap-3 text-sm">
            <div>
              <div className="text-xs text-gray-500">Primary Contact</div>
              <div>{client.primaryContactName ?? "—"}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Email</div>
              <div>{client.email ?? "—"}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Phone</div>
              <div>{client.phone ?? "—"}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Address</div>
              <div>{client.address ?? "—"}</div>
            </div>

            <div>
              <div className="text-xs text-gray-500">Notes</div>
              <div className="whitespace-pre-wrap">
                {client.notes ?? "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border p-4">
          <h2 className="font-medium mb-3">Quick Stats</h2>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span>Jobs</span>
              <span className="font-medium">{client.jobs.length}</span>
            </li>
            <li className="flex justify-between">
              <span>Invoices</span>
              <span className="font-medium">{client.invoices.length}</span>
            </li>
          </ul>
        </div>
      </section>

      {/* Jobs List */}
      <section className="rounded-xl border overflow-hidden">
        <div className="flex items-center justify-between bg-gray-50 px-4 py-3">
          <h2 className="text-sm font-medium text-gray-700">Jobs</h2>
          <div className="text-xs text-gray-500">
            {client.jobs.length} total
          </div>
        </div>

        {client.jobs.length === 0 ? (
          <div className="p-4 text-sm text-gray-500">No jobs yet.</div>
        ) : (
          <ul>
            {client.jobs.map((job) => (
              <li key={job.id} className="border-t">
                <Link
                  href={`/jobs/${job.id}`}
                  className="block px-4 py-3 hover:bg-gray-50"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="font-medium">{job.title}</div>
                      <div className="text-xs text-gray-500">
                        {job.status}
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {job.scheduledDate
                        ? new Date(job.scheduledDate).toLocaleDateString()
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
