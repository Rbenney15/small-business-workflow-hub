import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { cycleTaskStatus } from "./actions";

function formatDate(d: Date | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString();
}

function dollars(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

const btnPrimary =
  "inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20";

const btnSecondary =
  "inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10";

const btnSmall =
  "rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10";

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      client: true,
      assignedUser: true,
      tasks: {
        orderBy: [{ status: "asc" }, { dueDate: "asc" }, { createdAt: "desc" }],
        include: { assignedUser: true },
      },
      invoice: {
        include: { items: { orderBy: { sortOrder: "asc" } } },
      },
    },
  });

  if (!job) return notFound();

  const taskCounts = job.tasks.reduce(
    (acc, t) => {
      acc.total += 1;
      acc[t.status] = (acc[t.status] ?? 0) + 1;
      return acc;
    },
    { total: 0, TODO: 0, DOING: 0, DONE: 0 } as Record<string, number>
  );

  return (
    <main className="space-y-6">
      {/* Breadcrumb + Header */}
      <header className="space-y-2">
        <div className="text-sm text-gray-500">
          <Link href="/clients" className="hover:underline">
            Clients
          </Link>{" "}
          /{" "}
          <Link href={`/clients/${job.clientId}`} className="hover:underline">
            {job.client.name}
          </Link>{" "}
          / Job
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{job.title}</h1>
            <p className="text-sm text-gray-600">{job.status}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/jobs/${job.id}/tasks/new`} className={btnSecondary}>
              New Task
            </Link>

            {!job.invoice ? (
              <Link href={`/jobs/${job.id}/invoice/new`} className={btnPrimary}>
                Create Invoice
              </Link>
            ) : (
              <Link href={`/invoices/${job.invoice.id}`} className={btnPrimary}>
                View Invoice
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Overview cards */}
      <section className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 md:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-3">Job Details</h2>

          <div className="grid gap-3 text-sm">
            <div>
              <div className="text-xs font-medium text-gray-500">Client</div>
              <div>
                <Link
                  href={`/clients/${job.clientId}`}
                  className="font-medium text-gray-900 hover:underline"
                >
                  {job.client.name}
                </Link>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Assigned To</div>
              <div className="text-gray-900">{job.assignedUser?.name ?? "—"}</div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="text-xs font-medium text-gray-500">Scheduled Date</div>
                <div className="text-gray-900">{formatDate(job.scheduledDate)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-gray-500">Due Date</div>
                <div className="text-gray-900">{formatDate(job.dueDate)}</div>
              </div>
            </div>

            <div>
              <div className="text-xs font-medium text-gray-500">Description</div>
              <div className="whitespace-pre-wrap text-gray-900">
                {job.description ?? "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Task Summary</h2>

          <ul className="space-y-2 text-sm">
            <li className="flex justify-between">
              <span className="text-gray-700">Total</span>
              <span className="font-medium text-gray-900">{taskCounts.total}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-700">TODO</span>
              <span className="font-medium text-gray-900">{taskCounts.TODO}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-700">DOING</span>
              <span className="font-medium text-gray-900">{taskCounts.DOING}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-gray-700">DONE</span>
              <span className="font-medium text-gray-900">{taskCounts.DONE}</span>
            </li>
          </ul>

          <div className="mt-4 border-t pt-4">
            <div className="text-xs font-medium text-gray-500 mb-1">Invoice</div>
            {!job.invoice ? (
              <div className="text-sm text-gray-600">No invoice yet</div>
            ) : (
              <div className="text-sm">
                <div className="font-medium text-gray-900">
                  {job.invoice.invoiceNumber}
                </div>
                <div className="text-xs text-gray-500">{job.invoice.status}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Tasks list */}
      <section className="rounded-xl border bg-white overflow-hidden">
        <div className="flex items-center justify-between bg-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-800">Tasks</h2>
          <div className="text-xs text-gray-600">{job.tasks.length} total</div>
        </div>

        {job.tasks.length === 0 ? (
          <div className="p-4 text-sm text-gray-600">No tasks yet.</div>
        ) : (
          <ul>
            {job.tasks.map((t) => (
              <li key={t.id} className="border-t px-4 py-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-medium text-gray-900">{t.title}</div>
                    <div className="text-xs text-gray-500">
                      {t.status} • {t.priority} • Assigned:{" "}
                      {t.assignedUser?.name ?? "—"}
                      {t.dueDate ? ` • Due: ${formatDate(t.dueDate)}` : ""}
                    </div>

                    {t.notes ? (
                      <div className="mt-2 text-sm text-gray-800 whitespace-pre-wrap">
                        {t.notes}
                      </div>
                    ) : null}
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <form
                      action={async () => {
                        "use server";
                        await cycleTaskStatus(job.id, t.id);
                      }}
                    >
                      <button className={btnSmall}>Cycle Status</button>
                    </form>

                    <div className="text-xs text-gray-500">
                      {t.completedAt ? `Done: ${formatDate(t.completedAt)}` : ""}
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Invoice preview (if exists) */}
      {job.invoice ? (
        <section className="rounded-xl border bg-white overflow-hidden">
          <div className="flex items-center justify-between bg-gray-100 px-4 py-3">
            <h2 className="text-sm font-semibold text-gray-800">Invoice Preview</h2>
            <Link
              href={`/invoices/${job.invoice.id}`}
              className="text-sm font-medium text-gray-900 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10 rounded"
            >
              Open
            </Link>
          </div>

          <div className="p-4 space-y-3">
            <div className="text-sm">
              <div className="font-medium text-gray-900">
                {job.invoice.invoiceNumber}
              </div>
              <div className="text-xs text-gray-500">{job.invoice.status}</div>
            </div>

            {job.invoice.items.length === 0 ? (
              <div className="text-sm text-gray-600">No line items yet.</div>
            ) : (
              <ul className="text-sm space-y-1">
                {job.invoice.items.map((it) => (
                  <li key={it.id} className="flex justify-between">
                    <span className="text-gray-700">
                      {it.description} (x{it.quantity})
                    </span>
                    <span className="font-medium text-gray-900">
                      {dollars(it.lineTotalCents)}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t pt-3 flex justify-between text-sm">
              <span className="text-gray-700">Total</span>
              <span className="font-semibold text-gray-900">
                {dollars(job.invoice.totalCents)}
              </span>
            </div>
          </div>
        </section>
      ) : null}
    </main>
  );
}
