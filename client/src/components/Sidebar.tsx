import { Link, useLocation } from "wouter";
import { LayoutDashboard, BarChart2, FileText, Settings, LogOut, Menu, X } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "dashboard", href: "/" },
  { icon: BarChart2, label: "market", href: "/market" },
  { icon: FileText, label: "reports", href: "/reports" },
  { icon: Settings, label: "settings", href: "/settings" },
];

export function Sidebar() {
  const [location] = useLocation();
  const { t, language } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold font-display text-xl shadow-lg shadow-primary/25">
            P
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-primary dark:text-white">
            {t("pipflow")}
          </span>
        </div>
      </div>

      <div className="flex-1 px-4 py-6 space-y-2">
        {navItems.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group font-medium",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground")} />
                <span>{t(item.label)}</span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="p-4 mt-auto border-t border-border/50">
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t("cancel")}</span> {/* Using cancel as logout placeholder */}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Trigger */}
      <div className="lg:hidden fixed top-4 left-4 z-50 ltr:left-4 rtl:right-4 rtl:left-auto">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shadow-lg border-primary/10">
              <Menu className="w-5 h-5 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side={language === 'ar' ? 'right' : 'left'} className="p-0 border-r-0 w-72">
            <NavContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 fixed inset-y-0 border-r border-border/50 bg-background/50 backdrop-blur-xl z-40">
        <NavContent />
      </aside>
    </>
  );
}
