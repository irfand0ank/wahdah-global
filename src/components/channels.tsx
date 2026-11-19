import Image from "next/image";
import { SampleBadge } from "@/components/ui";
import type { DonationChannel } from "@/lib/content";
import type { Lang } from "@/lib/i18n";

export function Channels({
  channels,
  lang,
}: {
  channels: DonationChannel[];
  lang: Lang;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {channels.map((c, i) => (
        <div
          key={`${c.label}-${i}`}
          className="rounded-2xl border border-line bg-brand-50 p-6"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-display text-xl">{c.label}</h3>
            {c.sample && <SampleBadge lang={lang} />}
          </div>
          <p className="mt-2 whitespace-pre-line text-sm text-muted">
            {c.detail}
          </p>
          {c.image && (
            <Image
              src={c.image}
              alt={c.label}
              width={240}
              height={240}
              className="mt-4 h-auto w-60 rounded-xl"
            />
          )}
        </div>
      ))}
    </div>
  );
}
