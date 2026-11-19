import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { defaultLang, locales } from "@/lib/i18n";
import { isSupabaseConfigured, supabaseKey, supabaseUrl } from "@/lib/supabase";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Halaman publik selalu berawalan kode bahasa; alamat tanpa awalan
  // (termasuk tautan lama) dialihkan ke bahasa Indonesia.
  if (!pathname.startsWith("/admin")) {
    const hasLocale = locales.some(
      (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
    );
    if (hasLocale) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLang}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
  }

  // /admin: perbarui sesi login (token Supabase) pada setiap permintaan.
  let response = NextResponse.next({ request });
  if (!isSupabaseConfigured) return response;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });
  await supabase.auth.getUser();
  return response;
}

// Semua halaman, kecuali berkas statis dan internal Next.js.
export const config = { matcher: "/((?!_next|api|.*\\..*).*)" };
