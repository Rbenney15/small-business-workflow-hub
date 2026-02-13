import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const [taskCount, jobsByStatus, invoicesByStatus] = await Promise.all([
    prisma.task.count(),
    prisma.job.groupBy({
      by: ["status"],
      _count: { _all: true },
      orderBy: { status: "asc" },
    }),
    prisma.invoice.groupBy({
      by: ["status"],
      _count: { _all: true },
      orderBy: { status: "asc" },
    }),
  ]);

  return (
    <main className="space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Quick snapshot of tasks, jobs, and invoices.
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-600">Total Tasks</div>
          <div className="mt-1 text-3xl font-semibold text-gray-900">
            {taskCount}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-600 mb-3">Jobs by Status</div>

          {jobsByStatus.length === 0 ? (
            <div className="text-sm text-gray-500">No jobs yet.</div>
          ) : (
            <ul className="space-y-1">
              {jobsByStatus.map((row) => (
                <li
                  key={row.status}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{row.status}</span>
                  <span className="font-medium text-gray-900">
                    {row._count._all}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-xl border bg-white p-4">
          <div className="text-sm text-gray-600 mb-3">Invoices by Status</div>

          {invoicesByStatus.length === 0 ? (
            <div className="text-sm text-gray-500">No invoices yet.</div>
          ) : (
            <ul className="space-y-1">
              {invoicesByStatus.map((row) => (
                <li
                  key={row.status}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-gray-700">{row.status}</span>
                  <span className="font-medium text-gray-900">
                    {row._count._all}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </main>
  );
}
