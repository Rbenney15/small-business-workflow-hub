import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-black">
        <div className="flex min-h-screen">
          <aside className="w-60 border-r p-4">
            <div className="font-semibold text-lg">Workflow Hub</div>
            <nav className="mt-6 space-y-1 text-sm">
              <Link className="block rounded-lg px-3 py-2 hover:bg-gray-50" href="/dashboard">
                Dashboard
              </Link>
              <Link className="block rounded-lg px-3 py-2 hover:bg-gray-50" href="/clients">
                Clients
              </Link>
              <Link className="block rounded-lg px-3 py-2 hover:bg-gray-50" href="/invoices">
                Invoices
              </Link>
            </nav>
            <div className="mt-6 text-xs text-gray-400">
              Phase 1.5 polish
            </div>
          </aside>

          <div className="flex-1">{children}</div>
        </div>
      </body>
    </html>
  );
}
