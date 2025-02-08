import { NextResponse } from 'next/server';
import { Company } from '@/lib/company';

const realCompanies: Company[] = [
  {
    symbol: "AMD",
    name: "Advanced Micro Devices, Inc.",
    exchange: "NASDAQ",
    industry: "Semiconductors",
    sector: "Technology",
    website: "https://www.amd.com",
    description: "Advanced Micro Devices, Inc. designs and produces microprocessors and graphics processors for computers and other devices.",
    stock_price: {
      current: "107.56",
      high_52_week: "164.46",
      low_52_week: "72.50"
    },
    market_cap: 130000000000,
    employees: 15300
  },
  {
    symbol: "CCL",
    name: "Carnival Corporation & plc",
    exchange: "NYSE",
    industry: "Travel Services",
    sector: "Consumer Discretionary",
    website: "https://www.carnivalcorp.com",
    description: "Carnival Corporation & plc operates as a leisure travel company and cruise operator worldwide.",
    stock_price: {
      current: "26.75",
      high_52_week: "31.52",
      low_52_week: "14.61"
    },
    market_cap: 19000000000,
    employees: 87000
  },
  {
    symbol: "NCLH",
    name: "Norwegian Cruise Line Holdings Ltd.",
    exchange: "NYSE",
    industry: "Travel Services",
    sector: "Consumer Discretionary",
    website: "https://www.nclhltd.com",
    description: "Norwegian Cruise Line Holdings Ltd. operates a fleet of passenger cruise ships.",
    stock_price: {
      current: "27.33",
      high_52_week: "29.29",
      low_52_week: "14.69"
    },
    market_cap: 11500000000,
    employees: 41000
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corporation",
    exchange: "NASDAQ",
    industry: "Semiconductors",
    sector: "Technology",
    website: "https://www.nvidia.com",
    description: "NVIDIA Corporation designs and manufactures graphics processing units (GPUs) and related software.",
    stock_price: {
      current: "129.84",
      high_52_week: "192.74",
      low_52_week: "108.13"
    },
    market_cap: 320000000000,
    employees: 22473
  },
  {
    symbol: "SNDL",
    name: "SNDL Inc.",
    exchange: "NASDAQ",
    industry: "Cannabis",
    sector: "Healthcare",
    website: "https://www.sndlgroup.com",
    description: "SNDL Inc. engages in the production, distribution, and sale of cannabis products.",
    stock_price: {
      current: "1.86",
      high_52_week: "3.96",
      low_52_week: "1.45"
    },
    market_cap: 400000000,
    employees: 1200
  },
  {
    symbol: "TSLA",
    name: "Tesla, Inc.",
    exchange: "NASDAQ",
    industry: "Automobiles",
    sector: "Consumer Discretionary",
    website: "https://www.tesla.com",
    description: "Tesla, Inc. designs, manufactures, and sells electric vehicles and energy storage products.",
    stock_price: {
      current: "361.62",
      high_52_week: "414.50",
      low_52_week: "206.86"
    },
    market_cap: 1140000000000,
    employees: 127855
  }
];

export async function GET() {
  const exchanges = ["NYSE", "NASDAQ", "AMEX", "TSX", "LSE"];
  
  const industries = [
    "Semiconductors",
    "Software",
    "Cloud Computing",
    "E-commerce",
    "Artificial Intelligence",
    "Biotechnology",
    "Pharmaceuticals",
    "Electric Vehicles",
    "Renewable Energy",
    "Financial Services",
    "Investment Banking",
    "Insurance",
    "Real Estate",
    "Telecommunications",
    "Media & Entertainment",
    "Gaming",
    "Healthcare Technology",
    "Cybersecurity",
    "Aerospace & Defense",
    "Consumer Electronics"
  ];

  const sectors = [
    "Technology",
    "Healthcare",
    "Financial Services",
    "Consumer Discretionary",
    "Consumer Staples",
    "Industrials",
    "Energy",
    "Materials",
    "Real Estate",
    "Communication Services"
  ];

  const companyTypes = [
    "Corporation",
    "Inc.",
    "Ltd.",
    "Group",
    "Holdings",
    "Technologies",
    "Systems",
    "Solutions",
    "Innovations",
    "Enterprises"
  ];

  const activities = [
    "develops cutting-edge solutions",
    "provides innovative services",
    "manufactures advanced products",
    "delivers comprehensive solutions",
    "creates next-generation technologies",
    "offers specialized services",
    "designs breakthrough products",
    "implements strategic solutions",
    "produces state-of-the-art systems",
    "develops proprietary technologies"
  ];

  // Generate realistic stock symbols (3-4 uppercase letters)
  const generateSymbol = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const length = Math.random() > 0.5 ? 3 : 4;
    let symbol = '';
    
    symbol += letters.charAt(Math.floor(Math.random() * letters.length));
    
    for (let i = 1; i < length; i++) {
      const useNumber = Math.random() < 0.2;
      symbol += useNumber 
        ? numbers.charAt(Math.floor(Math.random() * numbers.length))
        : letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    return symbol;
  };

  const getRandomItem = <T>(array: T[]): T => {
    return array[Math.floor(Math.random() * array.length)];
  };

  // Generate 50 sample companies
  const sampleCompanies = Array.from({ length: 50 }, () => {
    const symbol = generateSymbol();
    const industry = getRandomItem(industries);
    const sector = getRandomItem(sectors);
    const companyType = getRandomItem(companyTypes);
    const activity = getRandomItem(activities);

    return {
      symbol,
      name: `${symbol} ${companyType}`,
      exchange: getRandomItem(exchanges),
      industry,
      sector,
      website: `https://www.${symbol.toLowerCase()}.com`,
      description: `${symbol} ${companyType} ${activity} in the ${industry.toLowerCase()} industry, focusing on ${sector.toLowerCase()} solutions. With a commitment to innovation and customer satisfaction, they continue to expand their market presence and technological capabilities.`,
      stock_price: {
        current: (100 + Math.random() * 50).toFixed(2),
        high_52_week: (150 + Math.random() * 50).toFixed(2),
        low_52_week: (90 + Math.random() * 50).toFixed(2)
      },
      market_cap: Math.floor(Math.random() * 500) * 1000000000,
      employees: Math.floor(Math.random() * 9000) + 1000
    };
  });

  // Combine real and sample companies
  const allCompanies = [...realCompanies, ...sampleCompanies];

  return NextResponse.json(allCompanies);
}