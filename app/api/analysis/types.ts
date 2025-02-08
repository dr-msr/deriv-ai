export type ProfitLossStatus = 'profit' | 'loss' | 'neutral';
export type TrendDirection = 'up' | 'down' | 'stable';
export type RiskLevel = 'high' | 'medium' | 'low';

export interface SimilarTransaction {
  id: string;
  date_and_time: Date;
  stock_price: number;
  buy_or_sell: string;
  similarity: number;
  profitLoss?: ProfitLossStatus;
  headlines?: string;
}

export interface TrendAnalysis {
  priceChange: number;
  priceChangePercentage: number;
  trendDirection: TrendDirection;
  recommendation: string;
  riskLevel: RiskLevel;
}

export interface AIValidation {
  agreement: boolean;
  reasoning: string;
  adjustedRecommendation?: string;
  confidenceScore: number;
  keyFactors: string[];
  summary: string;
}

export interface AnalysisResult {
  currentNews: string[];
  currentPrice: number;
  similarTransactions: SimilarTransaction[];
  trendAnalysis: TrendAnalysis;
  aiValidation?: AIValidation;
}
