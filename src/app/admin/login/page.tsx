import { login } from "../actions";

const messages: Record<string, string> = {
  login: "Email atau kata sandi salah.",
  akses: "Akun ini tidak terdaftar sebagai admin.",
  db: "Database belum terhubung. Hubungi pengelola website.",
};

const input =
  "mt-1 w-full rounded-xl border border-line bg-white px-4 py-2.5 outline-none focus:border-brand-500";

export default async function Page({
  searchParams,
}: PageProps<"/admin/login">) {
  const { error } = await searchParams;
  const message = typeof error === "string" ? messages[error] : undefined;

  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="font-display text-3xl">Masuk admin</h1>
      <p className="mt-2 text-sm text-muted">
        Khusus pengelola konten Wahdah Global.
      </p>
      {message && (
        <p className="mt-5 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {message}
        </p>
      )}
      <form action={login} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold">
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            className={input}
          />
        </label>
        <label className="block text-sm font-semibold">
          Kata sandi
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            className={input}
          />
        </label>
        <button className="w-full rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-900">
          Masuk
        </button>
      </form>
    </div>
  );
}
