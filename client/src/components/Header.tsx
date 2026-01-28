import { useLanguage } from "@/hooks/use-language";
import { Moon, Sun, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export function Header({ title }: { title?: string }) {
  const { t, language, setLanguage } = useLanguage();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-6 bg-background/40 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-primary-foreground font-bold font-display text-2xl shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
          P
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-bold font-display tracking-tighter text-foreground">
            {t("pipflow")}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-primary dark:text-white font-bold opacity-70">
            {t("platform_tagline")}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-6">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2 text-muted-foreground hover:text-primary"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{t("home")}</span>
          </Button>
        </Link>

        <div className="flex items-center gap-1 rounded-full bg-secondary/50 p-1">
          <Button
            variant={language === 'en' ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage('en')}
            className="rounded-full px-3"
          >
            EN
          </Button>
          <Button
            variant={language === 'ar' ? "default" : "ghost"}
            size="sm"
            onClick={() => setLanguage('ar')}
            className="rounded-full px-3"
          >
            AR
          </Button>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="text-muted-foreground hover:text-primary rounded-full"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>


      </div>
    </header>
  );
}
