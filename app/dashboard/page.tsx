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
    <main className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <section className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500">Total Tasks</div>
          <div className="text-3xl font-semibold">{taskCount}</div>
        </div>

        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-2">Jobs by Status</div>
          <ul className="space-y-1">
            {jobsByStatus.map((row) => (
              <li key={row.status} className="flex justify-between text-sm">
                <span>{row.status}</span>
                <span className="font-medium">{row._count._all}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border p-4">
          <div className="text-sm text-gray-500 mb-2">Invoices by Status</div>
          <ul className="space-y-1">
            {invoicesByStatus.length === 0 ? (
              <li className="text-sm text-gray-400">No invoices yet</li>
            ) : (
              invoicesByStatus.map((row) => (
                <li key={row.status} className="flex justify-between text-sm">
                  <span>{row.status}</span>
                  <span className="font-medium">{row._count._all}</span>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
