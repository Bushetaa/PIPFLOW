import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertAnalysisReport } from "@shared/routes";

export function useReports(filters?: { pair?: string; sentiment?: string }) {
  // Construct query key based on filters to ensure proper caching
  const queryKey = [api.reports.list.path, filters?.pair, filters?.sentiment].filter(Boolean);
  
  return useQuery({
    queryKey,
    queryFn: async () => {
      // Build query string manually or use URLSearchParams
      const url = new URL(api.reports.list.path, window.location.origin);
      if (filters?.pair) url.searchParams.append("pair", filters.pair);
      if (filters?.sentiment) url.searchParams.append("sentiment", filters.sentiment);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch reports");
      return api.reports.list.responses[200].parse(await res.json());
    },
  });
}

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: InsertAnalysisReport) => {
      const validated = api.reports.create.input.parse(data);
      const res = await fetch(api.reports.create.path, {
        method: api.reports.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.reports.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create report");
      }
      return api.reports.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.reports.list.path] });
    },
  });
}
