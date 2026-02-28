import Link from "next/link";
import { cookies } from "next/headers";
import { ArrowLeft, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ManagePageContent } from "@/components/manage-page-content";
import { loginToManage } from "./actions";
import {
  MANAGE_AUTH_COOKIE,
  isAdminPasswordConfigured,
  isValidManageAuthCookie,
} from "@/lib/manage-auth";

const ERROR_MESSAGES: Record<string, string> = {
  "invalid-password": "密码错误，请重试。",
  "not-configured": "未配置 ADMIN_PASSWORD，暂时无法登录。",
};

interface ManagePageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function ManagePage({ searchParams }: ManagePageProps) {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(MANAGE_AUTH_COOKIE)?.value;

  if (isValidManageAuthCookie(authCookie)) {
    return <ManagePageContent />;
  }

  const isConfigured = isAdminPasswordConfigured();
  const resolvedSearchParams = (await searchParams) ?? {};
  const errorMessage = resolvedSearchParams.error
    ? ERROR_MESSAGES[resolvedSearchParams.error] || "登录失败，请稍后再试。"
    : null;

  return (
    <div className="flex min-h-dvh flex-col bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 px-4 py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center gap-3">
          <Link
            href="/"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-foreground transition-colors hover:bg-secondary/80"
            aria-label="返回歌单"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-bold text-foreground">歌单管理</h1>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-sm flex-1 items-center px-4 py-8">
        <div className="w-full rounded-xl border border-border bg-card/60 p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Lock className="h-4 w-4 text-primary" />
            <h2 className="text-base font-semibold text-foreground">
              请输入管理密码
            </h2>
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            此页面仅管理员可访问。请输入密码。
          </p>

          {errorMessage && (
            <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {errorMessage}
            </p>
          )}

          {!isConfigured ? (
            <p className="rounded-md border border-border bg-secondary/40 px-3 py-2 text-sm text-muted-foreground">
              请先在环境变量中配置 ADMIN_PASSWORD。
            </p>
          ) : (
            <form action={loginToManage} className="flex flex-col gap-3">
              <Input
                type="password"
                name="password"
                placeholder="管理员密码"
                autoComplete="current-password"
                required
              />
              <Button type="submit">进入管理页</Button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
