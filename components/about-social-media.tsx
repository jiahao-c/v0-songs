"use client";

import Image from "next/image";
import { CheckCircle2, MessageCircle, Share2, X } from "lucide-react";
import { toast } from "sonner";

async function copyToClipboard(platformName: string, accountId: string) {
  try {
    await navigator.clipboard.writeText(accountId);
    toast.custom((toastId) => (
      <div className="flex min-w-[220px] items-center gap-2 rounded-lg border border-border bg-popover px-3 py-2 text-popover-foreground shadow-lg">
        <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
        <span className="text-sm font-medium">已复制{platformName}账号</span>
        <button
          type="button"
          onClick={() => toast.dismiss(toastId)}
          className="ml-auto inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          aria-label="关闭提示"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    ), {
      duration: 1200,
    });
  } catch {
    toast.error("复制失败，请稍后重试");
  }
}

export function AboutSocialMediaSection() {
  return (
    <section className="px-6 pb-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center gap-2">
          <Share2 className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">社交媒体</h3>
        </div>
        <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
          欢迎大家添加我的社交媒体账号:
        </p>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => void copyToClipboard("微信", "Evan__Wong")}
            className="flex w-full items-center gap-3 rounded-lg bg-secondary/60 px-3 py-3 text-left transition-colors active:bg-secondary/80"
            aria-label="复制微信账号 Evan__Wong"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#07C160]/15">
              <MessageCircle className="h-5 w-5 text-[#07C160]" />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">微信</p>
              <p className="break-all text-sm font-medium text-foreground">Evan__Wong</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => void copyToClipboard("Instagram", "evan__wong")}
            className="flex w-full items-center gap-3 rounded-lg bg-secondary/60 px-3 py-3 text-left transition-colors active:bg-secondary/80"
            aria-label="复制 Instagram 账号 evan__wong"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E4405F]/15">
              <Image
                src="https://b1ur77xy96njaoik.public.blob.vercel-storage.com/Instagram.svg"
                alt="Instagram"
                width={20}
                height={20}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Instagram</p>
              <p className="break-all text-sm font-medium text-foreground">evan__wong</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => void copyToClipboard("小红书", "704124068")}
            className="flex w-full items-center gap-3 rounded-lg bg-secondary/60 px-3 py-3 text-left transition-colors active:bg-secondary/80"
            aria-label="复制小红书账号 704124068"
          >
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FE2C55]/15">
              <Image
                src="https://b1ur77xy96njaoik.public.blob.vercel-storage.com/%E5%B0%8F%E7%BA%A2%E4%B9%A6.webp"
                alt="小红书"
                width={20}
                height={20}
              />
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">小红书</p>
              <p className="break-all text-sm font-medium text-foreground">704124068</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => void copyToClipboard("抖音", "2175639704")}
            className="flex w-full items-center gap-3 rounded-lg bg-secondary/60 px-3 py-3 text-left transition-colors active:bg-secondary/80"
            aria-label="复制抖音账号 2175639704"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground/10">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.6 5.82s.51.5 0 0A4.278 4.278 0 0 1 15.54 3h-3.09v12.4a2.592 2.592 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">抖音</p>
              <p className="break-all text-sm font-medium text-foreground">2175639704</p>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
