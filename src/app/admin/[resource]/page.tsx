import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin";
import { resources } from "@/lib/admin-resources";
import { requireAdmin } from "@/lib/supabase-server";

export default async function Page({
  params,
  searchParams,
}: PageProps<"/admin/[resource]">) {
  const { resource: key } = await params;
  const resource = resources[key];
  if (!resource) notFound();

  const db = await requireAdmin();
  const { ok } = await searchParams;
  const { data, error } = await db
    .from(resource.table)
    .select("*")
    .order(resource.orderBy.column, { ascending: resource.orderBy.ascending });
  const rows = (data ?? []) as Record<string, unknown>[];

  return (
    <AdminShell active={key}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-display text-2xl">{resource.label}</h2>
        <Link
          href={`/admin/${key}/baru`}
          className="rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-brand-900 hover:bg-accent-dark hover:text-white"
        >
          + Tambah {resource.singular}
        </Link>
      </div>

      {ok && (
        <p className="mt-5 rounded-xl bg-brand-50 px-4 py-3 text-sm text-brand-700">
          Perubahan tersimpan.
        </p>
      )}
      {error && (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          Gagal memuat data: {error.message}
        </p>
      )}

      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
        {rows.map((row) => (
          <li key={String(row.id)}>
            <Link
              href={`/admin/${key}/${row.id}`}
              className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-brand-50"
            >
              <span className="min-w-0">
                <span className="block truncate font-semibold">
                  {String(row[resource.titleField] ?? "")}
                </span>
                {resource.subtitleField && (
                  <span className="block truncate text-sm text-muted">
                    {String(row[resource.subtitleField] ?? "")}
                  </span>
                )}
              </span>
              <span
                className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  row.published
                    ? "bg-brand-100 text-brand-700"
                    : "bg-line text-muted"
                }`}
              >
                {row.published ? "Terbit" : "Draf"}
              </span>
            </Link>
          </li>
        ))}
        {!rows.length && !error && (
          <li className="px-5 py-8 text-center text-muted">Belum ada data.</li>
        )}
      </ul>
    </AdminShell>
  );
}
