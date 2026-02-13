import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { archiveClient, deleteClientPermanently } from "./actions";

const btnPrimary =
  "inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20";

const btnSecondary =
  "inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10";

const btnDanger =
  "inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600/30";

export default async function ClientDeletePage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
    select: { id: true, name: true, status: true },
  });

  if (!client) return notFound();

  const [jobCount, invoiceCount] = await Promise.all([
    prisma.job.count({ where: { clientId } }),
    prisma.invoice.count({ where: { clientId } }),
  ]);

  const canDelete = jobCount === 0 && invoiceCount === 0;

  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <div className="text-sm text-gray-500">
          <Link href="/clients" className="hover:underline">
            Clients
          </Link>{" "}
          /{" "}
          <Link href={`/clients/${client.id}`} className="hover:underline">
            {client.name}
          </Link>{" "}
          / Deactivate or Delete
        </div>

        <h1 className="text-2xl font-semibold text-gray-900">
          Deactivate or Delete Client
        </h1>
        <p className="text-sm text-gray-600">
          Deactivating is recommended so you don’t lose job and invoice history.
        </p>
      </header>

      <section className="rounded-xl border bg-white p-4 space-y-4">
        <div className="rounded-lg border bg-gray-50 p-3 text-sm">
          <div className="font-medium text-gray-900">{client.name}</div>
          <div className="mt-1 text-gray-700">
            Status: <span className="font-medium">{client.status}</span> • Jobs:{" "}
            <span className="font-medium">{jobCount}</span> • Invoices:{" "}
            <span className="font-medium">{invoiceCount}</span>
          </div>
        </div>

        {/* Deactivate */}
        <div className="space-y-2">
          <h2 className="font-semibold text-gray-900">
            Deactivate (Recommended)
          </h2>
          <p className="text-sm text-gray-600">
            Sets the client status to <span className="font-medium">INACTIVE</span>.
            You keep all history (jobs, tasks, invoices) while hiding them from
            day-to-day work.
          </p>

          <form
            action={async () => {
              "use server";
              await archiveClient(client.id);
            }}
          >
            <button className={btnPrimary}>Deactivate Client</button>
          </form>
        </div>

        <div className="border-t pt-4 space-y-2">
          <h2 className="font-semibold text-gray-900">Permanent Delete</h2>
          <p className="text-sm text-gray-600">
            Only available if the client has no jobs or invoices.
          </p>

          {canDelete ? (
            <form
              action={async () => {
                "use server";
                await deleteClientPermanently(client.id);
              }}
            >
              <button className={btnDanger}>Delete Permanently</button>
            </form>
          ) : (
            <div className="text-sm text-gray-600">
              Permanent delete is disabled because this client has existing
              records. Please deactivate instead.
            </div>
          )}
        </div>

        <div className="flex justify-end">
          <Link href={`/clients/${client.id}`} className={btnSecondary}>
            Cancel
          </Link>
        </div>
      </section>
    </main>
  );
}
