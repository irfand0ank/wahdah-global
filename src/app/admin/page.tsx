import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/supabase-server";

export default async function Page() {
  await requireAdmin();
  redirect("/admin/berita");
}
