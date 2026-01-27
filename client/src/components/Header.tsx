import { useLanguage } from "@/hooks/use-language";
import { Moon, Sun, Globe, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="flex-1 lg:pl-0 pl-12">
        <h1 className="text-2xl font-bold font-display text-foreground hidden sm:block">
          {title || t("dashboard")}
        </h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-destructive rounded-full border-2 border-background"></span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary rounded-full">
              <Globe className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setLanguage('en')} className={language === 'en' ? 'bg-secondary' : ''}>
              English
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('ar')} className={language === 'ar' ? 'bg-secondary' : ''}>
              العربية
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="text-muted-foreground hover:text-primary rounded-full"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </Button>

        <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-border/50">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-primary/60 shadow-lg shadow-primary/20 flex items-center justify-center text-white text-sm font-bold">
            JD
          </div>
          <div className="hidden md:block text-sm">
            <p className="font-semibold leading-none">{t("welcome")}</p>
            <p className="text-muted-foreground text-xs mt-1">Trader Pro</p>
          </div>
        </div>
      </div>
    </header>
  );
}
