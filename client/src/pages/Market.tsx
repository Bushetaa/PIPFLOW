import { useLanguage } from "@/hooks/use-language";
import { useMarketOverview } from "@/hooks/use-market-data";
import { Loader2 } from "lucide-react";
import { MarketCard } from "@/components/MarketCard";
import { Input } from "@/components/ui/input";
import { useState } from "react";

export default function Market() {
  const { t } = useLanguage();
  const { data: marketData, isLoading } = useMarketOverview();
  const [search, setSearch] = useState("");

  const filteredData = marketData?.filter(item => 
    item.pair.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
        <h2 className="text-2xl font-display font-bold">{t("market")}</h2>
        <Input 
          placeholder={t("search")} 
          className="max-w-xs font-mono"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredData.map(data => (
            <MarketCard key={data.id} data={data} />
          ))}
          {filteredData.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {t("no_data")}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
