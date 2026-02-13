import Link from "next/link";
import { createClient } from "./actions";

const btnPrimary =
  "inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20";

const btnSecondary =
  "inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/10";

const inputBase =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10";

export default function NewClientPage() {
  return (
    <main className="space-y-6">
      <header className="space-y-2">
        <div className="text-sm text-gray-500">
          <Link href="/clients" className="hover:underline">
            Clients
          </Link>{" "}
          / New
        </div>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">New Client</h1>
            <p className="text-sm text-gray-600">
              Add a client record to track jobs, tasks, and invoices.
            </p>
          </div>

          <Link href="/clients" className={btnSecondary}>
            Back
          </Link>
        </div>
      </header>

      <section className="rounded-xl border bg-white p-4">
        <form action={createClient} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Client Name <span className="text-red-600">*</span>
              </label>
              <input name="name" required className={inputBase} placeholder="e.g., Acme Plumbing Co." />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Primary Contact
              </label>
              <input
                name="primaryContactName"
                className={inputBase}
                placeholder="e.g., Jordan Smith"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Email
              </label>
              <input
                name="email"
                type="email"
                className={inputBase}
                placeholder="e.g., jordan@acmeplumbing.com"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Phone
              </label>
              <input name="phone" className={inputBase} placeholder="e.g., 555-555-5555" />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Address
              </label>
              <input name="address" className={inputBase} placeholder="Street, City, State" />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Notes
              </label>
              <textarea
                name="notes"
                className={inputBase}
                rows={4}
                placeholder="Optional notes (preferences, gate code, etc.)"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Link href="/clients" className={btnSecondary}>
              Cancel
            </Link>
            <button className={btnPrimary}>Create Client</button>
          </div>
        </form>
      </section>
    </main>
  );
}
