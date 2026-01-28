import { useLanguage } from "@/hooks/use-language";
import { useMarketOverview } from "@/hooks/use-market-data";
import { useFinanceReports } from "@/hooks/use-hasura-reports";
import { MarketCard } from "@/components/MarketCard";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, TrendingUp, AlertCircle, Calendar, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { ar } from "date-fns/locale/ar";
import { Link } from "wouter";

export default function Dashboard() {
  const { t, language } = useLanguage();
  const { data: marketData, isLoading: isMarketLoading } = useMarketOverview();
  const { data: reports, isLoading: isReportsLoading, error: reportsError } = useFinanceReports();

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
    <div className="relative">
      {/* 3D Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-primary/5 blur-3xl"
        />
        <motion.div 
          animate={{ 
            y: [0, 30, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[10%] w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        />
      </div>

      <motion.div 
        initial="hidden"
        animate="show"
        variants={container}
        className="space-y-12 pb-20"
      >
        {/* Simplified Read-Only Output Grid */}
        <section>
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-primary" />
              <span>{t("overview")}</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {t("market_insights")}
            </p>
          </div>

          {isMarketLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {marketData?.map((data) => (
                  <motion.div 
                    key={data.id} 
                    variants={item}
                    whileHover={{ y: -5 }}
                    className="glass-card p-8 rounded-[2rem] relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                      {data.sentiment === 'bullish' ? <ArrowUpRight size={48} /> : 
                       data.sentiment === 'bearish' ? <ArrowDownRight size={48} /> : <Minus size={48} />}
                    </div>

                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold font-mono tracking-tighter text-foreground">
                          {data.pair}
                        </h3>
                        
                      </div>
                      <div className={cn(
                        "flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-bold shadow-sm",
                        data.sentiment === 'bullish' ? "bg-success/10 text-success border border-success/20" :
                        data.sentiment === 'bearish' ? "bg-destructive/10 text-destructive border border-destructive/20" :
                        "bg-muted text-muted-foreground border border-border"
                      )}>
                        {data.sentiment === 'bullish' ? <ArrowUpRight className="w-4 h-4" /> : 
                         data.sentiment === 'bearish' ? <ArrowDownRight className="w-4 h-4" /> : null}
                        {t(data.sentiment)}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-4xl font-display font-bold tracking-tight text-foreground">
                          {data.price}
                        </div>
                        <div className={cn(
                          "text-lg font-bold mt-1",
                          parseFloat(data.change24h) >= 0 ? "text-success" : "text-destructive"
                        )}>
                          {parseFloat(data.change24h) >= 0 ? '+' : ''}{data.change24h}%
                        </div>
                      </div>

                      <div className="pt-4 border-t border-border/50 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t("high")}</p>
                          <p className="font-mono font-medium">{data.high24h}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">{t("low")}</p>
                          <p className="font-mono font-medium">{data.low24h}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </section>

        {/* Detailed Analysis Output */}
        <section>
          <div className="flex flex-col gap-2 mb-8">
            <h2 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-primary" />
              <span>{t("recent_analysis")}</span>
            </h2>
          </div>

          {isReportsLoading ? (
            <div className="flex justify-center py-24">
              <Loader2 className="w-10 h-10 animate-spin text-primary/30" />
            </div>
          ) : reportsError ? (
            <div className="glass-card p-8 rounded-2xl">
              <p className="text-destructive font-bold">Failed to load reports</p>
              <p className="text-muted-foreground text-sm mt-2">
                Check Hasura URL, admin secret, or JWT environment variables.
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                {String((reportsError as any)?.message || "")}
              </p>
            </div>
          ) : !reports || reports.length === 0 ? (
            <div className="glass-card p-8 rounded-2xl">
              <p className="text-muted-foreground">No reports available.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reports?.map((report) => (
                <Link key={report.id} href={`/reports/${report.id}`}>
                  <motion.div 
                    variants={item}
                    className="glass-card p-8 rounded-[2.5rem] relative group cursor-pointer"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                      <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-foreground font-display">
                          {report.name}
                        </h3>
                        <div className="flex items-center gap-3 text-sm">
                          <span className="px-3 py-1 rounded-full bg-secondary/50 border border-border/50 font-bold uppercase tracking-widest">
                            {report.status || "NEW"}
                          </span>
                          {report.source && (
                            <span className="text-muted-foreground">{report.source}</span>
                          )}
                          {typeof report.news_count === "number" && (
                            <span className="text-primary font-bold">{report.news_count} News</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-muted/50 text-xs font-bold text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {report.created_at ? format(new Date(report.created_at), 'MMMM dd, yyyy', { locale: language === 'ar' ? ar : enUS }) : ''}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </motion.div>
    </div>
  );
}
