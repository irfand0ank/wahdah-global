import type { Metadata } from "next";
import { PageHero, SampleBadge, Section } from "@/components/ui";
import { getDict, toLang } from "@/lib/i18n";

type Props = PageProps<"/[lang]/tentang-kami">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getDict(toLang((await params).lang)).nav.about };
}

// Teks profil, visi, dan misi masih contoh — ganti di src/lib/i18n.ts.
export default async function Page({ params }: Props) {
  const lang = toLang((await params).lang);
  const t = getDict(lang);
  return (
    <>
      <PageHero title={t.nav.about} lead={t.description} />
      <Section title={t.about.profileTitle}>
        <SampleBadge lang={lang} />
        <div className="prose-body mt-4 max-w-3xl text-lg leading-relaxed text-ink/90">
          {t.about.profile.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </Section>
      <div className="border-y border-line bg-white">
        <Section>
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl">{t.about.vision}</h2>
              <p className="mt-4 text-lg text-ink/90">{t.about.visionText}</p>
            </div>
            <div>
              <h2 className="font-display text-3xl">{t.about.mission}</h2>
              <ol className="mt-4 space-y-3">
                {t.about.missions.map((m, i) => (
                  <li key={m} className="flex gap-3">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700">
                      {i + 1}
                    </span>
                    {m}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
}
