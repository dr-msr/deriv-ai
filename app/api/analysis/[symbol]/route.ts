import { PrismaClient } from '@prisma/client'
import { NextResponse, NextRequest } from 'next/server'
import yahooFinance from 'yahoo-finance2';
import OpenAI from 'openai';
import { 
  AnalysisResult, 
  SimilarTransaction, 
  TrendDirection, 
  RiskLevel, 
  ProfitLossStatus,
  AIValidation
} from '../types';

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function validateAnalysis(
  symbol: string,
  news: { title: string }[],
  currentPrice: number,
  similarTransactions: SimilarTransaction[],
  trendAnalysis: AnalysisResult['trendAnalysis']
): Promise<AIValidation> {
  const prompt = `As a financial expert, analyze this trading situation for ${symbol}:

Current Price: $${currentPrice}
Price Change: ${trendAnalysis.priceChange} (${trendAnalysis.priceChangePercentage.toFixed(2)}%)
Trend Direction: ${trendAnalysis.trendDirection}
Risk Level: ${trendAnalysis.riskLevel}
System Recommendation: ${trendAnalysis.recommendation}

Recent News:
${news.map(n => `- ${n.title}`).join('\n')}

Similar Historical Transactions:
${similarTransactions.map(t => 
  `- ${t.buy_or_sell.toUpperCase()} at $${t.stock_price} (${new Date(t.date_and_time).toLocaleDateString()})`
).join('\n')}

Challenge this analysis and provide:
1. Do you agree with the trend analysis? Why or why not?
2. What key factors support or contradict the analysis?
3. What's your confidence in this assessment (0-100)?
4. Provide a concise summary and recommendation.

You need to consider that some of the data are dummy generated data.

Format your response in JSON:
{
  "agreement": boolean,
  "reasoning": "detailed explanation",
  "adjustedRecommendation": "only if you disagree",
  "confidenceScore": number,
  "keyFactors": ["list of key factors"],
  "summary": "concise summary"
}`;


const completion = await openai.chat.completions.create({
  model: 'o1-preview',
  messages: [
    {
      role: 'user',
      content: prompt,
    },
  ],
});

  try {
    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('AI response content is null');
    }
    // Clean the response by removing markdown code block syntax
    const cleanContent = content.replace(/```json\n|\n```/g, '');
    const response = JSON.parse(cleanContent) as AIValidation;
    return response;
  } catch (error) {
    console.error('Error parsing AI response:', error);
    throw new Error('Failed to parse AI validation response');
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const companySymbol = symbol.toUpperCase();
  try {

    // Get optional query parameters
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') ?? '5');
    const volatilityThreshold = parseFloat(searchParams.get('volatilityThreshold') ?? '0.05');
    const trendThreshold = parseFloat(searchParams.get('trendThreshold') ?? '1.0');

    // 1. Get current news and generate embeddings
    const results = await yahooFinance.search(companySymbol);
    const news = results.news.slice(0, 5);
    const titles = news.map(item => item.title).join(" ");
    
    const embedding = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: titles,
    });

    if (!embedding?.data?.[0]?.embedding) {
      return NextResponse.json(
        { success: false, error: 'Failed to generate embeddings' },
        { status: 500 }
      );
    }

    // 2. Perform vector similarity search with dynamic limit
    const vectorQuery = await prisma.$queryRaw`
      WITH similar_transactions AS (
        SELECT 
          id,
          company_symbol,
          stock_price,
          date_and_time,
          buy_or_sell,
          headlines,
          1 - (embeddings <=> ${embedding.data[0].embedding}::vector(1536)) as similarity
        FROM transaction
        WHERE company_symbol = ${companySymbol}
          AND embeddings IS NOT NULL
        ORDER BY similarity DESC
        LIMIT ${limit}
      )
      SELECT * FROM similar_transactions
      ORDER BY date_and_time DESC;
    `;

    const transactions = vectorQuery as SimilarTransaction[];

    // 4. Get current market price
    const summary = await yahooFinance.quoteSummary(companySymbol);
    const currentPrice = summary?.price?.regularMarketPrice;

    if (!currentPrice) {
      return NextResponse.json(
        { success: false, error: 'Could not fetch current price' },
        { status: 404 }
      );
    }

    // 5 & 6. Analyze trend and determine risk
    const sortedTransactions = [...transactions].sort((a, b) => 
      a.date_and_time.getTime() - b.date_and_time.getTime()
    );

    const mostRecentPrice = sortedTransactions[sortedTransactions.length - 1]?.stock_price;
    const priceChange = currentPrice - mostRecentPrice;
    const priceChangePercentage = (priceChange / mostRecentPrice) * 100;

    // Determine trend direction with dynamic threshold
    let trendDirection: TrendDirection = 'stable';
    if (Math.abs(priceChangePercentage) > trendThreshold) {
      trendDirection = priceChangePercentage > 0 ? 'up' : 'down';
    }

    // Analyze price volatility for risk assessment with dynamic threshold
    const priceVolatility = sortedTransactions.reduce((acc, curr, idx, arr) => {
      if (idx === 0) return 0;
      const prevPrice = arr[idx - 1].stock_price;
      const change = Math.abs((curr.stock_price - prevPrice) / prevPrice);
      return acc + change;
    }, 0) / (sortedTransactions.length - 1);

    let riskLevel: RiskLevel = 'medium';
    if (priceVolatility > volatilityThreshold) riskLevel = 'high';
    if (priceVolatility < volatilityThreshold / 5) riskLevel = 'low';

    // Generate recommendation
    let recommendation = '';
    if (trendDirection === 'up' && riskLevel !== 'high') {
      recommendation = 'Consider buying - upward trend with manageable risk';
    } else if (trendDirection === 'down' && riskLevel !== 'high') {
      recommendation = 'Consider selling - downward trend detected';
    } else if (riskLevel === 'high') {
      recommendation = 'Exercise caution - high market volatility';
    } else {
      recommendation = 'Market is stable - monitor for clear trends';
    }

    // Mark transactions as profit/loss
    const analyzedTransactions = transactions.map(t => ({
      ...t,
      profitLoss: t.stock_price < currentPrice ? 'profit' as ProfitLossStatus : 
                  t.stock_price > currentPrice ? 'loss' as ProfitLossStatus : 
                  'neutral' as ProfitLossStatus
    }));

    const initialResponse: AnalysisResult = {
      currentNews: news.map(n => n.title),
      currentPrice,
      similarTransactions: analyzedTransactions,
      trendAnalysis: {
        priceChange,
        priceChangePercentage,
        trendDirection,
        recommendation,
        riskLevel
      }
    };

    // Add AI validation
    const aiValidation = await validateAnalysis(
      companySymbol,
      news,
      currentPrice,
      analyzedTransactions,
      initialResponse.trendAnalysis
    );

    const response: AnalysisResult = {
      ...initialResponse,
      aiValidation
    };

    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.log('Analysis error:', JSON.stringify(error));
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
