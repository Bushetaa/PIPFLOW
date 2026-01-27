import { marketData, analysisReports, type MarketData, type InsertMarketData, type AnalysisReport, type InsertAnalysisReport } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getMarketOverview(): Promise<MarketData[]>;
  getTicker(pair: string): Promise<MarketData | undefined>;
  getReports(pair?: string, sentiment?: string): Promise<AnalysisReport[]>;
  createReport(report: InsertAnalysisReport): Promise<AnalysisReport>;
  createMarketData(data: InsertMarketData): Promise<MarketData>;
  updateMarketData(id: number, data: Partial<InsertMarketData>): Promise<MarketData>;
  seedInitialData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getMarketOverview(): Promise<MarketData[]> {
    return await db.select().from(marketData);
  }

  async getTicker(pair: string): Promise<MarketData | undefined> {
    const [ticker] = await db.select().from(marketData).where(eq(marketData.pair, pair));
    return ticker;
  }

  async getReports(pair?: string, sentiment?: string): Promise<AnalysisReport[]> {
    let query = db.select().from(analysisReports).orderBy(desc(analysisReports.createdAt));
    
    if (pair) {
      query.where(eq(analysisReports.pair, pair));
    }
    
    // Note: handling multiple filters nicely would require dynamic where building, 
    // for MVP simplified to simple conditions or all.
    // Drizzle query builder supports conditional where if chained, but simple implementation here:
    
    const results = await query;
    if (pair) {
        return results.filter(r => r.pair === pair);
    }
    if (sentiment) {
        return results.filter(r => r.sentiment === sentiment);
    }
    return results;
  }

  async createReport(report: InsertAnalysisReport): Promise<AnalysisReport> {
    const [newReport] = await db.insert(analysisReports).values(report).returning();
    return newReport;
  }

  async createMarketData(data: InsertMarketData): Promise<MarketData> {
    const [newData] = await db.insert(marketData).values(data).returning();
    return newData;
  }

  async updateMarketData(id: number, data: Partial<InsertMarketData>): Promise<MarketData> {
    const [updated] = await db.update(marketData).set(data).where(eq(marketData.id, id)).returning();
    return updated;
  }

  async seedInitialData(): Promise<void> {
    const existing = await this.getMarketOverview();
    if (existing.length === 0) {
      await this.createMarketData({
        pair: "EUR/USD",
        price: "1.0850",
        change24h: "0.25",
        high24h: "1.0890",
        low24h: "1.0810",
        sentiment: "bullish"
      });
      await this.createMarketData({
        pair: "GBP/USD",
        price: "1.2730",
        change24h: "-0.15",
        high24h: "1.2780",
        low24h: "1.2690",
        sentiment: "bearish"
      });
       await this.createMarketData({
        pair: "USD/JPY",
        price: "148.20",
        change24h: "0.50",
        high24h: "148.50",
        low24h: "147.80",
        sentiment: "bullish"
      });
      await this.createMarketData({
        pair: "XAU/USD",
        price: "2035.50",
        change24h: "1.20",
        high24h: "2040.00",
        low24h: "2020.00",
        sentiment: "bullish"
      });
      
      // Seed Reports
      await this.createReport({
        pair: "EUR/USD",
        titleEn: "EUR/USD Bullish Momentum Continues",
        titleAr: "استمرار الزخم الصعودي لليورو مقابل الدولار",
        summaryEn: "The pair has broken key resistance levels at 1.0850. Technical indicators suggest further upside potential towards 1.0900.",
        summaryAr: "كسر الزوج مستويات المقاومة الرئيسية عند 1.0850. تشير المؤشرات الفنية إلى احتمالية المزيد من الصعود نحو 1.0900.",
        sentiment: "bullish",
        timeframe: "H4",
        confidence: 85
      });
      
      await this.createReport({
        pair: "GBP/USD",
        titleEn: "GBP/USD Facing Resistance",
        titleAr: "الجنيه الإسترليني يواجه مقاومة",
        summaryEn: "Strong selling pressure observed near 1.2780. A pullback to 1.2690 is likely before any new upward movement.",
        summaryAr: "لوحظ ضغط بيع قوي بالقرب من 1.2780. من المحتمل حدوث تراجع إلى 1.2690 قبل أي حركة صعودية جديدة.",
        sentiment: "bearish",
        timeframe: "H1",
        confidence: 70
      });
    }
  }
}

export const storage = new DatabaseStorage();
