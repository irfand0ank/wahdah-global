import Link from "next/link";
import type { ReactNode } from "react";
import { logout } from "@/app/admin/actions";
import { resources } from "@/lib/admin-resources";

export function AdminShell({
  active,
  children,
}: {
  active: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-3xl">Panel admin</h1>
        <form action={logout}>
          <button className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold hover:border-brand-500">
            Keluar
          </button>
        </form>
      </div>
      <nav className="mt-6 flex flex-wrap gap-2 border-b border-line pb-4">
        {Object.entries(resources).map(([key, r]) => (
          <Link
            key={key}
            href={`/admin/${key}`}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              key === active
                ? "bg-brand-700 text-white"
                : "bg-white text-ink/80 hover:bg-brand-50"
            }`}
          >
            {r.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">{children}</div>
    </>
  );
}
