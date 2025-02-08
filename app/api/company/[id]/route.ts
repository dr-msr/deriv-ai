import { NextRequest } from 'next/server';

// Define the type structure
type CompanyData = {
  [key: string]: {
    company: {
      symbol: string;
      name: string;
      exchange: string;
      industry: string;
      sector: string;
      website: string;
      description: string;
      headquarters: {
        address: string;
        city: string;
        state: string;
        country: string;
        zipcode: string;
      };
      founding_date: string;
      ceo: string;
      employees: number;
    };
    financials?: {
      market_cap: number;
      stock_price: {
        current: number;
        high_52_week: number;
        low_52_week: number;
        previous_close: number;
      };
      dividends?: {
        yield: number;
        payout_ratio: number;
        frequency: string;
        ex_dividend_date: string;
        next_payment_date: string;
      };
      earnings?: {
        eps: number;
        pe_ratio: number;
        quarterly_report_date: string;
        next_earnings_date: string;
      };
    };
    stock_performance: {
      beta: number;
      volatility: {
        average_daily_volume: number;
        relative_strength_index: number;
      };
      moving_averages?: {
        sma_50: number;
        sma_200: number;
      };
    };
    ownership?: {
      institutional_ownership: number;
      insider_ownership: number;
    };
    news?: {
      title: string;
      source: string;
      published_date: string;
      url: string;
    }[];
    analyst_ratings?: {
      recommendation: string;
      target_price: {
        low: number;
        average: number;
        high: number;
      };
    };
  };
};

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params; // Extract company ID (ticker symbol)
  
    // Mock database of companies (Replace this with a real DB or API call)
    const companyData: CompanyData = {
      AAPL: {
        company: {
          symbol: "AAPL",
          name: "Apple Inc.",
          exchange: "NASDAQ",
          industry: "Technology",
          sector: "Consumer Electronics",
          website: "https://www.apple.com",
          description: "Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, wearables, and accessories worldwide.",
          headquarters: {
            address: "One Apple Park Way",
            city: "Cupertino",
            state: "CA",
            country: "USA",
            zipcode: "95014"
          },
          founding_date: "1976-04-01",
          ceo: "Tim Cook",
          employees: 164000
        },
        financials: {
          market_cap: 2850000000000,
          stock_price: {
            current: 175.12,
            high_52_week: 198.23,
            low_52_week: 143.10,
            previous_close: 174.50
          },
          dividends: {
            yield: 0.56,
            payout_ratio: 0.15,
            frequency: "Quarterly",
            ex_dividend_date: "2024-02-08",
            next_payment_date: "2024-02-28"
          },
          earnings: {
            eps: 6.32,
            pe_ratio: 27.8,
            quarterly_report_date: "2024-01-25",
            next_earnings_date: "2024-04-25"
          }
        },
        stock_performance: {
          beta: 1.25,
          volatility: {
            average_daily_volume: 73000000,
            relative_strength_index: 55.4
          },
          moving_averages: {
            sma_50: 170.34,
            sma_200: 165.78
          }
        },
        ownership: {
          institutional_ownership: 58.6,
          insider_ownership: 0.78
        },
        news: [
          {
            title: "Apple Reports Record Q4 Revenue",
            source: "CNBC",
            published_date: "2024-01-26",
            url: "https://www.cnbc.com/news/apple-q4-earnings.html"
          }
        ],
        analyst_ratings: {
          recommendation: "Buy",
          target_price: {
            low: 160.00,
            average: 185.00,
            high: 210.00
          }
        }
      },
      TSLA: {
        company: {
          symbol: "TSLA",
          name: "Tesla Inc.",
          exchange: "NASDAQ",
          industry: "Automotive",
          sector: "Electric Vehicles",
          website: "https://www.tesla.com",
          description: "Tesla, Inc. engages in the design, development, manufacture, and sale of electric vehicles and energy storage systems.",
          headquarters: {
            address: "3500 Deer Creek Road",
            city: "Palo Alto",
            state: "CA",
            country: "USA",
            zipcode: "94304"
          },
          founding_date: "2003-07-01",
          ceo: "Elon Musk",
          employees: 110000
        },
        financials: {
          market_cap: 850000000000,
          stock_price: {
            current: 215.65,
            high_52_week: 310.20,
            low_52_week: 175.80,
            previous_close: 212.50
          }
        },
        stock_performance: {
          beta: 2.05,
          volatility: {
            average_daily_volume: 68000000,
            relative_strength_index: 60.2
          }
        }
      }
    };
  
    // Fetch the company data based on ID
    const data : any = companyData[id.toUpperCase()];
  
    if (!data) {
      return new Response(JSON.stringify({ error: "Company not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }
  
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  }