import { NextResponse, NextRequest } from 'next/server'
import yahooFinance from 'yahoo-finance2';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const companySymbol = symbol.toUpperCase();
  try {

    // 4. Get current market price
    const summary = await yahooFinance.quoteSummary(companySymbol);
    const currentPrice = summary?.price?.regularMarketPrice;

    if (!currentPrice) {
      return NextResponse.json(
        { success: false, error: 'Could not fetch current price' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: currentPrice });
  } catch (error) {
    console.log('Analysis error:', JSON.stringify(error));
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
