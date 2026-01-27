import { pgTable, text, serial, integer, boolean, timestamp, numeric, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const marketData = pgTable("market_data", {
  id: serial("id").primaryKey(),
  pair: varchar("pair", { length: 20 }).notNull(), // e.g., "EUR/USD"
  price: numeric("price", { precision: 10, scale: 5 }).notNull(),
  change24h: numeric("change_24h", { precision: 5, scale: 2 }).notNull(),
  high24h: numeric("high_24h", { precision: 10, scale: 5 }).notNull(),
  low24h: numeric("low_24h", { precision: 10, scale: 5 }).notNull(),
  sentiment: varchar("sentiment", { length: 10 }).notNull(), // "bullish", "bearish", "neutral"
  lastUpdated: timestamp("last_updated").defaultNow(),
});

export const analysisReports = pgTable("analysis_reports", {
  id: serial("id").primaryKey(),
  pair: varchar("pair", { length: 20 }).notNull(),
  titleEn: text("title_en").notNull(),
  titleAr: text("title_ar").notNull(),
  summaryEn: text("summary_en").notNull(),
  summaryAr: text("summary_ar").notNull(),
  sentiment: varchar("sentiment", { length: 10 }).notNull(), // "bullish", "bearish", "neutral"
  timeframe: varchar("timeframe", { length: 10 }).notNull(), // "H1", "H4", "D1"
  confidence: integer("confidence").notNull(), // 0-100
  createdAt: timestamp("created_at").defaultNow(),
});

// === SCHEMAS ===

export const insertMarketDataSchema = createInsertSchema(marketData).omit({ id: true, lastUpdated: true });
export const insertAnalysisReportSchema = createInsertSchema(analysisReports).omit({ id: true, createdAt: true });

// === EXPLICIT API TYPES ===

export type MarketData = typeof marketData.$inferSelect;
export type InsertMarketData = z.infer<typeof insertMarketDataSchema>;

export type AnalysisReport = typeof analysisReports.$inferSelect;
export type InsertAnalysisReport = z.infer<typeof insertAnalysisReportSchema>;

export type CreateReportRequest = InsertAnalysisReport;
export type UpdateReportRequest = Partial<InsertAnalysisReport>;

// Response types
export type MarketOverviewResponse = MarketData[];
export type ReportsListResponse = AnalysisReport[];
