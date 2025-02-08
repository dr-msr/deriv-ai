import { NextResponse, NextRequest } from 'next/server'
import yahooFinance from 'yahoo-finance2';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ symbol: string }> }
) {
  const { symbol } = await params;
  const companySymbol = symbol.toUpperCase();
  
  try {
    const news = await yahooFinance.search(companySymbol, {
      newsCount: 5,
      enableEnhancedTrivialQuery: true,
    });

    if (!news?.news?.length) {
      return NextResponse.json(
        { success: false, error: 'No news found' },
        { status: 404 }
      );
    }

    // Format news data
    const formattedNews = news.news.map(item => ({
      title: item.title,
      link: item.link,
      publisher: item.publisher,
      publishedAt: item.providerPublishTime
    }));

    return NextResponse.json({ success: true, data: formattedNews });
  } catch (error) {
    console.log('News fetch error:', JSON.stringify(error));
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    );
  }
}
