import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateJob } from "./actions";

const btnPrimary =
  "inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20";

const btnSecondary =
  "inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10";

const inputBase =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10";

function toDateInputValue(d: Date | null) {
  if (!d) return "";
  const dt = new Date(d);
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default async function EditJobPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  const [job, clients, users] = await Promise.all([
    prisma.job.findUnique({
      where: { id: jobId },
      include: { client: true },
    }),
    prisma.client.findMany({ orderBy: { name: "asc" } }),
    prisma.user.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!job) return notFound();

  // defaultValue for select must be a string
  const assigneeDefault = job.assignedUserId ?? users[0]?.id ?? "";

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <div className="text-sm text-gray-500">
          <Link href="/clients" className="hover:underline">
            Clients
          </Link>{" "}
          /{" "}
          <Link href={`/clients/${job.clientId}`} className="hover:underline">
            {job.client.name}
          </Link>{" "}
          /{" "}
          <Link href={`/jobs/${job.id}`} className="hover:underline">
            Job
          </Link>{" "}
          / Edit
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Job</h1>
            <p className="text-sm text-gray-600">
              Update job details and assignment.
            </p>
          </div>

          <Link href={`/jobs/${job.id}`} className={btnSecondary}>
            Cancel
          </Link>
        </div>
      </header>

      <section className="rounded-xl border bg-white p-4">
        <form
          action={async (formData) => {
            "use server";
            await updateJob(job.id, formData);
          }}
          className="space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Client <span className="text-red-600">*</span>
              </label>
              <select
                name="clientId"
                required
                defaultValue={job.clientId}
                className={inputBase}
              >
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
                defaultValue={job.title}
                className={inputBase}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Description
              </label>
              <textarea
                name="description"
                defaultValue={job.description ?? ""}
                className={inputBase}
                rows={4}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Assign To <span className="text-red-600">*</span>
              </label>
              <select
                name="assignedUserId"
                required
                defaultValue={assigneeDefault}
                className={inputBase}
              >
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.role})
                  </option>
                ))}
              </select>

              {users.length === 0 ? (
                <p className="mt-2 text-xs text-red-600">
                  No users found. Seed or create a user before assigning jobs.
                </p>
              ) : null}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Status <span className="text-red-600">*</span>
              </label>
              <select
                name="status"
                required
                defaultValue={job.status}
                className={inputBase}
              >
                <option value="SCHEDULED">SCHEDULED</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Scheduled Date
              </label>
              <input
                name="scheduledDate"
                type="date"
                defaultValue={toDateInputValue(job.scheduledDate)}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Due Date
              </label>
              <input
                name="dueDate"
                type="date"
                defaultValue={toDateInputValue(job.dueDate)}
                className={inputBase}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Link href={`/jobs/${job.id}`} className={btnSecondary}>
              Cancel
            </Link>
            <button className={btnPrimary}>Save Changes</button>
          </div>
        </form>
      </section>
    </main>
  );
}
