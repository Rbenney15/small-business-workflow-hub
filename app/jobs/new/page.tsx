import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createJob } from "./actions";

const btnPrimary =
  "inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20";

const btnSecondary =
  "inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10";

const inputBase =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10";

export default async function NewJobPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string }>;
}) {
  const { clientId } = await searchParams;

  const [clients, users] = await Promise.all([
    prisma.client.findMany({
      orderBy: { name: "asc" },
      // for now, include all — later add default filter to ACTIVE
    }),
    prisma.user.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <div className="text-sm text-gray-500">
          <Link href="/clients" className="hover:underline">
            Clients
          </Link>{" "}
          / New Job
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">New Job</h1>
            <p className="text-sm text-gray-600">
              Create a job and assign it to a staff member.
            </p>
          </div>

          <Link href="/clients" className={btnSecondary}>
            Back
          </Link>
        </div>
      </header>

      <section className="rounded-xl border bg-white p-4">
        <form action={createJob} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Client <span className="text-red-600">*</span>
              </label>
              <select
                name="clientId"
                required
                defaultValue={clientId ?? ""}
                className={inputBase}
              >
                <option value="" disabled>
                  Select a client…
                </option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Job Title <span className="text-red-600">*</span>
              </label>
              <input
                name="title"
                required
                className={inputBase}
                placeholder="e.g., Water heater replacement"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                className={inputBase}
                rows={4}
                placeholder="Optional job details..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Assign To <span className="text-red-600">*</span>
              </label>
              <select
                name="assignedUserId"
                required
                className={inputBase}
                defaultValue={users[0]?.id ?? ""}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Scheduled Date
              </label>
              <input name="scheduledDate" type="date" className={inputBase} />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Due Date
              </label>
              <input name="dueDate" type="date" className={inputBase} />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Link href="/clients" className={btnSecondary}>
              Cancel
            </Link>
            <button className={btnPrimary}>Create Job</button>
          </div>
        </form>
      </section>
    </main>
  );
}
