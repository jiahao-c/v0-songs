import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Music, Heart } from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AboutSocialMediaSection } from "../../components/about-social-media";
import { ThemeToggle } from "@/components/theme-toggle";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAboutSectionsData } from "@/lib/content-data";

export const metadata: Metadata = {
  title: "关于 | 王咚咚",
  description: "独立原创音乐人王咚咚 - 来自多伦多",
};

const DEFAULT_INTRO_MARKDOWN = `大家好，我是王咚咚，一名来自多伦多的独立原创音乐人。

在业余生活中，我热爱作词、作曲与编曲，尤其擅长创作抒情类歌曲。从事音乐创作已经八年，写歌对我来说就像写日记——是记录生活与情感的方式，也是我表达与释放压力的途径。

如果你对我的作品感兴趣，欢迎在各大音乐平台搜索"王咚咚"，可以听到我的原创与翻唱作品。喜欢的话，也请多多关注与支持，谢谢大家！`;

const DEFAULT_SONGLIST_MARKDOWN = `欢迎大家点歌！点歌是免费的！

但如果你喜欢我的演唱，我会很感谢您的小费支持！希望我的歌声带给你美好的音乐体验！`;

const markdownComponents = {
  p: ({ children }: { children?: ReactNode }) => (
    <p className="mb-3 last:mb-0">{children}</p>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>
  ),
  a: ({
    href,
    children,
  }: {
    href?: string;
    children?: ReactNode;
  }) => (
    <a
      href={href}
      className="text-primary underline underline-offset-2"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

async function getAboutSectionContent() {
  try {
    const rows = await getAboutSectionsData();

    const byKey = new Map<string, string>();
    for (const row of rows) {
      byKey.set(row.section_key, row.content_markdown);
    }

    return {
      intro: byKey.get("about_intro") ?? DEFAULT_INTRO_MARKDOWN,
      songlist: byKey.get("about_songlist") ?? DEFAULT_SONGLIST_MARKDOWN,
    };
  } catch (error) {
    console.error("Failed to load about sections:", error);
    return {
      intro: DEFAULT_INTRO_MARKDOWN,
      songlist: DEFAULT_SONGLIST_MARKDOWN,
    };
  }
}

export default async function AboutPage() {
  const sections = await getAboutSectionContent();

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link
            href="/"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors active:bg-secondary/70"
            aria-label="返回歌单"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-semibold text-foreground">关于</h1>
          <ThemeToggle className="ml-auto" />
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        {/* Hero section */}
        <section className="relative flex flex-col items-center px-6 pt-10 pb-8">
          <div className="relative h-28 w-28 overflow-hidden rounded-full ring-4 ring-primary/30 shadow-lg shadow-primary/10">
            <Image
              src="https://b1ur77xy96njaoik.public.blob.vercel-storage.com/photo.jpg"
              alt="王咚咚"
              fill
              className="object-cover"
              sizes="112px"
              priority
            />
          </div>
          <h2 className="mt-5 text-2xl font-bold text-foreground">王咚咚</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            独立原创音乐人 / 多伦多
          </p>
        </section>

        {/* About section */}
        <section className="px-6 pb-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Music className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">介绍</h3>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {sections.intro}
              </ReactMarkdown>
            </div>
          </div>
        </section>

        {/* Song request section */}
        <section className="px-6 pb-10">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">如何点歌</h3>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {sections.songlist}
              </ReactMarkdown>
            </div>
          </div>
        </section>

        <AboutSocialMediaSection />

        {/* Back to songlist CTA */}
        <section className="px-6 pb-10">
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground transition-colors active:bg-primary/80"
          >
            <Music className="h-4 w-4" />
            浏览歌单
          </Link>
        </section>
      </main>
    </div>
  );
}
