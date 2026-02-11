import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { createTaskForJob } from "./actions";

export default async function NewTaskPage({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;

  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      client: true,
    },
  });

  if (!job) return notFound();

  const users = await prisma.user.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <main className="p-6 space-y-6">
      <div className="text-sm text-gray-500">
        <Link href={`/jobs/${job.id}`} className="hover:underline">
          Job
        </Link>{" "}
        / New Task
      </div>

      <h1 className="text-2xl font-semibold">Create Task</h1>

      <div className="rounded-xl border p-4 space-y-2">
        <div className="text-sm text-gray-500">Client</div>
        <div className="font-medium">{job.client.name}</div>
        <div className="text-sm text-gray-600">Job: {job.title}</div>
      </div>

      <form
        action={async (formData) => {
          "use server";
          await createTaskForJob(jobId, formData);
        }}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Title</label>
          <input
            name="title"
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
            placeholder="Enter task title"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>
          <select
            name="priority"
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM" defaultValue="MEDIUM">
              MEDIUM
            </option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Assign To
          </label>
          <select
            name="assignedUserId"
            required
            className="w-full rounded-lg border px-3 py-2 text-sm"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name} ({u.role})
              </option>
            ))}
          </select>
        </div>

        <button className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white">
          Create Task
        </button>
      </form>
    </main>
  );
}
