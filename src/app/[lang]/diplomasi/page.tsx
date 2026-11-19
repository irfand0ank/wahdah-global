import type { Metadata } from "next";
import { TopicPage } from "@/components/topic-page";
import { getTopic } from "@/lib/content";
import { toLang } from "@/lib/i18n";

type Props = PageProps<"/[lang]/diplomasi">;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: getTopic(toLang((await params).lang), "diplomasi").title };
}

export default async function Page({ params }: Props) {
  return <TopicPage lang={toLang((await params).lang)} slug="diplomasi" />;
}
