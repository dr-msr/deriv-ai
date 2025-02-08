"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { InfoIcon, TrendingDown, TrendingUp, AlertTriangle } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { AnalysisResult } from "@/app/api/analysis/types";

interface LiveAnalysisProps {
  data: AnalysisResult;
}

export function LiveAnalysis({ data }: LiveAnalysisProps) {
  const {
    currentNews,
    currentPrice,
    similarTransactions,
    trendAnalysis,
    aiValidation,
  } = data;

  return (
    <div className="grid gap-4">
      {/* Current Price and Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Current Price
            <span className="text-2xl font-bold">${currentPrice.toFixed(2)}</span>
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            {trendAnalysis.trendDirection === "up" ? (
              <TrendingUp className="text-green-500" />
            ) : (
              <TrendingDown className="text-red-500" />
            )}
            <span className={trendAnalysis.priceChange >= 0 ? "text-green-500" : "text-red-500"}>
              {trendAnalysis.priceChange >= 0 ? "+" : ""}
              ${Math.abs(trendAnalysis.priceChange).toFixed(2)} ({trendAnalysis.priceChangePercentage.toFixed(2)}%)
            </span>
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Current News */}
      <Card>
        <CardHeader>
          <CardTitle>Latest News</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <ul className="space-y-2">
              {currentNews.map((news, index) => (
                <li key={index} className="border-b pb-2 last:border-0">
                  <a 
                    href={news} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm hover:underline text-primary"
                  >
                    {news}
                  </a>
                </li>
              ))}
            </ul>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* AI Validation */}
      {aiValidation && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5" />
              AI Analysis
              <Badge variant={aiValidation.agreement ? "default" : "destructive"}>
                {aiValidation.confidenceScore}% Confidence
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Recommendation</AlertTitle>
              <AlertDescription>{aiValidation.adjustedRecommendation}</AlertDescription>
            </Alert>
            <div className="space-y-2">
              <h4 className="font-semibold">Key Factors:</h4>
              <ul className="list-disc pl-4 space-y-1">
                {aiValidation.keyFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Similar Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Similar Market Conditions</CardTitle>
          <CardDescription>Historical transactions with similar market conditions</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {similarTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col gap-2 p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <Badge variant={transaction.buy_or_sell === "buy" ? "default" : "secondary"}>
                      {transaction.buy_or_sell.toUpperCase()}
                    </Badge>
                    <span className="font-semibold">${transaction.stock_price.toFixed(2)}</span>
                  </div>
                  <div>{transaction.headlines}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(new Date(transaction.date_and_time))}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline">
                      Similarity: {(transaction.similarity * 100).toFixed(1)}%
                    </Badge>
                    {transaction.profitLoss && (
                      <Badge
                        variant={transaction.profitLoss === "profit" ? "default" : "destructive"}
                      >
                        {transaction.profitLoss.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}