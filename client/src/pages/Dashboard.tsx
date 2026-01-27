import { useLanguage } from "@/hooks/use-language";
import { useMarketOverview } from "@/hooks/use-market-data";
import { useReports } from "@/hooks/use-reports";
import { MarketCard } from "@/components/MarketCard";
import { ReportModal } from "@/components/ReportModal";
import { motion } from "framer-motion";
import { Loader2, TrendingUp, AlertCircle, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { data: marketData, isLoading: isMarketLoading } = useMarketOverview();
  const { data: reports, isLoading: isReportsLoading } = useReports();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={container}
      className="space-y-8"
    >
      {/* Market Overview Section */}
      <section>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              {t("overview")}
            </h2>
          </div>
        </div>

        {isMarketLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          </div>
        ) : marketData?.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">{t("no_data")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {marketData?.map((data) => (
              <motion.div key={data.id} variants={item}>
                <MarketCard data={data} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Reports Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-display font-semibold text-foreground flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            {t("recent_analysis")}
          </h2>
          <ReportModal />
        </div>

        {isReportsLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
          </div>
        ) : reports?.length === 0 ? (
          <div className="text-center py-12 bg-muted/30 rounded-2xl border border-dashed border-border">
            <p className="text-muted-foreground">{t("no_data")}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports?.map((report) => (
              <motion.div 
                key={report.id} 
                variants={item}
                className="glass-card p-6 rounded-2xl hover:border-primary/30 transition-colors group"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0 flex md:flex-col items-center gap-4 md:gap-2 md:w-32 border-b md:border-b-0 md:border-r border-border/50 pb-4 md:pb-0 md:pr-6">
                    <div className="text-2xl font-bold font-mono text-primary">{report.pair}</div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                      report.sentiment === 'bullish' ? 'bg-success/10 text-success' :
                      report.sentiment === 'bearish' ? 'bg-destructive/10 text-destructive' :
                      'bg-muted text-muted-foreground'
                    )}>
                      {t(report.sentiment)}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-1">
                      {report.timeframe} • {report.confidence}%
                    </div>
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                        {language === 'ar' ? report.titleAr : report.titleEn}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.createdAt ? format(new Date(report.createdAt), 'MMM d, yyyy') : ''}
                      </div>
                    </div>
                    <p className="text-muted-foreground leading-relaxed line-clamp-2 md:line-clamp-none">
                      {language === 'ar' ? report.summaryAr : report.summaryEn}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}
