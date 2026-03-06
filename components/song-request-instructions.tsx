"use client";

import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const DEFAULT_SONGLIST_MARKDOWN = `欢迎大家点歌！点歌是免费的！

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

interface SongRequestInstructionsProps {
  markdown?: string;
  isLoading?: boolean;
}

export function SongRequestInstructions({
  markdown,
  isLoading = false,
}: SongRequestInstructionsProps) {
  return (
    <>
      <DialogHeader>
        <DialogTitle className="text-base">如何点歌</DialogTitle>
      </DialogHeader>

      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
        {isLoading && !markdown ? (
          <p>正在加载点歌说明...</p>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={markdownComponents}
          >
            {markdown ?? DEFAULT_SONGLIST_MARKDOWN}
          </ReactMarkdown>
        )}
      </div>
    </>
  );
}
