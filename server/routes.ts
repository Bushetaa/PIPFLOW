import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

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
    const pair = req.params.pair;
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

  return httpServer;
}
