"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const MdxMarkdownEditor = dynamic(
  () =>
    import("@/components/mdx-markdown-editor").then(
      (mod) => mod.MdxMarkdownEditor
    ),
  {
    ssr: false,
    loading: () => (
      <div className="rounded-lg border border-border bg-secondary/30 px-4 py-6 text-sm text-muted-foreground">
        编辑器加载中...
      </div>
    ),
  }
);

type SectionKey = "about_intro" | "about_songlist";

interface AboutSection {
  section_key: string;
  content_markdown: string;
}

interface ManageAboutSectionsEditorProps {
  initialSections?: AboutSection[];
}

const DEFAULT_INTRO_MARKDOWN = `大家好，我是王咚咚，一名来自多伦多的独立原创音乐人。

在业余生活中，我热爱作词、作曲与编曲，尤其擅长创作抒情类歌曲。从事音乐创作已经八年，写歌对我来说就像写日记——是记录生活与情感的方式，也是我表达与释放压力的途径。

如果你对我的作品感兴趣，欢迎在各大音乐平台搜索"王咚咚"，可以听到我的原创与翻唱作品。喜欢的话，也请多多关注与支持，谢谢大家！`;

const DEFAULT_SONGLIST_MARKDOWN = `欢迎大家点歌！点歌是免费的！

但如果你喜欢我的演唱，我会很感谢您的小费支持！希望我的歌声带给你美好的音乐体验！`;

export function ManageAboutSectionsEditor({
  initialSections,
}: ManageAboutSectionsEditorProps) {
  const initialIntro = initialSections?.find(
    (item) => item.section_key === "about_intro"
  );
  const initialSonglist = initialSections?.find(
    (item) => item.section_key === "about_songlist"
  );

  const [introMarkdown, setIntroMarkdown] = useState(
    initialIntro?.content_markdown ?? DEFAULT_INTRO_MARKDOWN
  );
  const [songlistMarkdown, setSonglistMarkdown] = useState(
    initialSonglist?.content_markdown ?? DEFAULT_SONGLIST_MARKDOWN
  );
  const [loading, setLoading] = useState(!initialSections);
  const [savingSection, setSavingSection] = useState<SectionKey | null>(null);

  useEffect(() => {
    if (initialSections) {
      setLoading(false);
      return;
    }

    async function loadSections() {
      try {
        const response = await fetch("/api/about-sections");
        const payload = (await response.json().catch(() => null)) as
          | AboutSection[]
          | { error?: string }
          | null;

        if (!response.ok) {
          const errorMessage =
            payload && !Array.isArray(payload)
              ? payload.error
              : "加载失败，请稍后重试";
          toast.error(errorMessage || "加载失败，请稍后重试");
          return;
        }

        if (Array.isArray(payload)) {
          const intro = payload.find((item) => item.section_key === "about_intro");
          const songlist = payload.find(
            (item) => item.section_key === "about_songlist"
          );

          setIntroMarkdown(intro?.content_markdown ?? DEFAULT_INTRO_MARKDOWN);
          setSonglistMarkdown(
            songlist?.content_markdown ?? DEFAULT_SONGLIST_MARKDOWN
          );
        }
      } catch {
        toast.error("网络异常，请稍后重试");
      } finally {
        setLoading(false);
      }
    }

    loadSections();
  }, [initialSections]);

  async function saveSection(sectionKey: SectionKey, contentMarkdown: string) {
    setSavingSection(sectionKey);
    try {
      const response = await fetch("/api/about-sections", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionKey, contentMarkdown }),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        toast.error(payload?.error || "保存失败，请稍后重试");
        return;
      }

      toast.success("内容已保存");
    } catch {
      toast.error("网络异常，请稍后重试");
    } finally {
      setSavingSection(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/30 px-3 py-3 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        正在加载关于页内容...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">个人介绍</h3>
          <Button
            type="button"
            size="sm"
            onClick={() => saveSection("about_intro", introMarkdown)}
            disabled={savingSection !== null}
          >
            {savingSection === "about_intro" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            保存个人介绍
          </Button>
        </div>
        <MdxMarkdownEditor
          markdown={introMarkdown}
          onChange={setIntroMarkdown}
          placeholder="请输入介绍内容（Markdown）"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-foreground">点歌介绍</h3>
          <Button
            type="button"
            size="sm"
            onClick={() => saveSection("about_songlist", songlistMarkdown)}
            disabled={savingSection !== null}
          >
            {savingSection === "about_songlist" ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            保存点歌介绍
          </Button>
        </div>
        <MdxMarkdownEditor
          markdown={songlistMarkdown}
          onChange={setSonglistMarkdown}
          placeholder="请输入歌单说明（Markdown）"
        />
      </div>
    </div>
  );
}
