import { useQuery } from "@tanstack/react-query";
import { hasuraQuery } from "@/lib/hasura";

const GET_REPORTS = `
  query GetReports {
    finance_reports {
      news_count
      name
      source
      status
      created_at
      report_date_utc
      updated_at
      id
    }
  }
`;

const GET_REPORT_CONTENT = `
  query GetReportContent {
    finance_report_content {
      article_html
      article_markdown
      excerpt
      language
      theme
      created_at
      report_id
    }
  }
`;

type FinanceReport = {
  news_count: number | null
  name: string
  source: string | null
  status: string | null
  created_at: string
  report_date_utc: string | null
  updated_at: string | null
  id: string
}

type FinanceReportContent = {
  article_html: string | null
  article_markdown: string | null
  excerpt: string | null
  language: string | null
  theme: string | null
  created_at: string
  report_id: string
}

type FinanceNewsItem = {
  raw_json: string | null
  link: string | null
  published_at_raw: string | null
  summary: string | null
  title: string | null
  created_at: string
  published_at: string | null
  id: string
  report_id: string
}

type FinanceReportSeo = {
  secondary_keywords: string | null
  tags: string | null
  focus_keyword: string | null
  meta_description: string | null
  meta_title: string | null
  slug: string | null
  created_at: string
  report_id: string
}

export function useFinanceReports() {
  return useQuery({
    queryKey: ["hasura", "finance_reports"],
    queryFn: async () => {
      const res = await fetch("/api/ext/finance_reports");
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as FinanceReport[];
    },
  });
}

export function useFinanceReportContent() {
  return useQuery({
    queryKey: ["hasura", "finance_report_content"],
    queryFn: async () => {
      const res = await fetch("/api/ext/finance_report_content");
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as FinanceReportContent[];
    },
  });
}

export function useFinanceNewsItems() {
  return useQuery({
    queryKey: ["hasura", "finance_news_items"],
    queryFn: async () => {
      const res = await fetch("/api/ext/finance_news_items");
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as FinanceNewsItem[];
    },
  });
}

export function useFinanceReportSeo() {
  return useQuery({
    queryKey: ["hasura", "finance_report_seo"],
    queryFn: async () => {
      const res = await fetch("/api/ext/finance_report_seo");
      if (!res.ok) throw new Error(await res.text());
      return (await res.json()) as FinanceReportSeo[];
    },
  });
}
