import type { Metadata } from "next";
import { TopicPage } from "@/components/topic-page";
import { getTopic } from "@/lib/content";
import { toLang } from "@/lib/i18n";

type Props = PageProps<"/[lang]/kerja-sama-internasional">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getTopic(toLang((await params).lang), "kerja-sama-internasional").title };
}

export default async function Page({ params }: Props) {
  return <TopicPage lang={toLang((await params).lang)} slug="kerja-sama-internasional" />;
}
