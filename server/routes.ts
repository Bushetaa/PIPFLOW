import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { hasuraExec } from "./hasura";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Initialize seed data
  await storage.seedInitialData();

  // Market Overview
  app.get(api.market.overview.path, async (req, res) => {
    const data = await storage.getMarketOverview();
    res.json(data);
  });

  // Individual Ticker
  app.get(api.market.ticker.path, async (req, res) => {
    const pair = req.params.pair as string;
    const ticker = await storage.getTicker(pair);
    if (!ticker) {
      return res.status(404).json({ message: "Ticker not found" });
    }
    res.json(ticker);
  });

  // Reports List
  app.get(api.reports.list.path, async (req, res) => {
    const pair = req.query.pair as string | undefined;
    const sentiment = req.query.sentiment as string | undefined;
    const reports = await storage.getReports(pair, sentiment);
    res.json(reports);
  });

  // Create Report
  app.post(api.reports.create.path, async (req, res) => {
    try {
      const input = api.reports.create.input.parse(req.body);
      const report = await storage.createReport(input);
      res.status(201).json(report);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // External: Hasura finance_reports
  app.get("/api/ext/finance_reports", async (_req, res, next) => {
    try {
      const data = await hasuraExec<{ finance_reports: any[] }>(`
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
      `);
      res.json(data.finance_reports);
    } catch (err: any) {
      next(Object.assign(err, { status: err.status || 500 }));
    }
  });

  // External: Hasura finance_report_content
  app.get("/api/ext/finance_report_content", async (_req, res, next) => {
    try {
      const data = await hasuraExec<{ finance_report_content: any[] }>(`
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
      `);
      res.json(data.finance_report_content);
    } catch (err: any) {
      next(Object.assign(err, { status: err.status || 500 }));
    }
  });

  // External: Hasura finance_news_items
  app.get("/api/ext/finance_news_items", async (_req, res, next) => {
    try {
      const data = await hasuraExec<{ finance_news_items: any[] }>(`
        query GetNewsItems {
          finance_news_items {
            raw_json
            link
            published_at_raw
            summary
            title
            created_at
            published_at
            id
            report_id
          }
        }
      `);
      res.json(data.finance_news_items);
    } catch (err: any) {
      next(Object.assign(err, { status: err.status || 500 }));
    }
  });

  // External: Hasura finance_report_seo
  app.get("/api/ext/finance_report_seo", async (_req, res, next) => {
    try {
      const data = await hasuraExec<{ finance_report_seo: any[] }>(`
        query GetReportSeo {
          finance_report_seo {
            secondary_keywords
            tags
            focus_keyword
            meta_description
            meta_title
            slug
            created_at
            report_id
          }
        }
      `);
      res.json(data.finance_report_seo);
    } catch (err: any) {
      next(Object.assign(err, { status: err.status || 500 }));
    }
  });

  return httpServer;
}
