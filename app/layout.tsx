import "./globals.css";
import Link from "next/link";

const navLink =
  "block rounded-lg px-3 py-2 text-sm font-medium text-gray-800 hover:bg-white hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/20";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900 antialiased">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 border-r bg-gray-50 p-4">
            <div className="rounded-xl border bg-white p-3">
              <div className="font-semibold text-base">Workflow Hub</div>
              <div className="text-xs text-gray-500">
                Small Business Office MVP
              </div>
            </div>

            <nav className="mt-4 space-y-1" aria-label="Primary navigation">
              <Link className={navLink} href="/dashboard">
                Dashboard
              </Link>
              <Link className={navLink} href="/clients">
                Clients
              </Link>
              <Link className={navLink} href="/invoices">
                Invoices
              </Link>
            </nav>

            <div className="mt-6 text-xs text-gray-500">Light mode • V.1.5</div>
          </aside>

          {/* Main content */}
          <div className="flex-1">
            {/* Consistent padding on every page */}
            <div className="p-4 md:p-6">{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
