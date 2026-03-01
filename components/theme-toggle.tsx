"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = (resolvedTheme ?? theme) === "dark";
  const nextTheme = isDarkMode ? "light" : "dark";
  const themeLabel = isDarkMode ? "浅色主题" : "深色主题";
  const ariaLabel = `切换到${themeLabel}`;

  if (!mounted) {
    return (
      <span
        className={cn(
          "inline-flex h-9 w-9 shrink-0 rounded-full border border-border/70 bg-card/60 sm:w-auto sm:min-w-[90px]",
          className
        )}
        aria-hidden="true"
      />
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={() => setTheme(nextTheme)}
      className={cn(
        "h-9 w-9 shrink-0 justify-center gap-0 rounded-full border border-border/70 bg-card/75 px-0 text-xs font-medium text-foreground shadow-xs transition-all hover:-translate-y-0.5 hover:border-primary/70 hover:bg-card/75 hover:text-primary sm:w-auto sm:gap-1.5 sm:px-3",
        className
      )}
      aria-label={ariaLabel}
      title={ariaLabel}
    >
      {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{themeLabel}</span>
    </Button>
  );
}
