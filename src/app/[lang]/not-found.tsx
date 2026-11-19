import Link from "next/link";

// Halaman 404 tidak menerima parameter bahasa, jadi teksnya tiga bahasa.
export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-display text-6xl text-brand-500">404</p>
      <p className="mt-4 text-lg">
        Halaman tidak ditemukan · Page not found ·{" "}
        <span lang="ar">الصفحة غير موجودة</span>
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white"
      >
        Home
      </Link>
    </div>
  );
}
