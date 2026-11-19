import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "./supabase";

/** Klien dengan sesi pengguna (cookie) — untuk panel admin. */
export async function sessionClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Dipanggil dari Server Component: cookie diperbarui oleh proxy.ts.
        }
      },
    },
  });
}

/** Pastikan pengunjung login DAN terdaftar sebagai admin; selain itu alihkan ke login. */
export async function requireAdmin() {
  if (!isSupabaseConfigured) redirect("/admin/login?error=db");
  const db = await sessionClient();
  const {
    data: { user },
  } = await db.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: isAdmin } = await db.rpc("is_admin");
  if (!isAdmin) redirect("/admin/login?error=akses");
  return db;
}
