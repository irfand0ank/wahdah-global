"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { langNames, locales, type Lang } from "@/lib/i18n";

const flags: Record<Lang, string> = {
  id: "/flags/id.svg",
  en: "/flags/gb.svg",
  ar: "/flags/sa.svg",
};

function Flag({ lang }: { lang: Lang }) {
  return (
    <Image
      src={flags[lang]}
      alt=""
      width={28}
      height={20}
      unoptimized
      className="h-5 w-7 rounded-sm object-cover ring-1 ring-ink/10"
    />
  );
}

/** Dropdown bahasa: menampilkan bahasa aktif, pilihan lain membuka halaman yang sama. */
export function LangSwitch({ lang, label }: { lang: Lang; label: string }) {
  const pathname = usePathname() ?? `/${lang}`;
  const rest = pathname.replace(/^\/[a-z]{2}(?=\/|$)/, "");
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: Event) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", close);
    };
  }, [open]);

  return (
    <div ref={box} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-label={`${label}: ${langNames[lang]}`}
        className="flex items-center gap-2 rounded-lg border border-line px-2.5 py-2 text-sm font-semibold hover:border-brand-500"
      >
        <Flag lang={lang} />
        <span className="uppercase">{lang}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <path
            d="M1 3l4 4 4-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          />
        </svg>
      </button>
      {open && (
        <ul className="absolute end-0 top-full z-50 mt-2 w-44 rounded-xl border border-line bg-white p-1.5 shadow-lg">
          {locales.map((code) => (
            <li key={code}>
              <Link
                href={`/${code}${rest}`}
                lang={code}
                onClick={() => setOpen(false)}
                aria-current={code === lang ? "true" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  code === lang
                    ? "bg-brand-50 text-brand-700"
                    : "hover:bg-brand-50"
                }`}
              >
                <Flag lang={code} />
                {langNames[code]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
