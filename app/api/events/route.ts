import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';
import { StockData } from '@/components/chart/chart';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export type Event = {
    headline: string;
    description: string;
    probability: number;
    impact: number;
    url: string;
    date: string;
}

export async function POST(req: Request) {
    try {
        const { startDate, endDate, symbol, stockData } = await req.json();

        // Format the data for analysis
        const dataPoints = stockData.map((data: StockData) => ({
            date: data.Date,
            price: data.Close,
            volume: data.Volume,
        }));

        // Create a prompt for OpenAI
        const prompt = `Analyze the following stock data for ${symbol} between ${startDate} and ${endDate}:
${JSON.stringify(dataPoints, null, 2)}

Based on this data and your knowledge, identify up to 5 significant events that might have affected the stock price.
For each event, provide:
1. A headline
2. A brief description
3. The probability of a similar event occurring again (as a percentage)
4. The impact factor (1-10, where 10 is highest impact)
5. A news URL (if applicable). Do not make up your own URL!

Format your response as a JSON array of events with these properties:
[{
    "headline": "string",
    "description": "string",
    "probability": number,
    "impact": number,
    "url": "string",
    "date": "string"
}]`;

        // Get response from OpenAI
        const completion = await openai.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are a financial analyst expert who analyzes stock market events and their impacts."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "gpt-4o-mini",
            temperature: 0.1,
            response_format: { type: "json_object" },
        });

        const response = completion.choices[0].message.content;
        const events = JSON.parse(response || '{"events": []}').events;

        // Sort events by impact (descending) and then by probability (descending)
        const sortedEvents = events.sort((a: { impact: number; probability: number; }, b: { impact: number; probability: number; }) => {
            // First sort by impact
            if (b.impact !== a.impact) {
                return b.impact - a.impact;
            }
            // If impact is equal, sort by probability
            return b.probability - a.probability;
        });

        return NextResponse.json({ events: sortedEvents });
    } catch (error) {
        console.error('Error processing events:', error);
        return NextResponse.json(
            { error: 'Failed to process events' },
            { status: 500 }
        );
    }
}
