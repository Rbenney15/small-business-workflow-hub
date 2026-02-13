import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { updateClient } from "./actions";

const btnPrimary =
  "inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20";

const btnSecondary =
  "inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10";

const inputBase =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;

  const client = await prisma.client.findUnique({
    where: { id: clientId },
  });

  if (!client) return notFound();

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
          / Edit
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Client</h1>
            <p className="text-sm text-gray-600">
              Update client information. Changes apply immediately.
            </p>
          </div>

          <Link href={`/clients/${client.id}`} className={btnSecondary}>
            Cancel
          </Link>
        </div>
      </header>

      <section className="rounded-xl border bg-white p-4">
        <form
          action={async (formData) => {
            "use server";
            await updateClient(client.id, formData);
          }}
          className="space-y-4"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Client Name <span className="text-red-600">*</span>
              </label>
              <input
                name="name"
                required
                defaultValue={client.name}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Status
              </label>
              <select
                name="status"
                defaultValue={client.status}
                className={inputBase}
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="ARCHIVED">ARCHIVED</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Primary Contact
              </label>
              <input
                name="primaryContactName"
                defaultValue={client.primaryContactName ?? ""}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                defaultValue={client.email ?? ""}
                className={inputBase}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input
                name="phone"
                defaultValue={client.phone ?? ""}
                className={inputBase}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Address
              </label>
              <input
                name="address"
                defaultValue={client.address ?? ""}
                className={inputBase}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                defaultValue={client.notes ?? ""}
                className={inputBase}
                rows={5}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Link href={`/clients/${client.id}`} className={btnSecondary}>
              Cancel
            </Link>
            <button className={btnPrimary}>Save Changes</button>
          </div>
        </form>
      </section>
    </main>
  );
}
