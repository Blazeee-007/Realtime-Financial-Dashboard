import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  marketCap?: string;
}

interface TimeSeriesData {
  time: string;
  price: number;
  volume: number;
  high: number;
  low: number;
  open: number;
  close: number;
  sma20?: number;
  sma50?: number;
  prevPrice?: number;
}

interface TrendInsight {
  type: "bullish" | "bearish" | "neutral" | "warning";
  message: string;
  confidence: "high" | "medium" | "low";
}

const DEMO_MODE = true; // Set to false when you have Alpha Vantage API key

export function useStockData() {
  const [currentStock, setCurrentStock] = useState<StockData | null>(null);
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([]);
  const [insights, setInsights] = useState<TrendInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const { toast } = useToast();

  // Generate demo data for development
  const generateDemoData = useCallback((symbol: string): { stock: StockData; timeSeries: TimeSeriesData[] } => {
    const basePrice = 500 + Math.random() * 2000; // Indian stock price range
    const change = (Math.random() - 0.5) * 50;
    const changePercent = (change / basePrice) * 100;

    const stock: StockData = {
      symbol,
      price: basePrice,
      change,
      changePercent,
      volume: Math.floor(Math.random() * 10000000) + 1000000,
      high: basePrice + Math.random() * 25,
      low: basePrice - Math.random() * 25,
      open: basePrice + (Math.random() - 0.5) * 15,
      previousClose: basePrice - change,
      marketCap: `₹${Math.floor(Math.random() * 500000 + 50000)} Cr`
    };

    // Generate 30 days of time series data
    const timeSeries: TimeSeriesData[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dailyPrice = basePrice + (Math.random() - 0.5) * 20;
      const volume = Math.floor(Math.random() * 30000000) + 5000000;
      
      timeSeries.push({
        time: date.toISOString().split('T')[0],
        price: dailyPrice,
        volume,
        high: dailyPrice + Math.random() * 3,
        low: dailyPrice - Math.random() * 3,
        open: dailyPrice + (Math.random() - 0.5) * 2,
        close: dailyPrice,
        prevPrice: i < 29 ? timeSeries[timeSeries.length - 1]?.price : undefined
      });
    }

    // Calculate moving averages
    timeSeries.forEach((item, index) => {
      if (index >= 19) {
        const sma20 = timeSeries.slice(index - 19, index + 1)
          .reduce((sum, d) => sum + d.price, 0) / 20;
        item.sma20 = sma20;
      }
      if (index >= 49) {
        const sma50 = timeSeries.slice(index - 49, index + 1)
          .reduce((sum, d) => sum + d.price, 0) / 50;
        item.sma50 = sma50;
      }
    });

    return { stock, timeSeries };
  }, []);

  // Generate insights based on data
  const generateInsights = useCallback((stock: StockData, timeSeries: TimeSeriesData[]): TrendInsight[] => {
    const insights: TrendInsight[] = [];
    const latest = timeSeries[timeSeries.length - 1];
    
    if (!latest) return insights;

    // Price trend analysis
    if (stock.changePercent > 5) {
      insights.push({
        type: "bullish",
        message: `${stock.symbol} is up ${stock.changePercent.toFixed(2)}% today, showing strong bullish momentum.`,
        confidence: "high"
      });
    } else if (stock.changePercent < -5) {
      insights.push({
        type: "bearish",
        message: `${stock.symbol} is down ${Math.abs(stock.changePercent).toFixed(2)}% today, indicating bearish pressure.`,
        confidence: "high"
      });
    }

    // Moving average analysis
    if (latest.sma20 && latest.sma50) {
      if (latest.sma20 > latest.sma50 && stock.price > latest.sma20) {
        insights.push({
          type: "bullish",
          message: "The 20-day SMA has crossed above the 50-day SMA, and price is above both averages - potential bullish trend.",
          confidence: "medium"
        });
      } else if (latest.sma20 < latest.sma50 && stock.price < latest.sma20) {
        insights.push({
          type: "bearish",
          message: "Price is below both moving averages with 20-day SMA below 50-day SMA - potential bearish trend.",
          confidence: "medium"
        });
      }
    }

    // Volume analysis
    const avgVolume = timeSeries.slice(-5).reduce((sum, d) => sum + d.volume, 0) / 5;
    if (stock.volume > avgVolume * 1.5) {
      insights.push({
        type: "warning",
        message: "Trading volume is significantly higher than average, indicating increased market interest.",
        confidence: "high"
      });
    }

    // Volatility warning
    const priceRange = (stock.high - stock.low) / stock.price;
    if (priceRange > 0.05) {
      insights.push({
        type: "warning",
        message: `High intraday volatility detected (${(priceRange * 100).toFixed(1)}% range) - trade with caution.`,
        confidence: "medium"
      });
    }

    return insights;
  }, []);

  const fetchStockData = useCallback(async (symbol: string) => {
    setLoading(true);
    
    try {
      if (DEMO_MODE || !apiKey) {
        // Demo mode - generate realistic demo data
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
        const { stock, timeSeries } = generateDemoData(symbol);
        setCurrentStock(stock);
        setTimeSeriesData(timeSeries);
        setInsights(generateInsights(stock, timeSeries));
        
        toast({
          title: "Demo Data Loaded",
          description: `Showing demo data for ${symbol}. Add Alpha Vantage API key for real data.`,
        });
      } else {
        // Real API call (when API key is provided)
        const response = await fetch(
          `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        
        const data = await response.json();
        // Process real API data here...
        
        toast({
          title: "Real Data Loaded",
          description: `Successfully loaded data for ${symbol}`,
        });
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch stock data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [apiKey, generateDemoData, generateInsights, toast]);

  // Auto-refresh data every 10 seconds
  useEffect(() => {
    if (!currentStock) return;

    const interval = setInterval(() => {
      if (DEMO_MODE) {
        // In demo mode, just update the price slightly
        setCurrentStock(prev => {
          if (!prev) return null;
          const newChange = (Math.random() - 0.5) * 2;
          const newPrice = prev.price + newChange;
          const newChangePercent = ((newPrice - prev.previousClose) / prev.previousClose) * 100;
          
          return {
            ...prev,
            price: newPrice,
            change: newPrice - prev.previousClose,
            changePercent: newChangePercent,
          };
        });
      } else {
        // In real mode, refetch data
        fetchStockData(currentStock.symbol);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [currentStock, fetchStockData]);

  return {
    currentStock,
    timeSeriesData,
    insights,
    loading,
    fetchStockData,
    apiKey,
    setApiKey,
    isDemo: DEMO_MODE || !apiKey
  };
}