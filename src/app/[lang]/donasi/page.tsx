import type { Metadata } from "next";
import { Channels } from "@/components/channels";
import { PageHero, ProgramCard, Section } from "@/components/ui";
import { getDonationChannels, getPrograms } from "@/lib/content";
import { getDict, toLang } from "@/lib/i18n";

type Props = PageProps<"/[lang]/donasi">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDict(toLang((await params).lang)).nav.donate };
}

export default async function Page({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDict(lang);
  const [channels, programs] = await Promise.all([
    getDonationChannels(lang),
    getPrograms(lang),
  ]);
  const open = programs.filter((p) => p.status !== "Selesai");

  return (
    <>
      <PageHero title={t.nav.donate} lead={t.donate.lead} />

      <Section title={t.donate.howTitle}>
        <ol className="grid gap-4 md:grid-cols-3">
          {t.donate.steps.map((s, i) => (
            <li key={s} className="rounded-2xl border border-line bg-white p-6">
              <span className="font-display text-3xl text-brand-500">
                {i + 1}
              </span>
              <p className="mt-3">{s}</p>
            </li>
          ))}
        </ol>
      </Section>

      <div className="border-y border-line bg-white">
        <Section title={t.donate.channelsTitle}>
          <Channels channels={channels} lang={lang} />
          <p className="mt-6 text-sm text-muted">{t.donate.warning}</p>
        </Section>
      </div>

      {open.length > 0 && (
        <Section title={t.donate.programsTitle}>
          <div className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {open.map((p) => (
              <ProgramCard key={p.slug} program={p} lang={lang} />
            ))}
          </div>
        </Section>
      )}
    </>
  );
}
