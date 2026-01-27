import { type MarketData } from "@shared/schema";
import { useLanguage } from "@/hooks/use-language";
import { ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { AreaChart, Area, ResponsiveContainer, YAxis } from "recharts";

interface MarketCardProps {
  data: MarketData;
}

export function MarketCard({ data }: MarketCardProps) {
  const { t } = useLanguage();
  const isBullish = data.sentiment === "bullish";
  const isBearish = data.sentiment === "bearish";

  // Mock chart data based on price movement
  const basePrice = Number(data.price);
  const chartData = Array.from({ length: 20 }, (_, i) => ({
    value: basePrice + (Math.random() - 0.5) * (basePrice * 0.005) + (isBullish ? i * 0.0001 : isBearish ? -i * 0.0001 : 0)
  }));

  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
        {isBullish ? (
          <ArrowUpRight className="w-24 h-24 text-success" />
        ) : isBearish ? (
          <ArrowDownRight className="w-24 h-24 text-destructive" />
        ) : (
          <Minus className="w-24 h-24 text-muted-foreground" />
        )}
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold font-mono tracking-tight text-foreground">{data.pair}</h3>
            <span className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full inline-block mt-1",
              isBullish ? "bg-success/10 text-success" : isBearish ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
            )}>
              {t(data.sentiment)}
            </span>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold font-mono text-foreground">
              {Number(data.price).toFixed(5)}
            </p>
            <div className={cn("flex items-center justify-end gap-1 text-sm font-medium", 
              Number(data.change24h) >= 0 ? "text-success" : "text-destructive"
            )}>
              {Number(data.change24h) >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(Number(data.change24h))}%
            </div>
          </div>
        </div>

        <div className="h-16 w-full mt-4 opacity-50 group-hover:opacity-100 transition-opacity">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${data.pair}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isBullish ? "rgb(var(--success))" : isBearish ? "rgb(var(--destructive))" : "gray"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isBullish ? "rgb(var(--success))" : isBearish ? "rgb(var(--destructive))" : "gray"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis domain={['auto', 'auto']} hide />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke={isBullish ? "rgb(var(--success))" : isBearish ? "rgb(var(--destructive))" : "gray"} 
                strokeWidth={2}
                fill={`url(#gradient-${data.pair})`} 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground font-mono">
          <div>
            <span className="block opacity-70">{t("high")}</span>
            <span className="font-medium text-foreground">{Number(data.high24h).toFixed(5)}</span>
          </div>
          <div className="text-right">
            <span className="block opacity-70">{t("low")}</span>
            <span className="font-medium text-foreground">{Number(data.low24h).toFixed(5)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
