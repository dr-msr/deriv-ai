import { PrismaClient } from '@prisma/client'
import { NextResponse } from 'next/server'
import yahooFinance from 'yahoo-finance2';
import OpenAI from 'openai';

interface TransactionBody {
  companySymbol: string;
  buyerId: string;
  type: 'buy' | 'sell';
}

const prisma = new PrismaClient()
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function POST(request: Request) {
  try {
    const body = await request.json() as TransactionBody;
    const { companySymbol, buyerId, type } = body

    if (!companySymbol || !buyerId || !type) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const results = await yahooFinance.search(companySymbol);
    
    if (!results?.news?.length) {
      return NextResponse.json(
        { success: false, error: 'No news found for company' },
        { status: 404 }
      );
    }

    const news = results.news.slice(0, 5);
    const summary = await yahooFinance.quoteSummary(companySymbol);

    const price = summary?.price?.regularMarketPrice;

    if (!price) {
      return NextResponse.json(
        { success: false, error: 'Could not fetch stock price' },
        { status: 404 }
      );
    }

    console.log('Stock price:', price);

    // Generate embeddings for news titles
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

    // Create transaction with vector embedding using raw SQL
    const transaction = await prisma.$queryRaw`
      WITH inserted AS (
        INSERT INTO transaction (
          id,
          company_symbol,
          stock_price,
          buyer_id,
          buy_or_sell,
          headlines,
          date_and_time,
          embeddings
        )
        VALUES (
          ${crypto.randomUUID()},
          ${companySymbol},
          ${price},
          ${buyerId},
          ${type},
          ${titles},
          ${new Date()},
          ${embedding.data[0].embedding}::vector
        )
        RETURNING 
          id,
          company_symbol,
          stock_price,
          buyer_id,
          buy_or_sell,
          headlines,
          date_and_time,
          embeddings::text
      )
      SELECT * FROM inserted;
    `;

    // Raw SQL returns an array, take the first item
    const createdTransaction = Array.isArray(transaction) ? transaction[0] : transaction;
    
    return NextResponse.json({ success: true, data: createdTransaction });
  } catch (error) {
    console.log(JSON.stringify(error));
    return NextResponse.json(
      { 
        success: false, 
        error: (error as Error).message
      },
      { status: 500 }
    );
  }
}