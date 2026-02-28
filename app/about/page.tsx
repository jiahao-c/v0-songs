import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Music, Heart, MessageCircle, Share2 } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "关于 | 王咚咚",
  description: "独立原创音乐人王咚咚 - 来自多伦多",
};

export default function AboutPage() {
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
              <p>
                大家好，我是王咚咚，一名来自多伦多的独立原创音乐人。
              </p>
              <p>
                在业余生活中，我热爱作词、作曲与编曲，尤其擅长创作抒情类歌曲。从事音乐创作已经八年，写歌对我来说就像写日记——是记录生活与情感的方式，也是我表达与释放压力的途径。
              </p>
              <p>
                如果你对我的作品感兴趣，欢迎在各大音乐平台搜索"王咚咚"，可以听到我的原创与翻唱作品。喜欢的话，也请多多关注与支持，谢谢大家！
              </p>
            </div>
          </div>
        </section>

        {/* Song request section */}
        <section className="px-6 pb-10">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Heart className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">歌单</h3>
            </div>
            <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
              <p>
                欢迎大家点歌！点歌是免费的！
              </p>
              <p>
                但如果你喜欢我的演唱，我会很感谢您的小费支持！希望我的歌声带给你美好的音乐体验！
              </p>
            </div>
          </div>
        </section>

        {/* Social media section */}
        <section className="px-6 pb-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-3 flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">社交媒体</h3>
            </div>
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              欢迎大家添加我的社交媒体账号:
            </p>
            <div className="grid grid-cols-2 gap-3">
              {/* WeChat */}
              <div className="flex items-center gap-3 rounded-lg bg-secondary/60 px-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#07C160]/15">
                  <MessageCircle className="h-5 w-5 text-[#07C160]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">微信</p>
                  <p className="truncate text-sm font-medium text-foreground">Evan__Wong</p>
                </div>
              </div>

              {/* Instagram */}
              <div className="flex items-center gap-3 rounded-lg bg-secondary/60 px-3 py-3">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E4405F]/15">
                  <Image
                    src="https://b1ur77xy96njaoik.public.blob.vercel-storage.com/Instagram.svg"
                    alt="Instagram"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Instagram</p>
                  <p className="truncate text-sm font-medium text-foreground">evan__wong</p>
                </div>
              </div>

              {/* Xiaohongshu */}
              <div className="flex items-center gap-3 rounded-lg bg-secondary/60 px-3 py-3">
                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FE2C55]/15">
                  <Image
                    src="https://b1ur77xy96njaoik.public.blob.vercel-storage.com/%E5%B0%8F%E7%BA%A2%E4%B9%A6.webp"
                    alt="小红书"
                    width={20}
                    height={20}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">小红书</p>
                  <p className="truncate text-sm font-medium text-foreground">704124068</p>
                </div>
              </div>

              {/* Douyin */}
              <div className="flex items-center gap-3 rounded-lg bg-secondary/60 px-3 py-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">抖音</p>
                  <p className="truncate text-sm font-medium text-foreground">2175639704</p>
                </div>
              </div>
            </div>
          </div>
        </section>

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
