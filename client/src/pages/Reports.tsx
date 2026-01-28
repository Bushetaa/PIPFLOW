import { useLanguage } from "@/hooks/use-language";
import { useReports } from "@/hooks/use-reports";
import { Loader2, ArrowLeft } from "lucide-react";
import { ReportModal } from "@/components/ReportModal";
import { format } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { ar } from "date-fns/locale/ar";
import { cn } from "@/lib/utils";
import { Link } from "wouter";

export default function Reports() {
  const { t, language } = useLanguage();
  const { data: reports, isLoading } = useReports();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-display font-bold">{t("reports")}</h2>
        <ReportModal />
      </div>
      
      <div>
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          {t("back_to_home")}
        </Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {reports?.map(report => (
            <div key={report.id} className="glass-card p-6 rounded-2xl flex flex-col gap-4">
               <div className="flex justify-between items-start">
                 <div>
                   <span className="text-2xl font-bold font-mono text-primary">{report.pair}</span>
                   <span className="mx-2 text-muted-foreground">•</span>
                   <span className="text-sm font-medium text-muted-foreground">{report.timeframe}</span>
                 </div>
                 <span className={cn(
                   "px-3 py-1 rounded-full text-xs font-bold uppercase",
                   report.sentiment === 'bullish' ? 'bg-success/10 text-success' :
                   report.sentiment === 'bearish' ? 'bg-destructive/10 text-destructive' :
                   'bg-muted text-muted-foreground'
                 )}>
                   {t(report.sentiment)}
                 </span>
               </div>

               <h3 className="text-lg font-bold line-clamp-1">
                 {language === 'ar' ? report.titleAr : report.titleEn}
               </h3>
               
               <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 flex-1">
                 {language === 'ar' ? report.summaryAr : report.summaryEn}
               </p>

               <div className="flex justify-between items-center pt-4 border-t border-border/50 text-xs text-muted-foreground mt-auto">
                 <span>{t("confidence")}: <span className="font-bold text-foreground">{report.confidence}%</span></span>
                 <span>{report.createdAt ? format(new Date(report.createdAt), 'PP', { locale: language === 'ar' ? ar : enUS }) : ''}</span>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
