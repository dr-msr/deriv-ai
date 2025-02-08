'use client';

import { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Company } from '@/lib/company';
import { cn } from '@/lib/utils';

interface NewsItem {
  title: string;
  link: string;
  publisher: string;
  publishedAt: number;
}

interface TickerDataProps {
  company: Company;
}

export default function TickerData({ company }: TickerDataProps) {
  const [price, setPrice] = useState<number | null>(null);
  const [priceHistory, setPriceHistory] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBeeping, setIsBeeping] = useState(false);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    setPriceHistory([]);
    setPrice(null);
    setIsLoading(true);
    setNews([]);

    const fetchPrice = async () => {
      try {
        const response = await fetch(`/api/getPrice/${company.symbol}`);
        const result = await response.json();
        console.log(result)
        
        if (result.success && result.data) {
          setPrice(result.data);
          setPriceHistory(prev => {
            const newHistory = [...prev, result.data];
            return newHistory.slice(-60);
          });
          setIsBeeping(true);
          setTimeout(() => setIsBeeping(false), 300);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching price:', error);
        setIsLoading(false);
      }
    };

    fetchPrice();
    const interval = setInterval(fetchPrice, 5000);

    return () => clearInterval(interval);
  }, [company.symbol]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`/api/getNews/${company.symbol}`);
        const result = await response.json();
        
        if (result.success && result.data) {
          setNews(result.data);
        }
      } catch (error) {
        console.error('Error fetching news:', error);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 60000); 

    return () => clearInterval(interval);
  }, [company.symbol]);

  const getPriceChangeIndicator = () => {
    if (priceHistory.length < 2) return null;
    
    const currentPrice = priceHistory[priceHistory.length - 1];
    const previousPrice = priceHistory[priceHistory.length - 2];
    
    const isUp = currentPrice > previousPrice;
    const isDown = currentPrice < previousPrice;

    return (
      <Badge 
        variant={isUp ? "default" : isDown ? "destructive" : "secondary"}
        className={cn(
          "transition-all duration-300",
          isBeeping && (
            isUp ? "bg-green-500 text-white" : 
            isDown ? "bg-red-500 text-white" : 
            "bg-gray-500 text-white"
          )
        )}
      >
        {isUp ? "▲" : isDown ? "▼" : "−"}
      </Badge>
    );
  };

  const renderMiniChart = () => {
    if (priceHistory.length === 0) return null;

    const startPrice = priceHistory[0];
    const maxDeviation = Math.max(
      ...priceHistory.map(p => Math.abs(p - startPrice))
    );

    return (
      <div className="flex items-center h-12 gap-[1px] ml-2 relative">
        {/* Center line */}
        <div className="absolute w-full h-[1px] bg-foreground/10 top-1/2" />
        
        {priceHistory.map((p, i) => {
          const percentChange = ((p - startPrice) / startPrice) * 100;
          const normalizedHeight = Math.abs(percentChange) / (maxDeviation / startPrice * 100) * 100;
          const height = Math.max(4, normalizedHeight * 0.4);
          const isIncrease = p >= startPrice;
          
          return (
            <div
              key={i}
              className="w-2 bg-foreground/20 rounded-sm"
              style={{
                height: `${height}%`,
                marginTop: isIncrease ? 'auto' : undefined,
                marginBottom: isIncrease ? undefined : 'auto',
                transition: 'all 0.3s ease-out'
              }}
            />
          );
        })}
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center gap-2">
        <Badge className="text-xl px-4 py-1 h-auto font-semibold">$ {price && price.toFixed(2)}</Badge>
        <div className="flex items-center gap-2">
          {getPriceChangeIndicator()}
          {renderMiniChart()}
        </div>
      </div>
      <div>
        <div className="flex flex-row border px-2 rounded pt-1 overflow-hidden relative h-6">
          <div className="whitespace-nowrap animate-marquee inline-block absolute">
            {news.map((item, index) => (
              <a 
                key={`${item.publishedAt}-${index}`}
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mx-4 hover:text-blue-500 text-xs truncate max-w-[300px]"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}