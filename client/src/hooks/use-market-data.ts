import { useQuery } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type MarketData } from "@shared/schema";

export function useMarketOverview() {
  return useQuery({
    queryKey: [api.market.overview.path],
    queryFn: async () => {
      const res = await fetch(api.market.overview.path);
      if (!res.ok) throw new Error("Failed to fetch market overview");
      return api.market.overview.responses[200].parse(await res.json());
    },
    refetchInterval: 30000, // Refresh every 30s
  });
}

export function useTicker(pair: string) {
  return useQuery({
    queryKey: [api.market.ticker.path, pair],
    queryFn: async () => {
      const url = buildUrl(api.market.ticker.path, { pair });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch ticker");
      return api.market.ticker.responses[200].parse(await res.json());
    },
    enabled: !!pair,
  });
}
