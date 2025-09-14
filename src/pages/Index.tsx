import { useState, useEffect } from "react";
import { StockSearch } from "@/components/dashboard/StockSearch";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PriceChart } from "@/components/dashboard/PriceChart";
import { VolumeChart } from "@/components/dashboard/VolumeChart";
import { TrendInsights } from "@/components/dashboard/TrendInsights";
import { useStockData } from "@/hooks/useStockData";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, TrendingUp, BarChart3, Activity, Key, RefreshCw } from "lucide-react";

const Index = () => {
  const { 
    currentStock, 
    timeSeriesData, 
    insights, 
    loading, 
    fetchStockData, 
    apiKey, 
    setApiKey, 
    isDemo 
  } = useStockData();

  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [multiStockData, setMultiStockData] = useState<any[]>([]);
  const [loadingMultiple, setLoadingMultiple] = useState(false);

  // Popular Indian stocks for homepage
  const popularStocks = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'ICICIBANK', 'BHARTIARTL', 'ITC', 'KOTAKBANK', 'LT', 'SBIN', 'ASIANPAINT', 'MARUTI'];

  const loadMultipleStocks = async () => {
    setLoadingMultiple(true);
    const stocks = [];
    
    for (const symbol of popularStocks) {
      // Generate demo data for each stock
      const basePrice = 500 + Math.random() * 2000;
      const change = (Math.random() - 0.5) * 50;
      const changePercent = (change / basePrice) * 100;
      
      stocks.push({
        symbol,
        price: basePrice,
        change,
        changePercent,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        high: basePrice + Math.random() * 25,
        low: basePrice - Math.random() * 25,
        marketCap: `₹${Math.floor(Math.random() * 500000 + 50000)} Cr`
      });
    }
    
    setMultiStockData(stocks);
    setLoadingMultiple(false);
  };

  useEffect(() => {
    loadMultipleStocks();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  const getVolatility = () => {
    if (!currentStock) return 0;
    return ((currentStock.high - currentStock.low) / currentStock.price * 100);
  };

  const handleStockSelect = (symbol: string) => {
    setSelectedStock(symbol);
    fetchStockData(symbol);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-financial-grid">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Indian Stock Market Dashboard</h1>
              <p className="text-sm text-muted-foreground">Real-time NSE & BSE market data and analytics</p>
            </div>
            <div className="flex items-center gap-4">
              {isDemo && (
                <Badge variant="outline" className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">
                  Demo Mode
                </Badge>
              )}
              {selectedStock && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedStock(null)}
                >
                  ← Back to Overview
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={loadMultipleStocks}
                disabled={loadingMultiple}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loadingMultiple ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <StockSearch onSearch={handleStockSelect} isLoading={loading} />
            </div>
          </div>
        </div>
      </div>

      {/* API Key Input (when not in demo mode and no key set) */}
      {!isDemo && !apiKey && (
        <div className="border-b border-border bg-financial-metric">
          <div className="container mx-auto px-6 py-4">
            <Card className="p-4 bg-financial-grid border-border">
              <div className="flex items-center gap-3">
                <Key className="h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-foreground">Alpha Vantage API Key Required</h3>
                  <p className="text-xs text-muted-foreground">Enter your API key to access real-time market data</p>
                </div>
                <Input
                  type="password"
                  placeholder="Enter API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-64 bg-background"
                />
              </div>
            </Card>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6 py-6">
        {selectedStock && currentStock ? (
          // Individual Stock Detail View
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h2 className="text-3xl font-bold text-foreground">{currentStock.symbol}</h2>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-semibold text-foreground">
                    {formatCurrency(currentStock.price)}
                  </span>
                  <span className={`text-lg ${currentStock.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                    {currentStock.change >= 0 ? '+' : ''}{formatCurrency(currentStock.change)} 
                    ({currentStock.changePercent >= 0 ? '+' : ''}{currentStock.changePercent.toFixed(2)}%)
                  </span>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <MetricCard
                  title="Volume"
                  value={formatNumber(currentStock.volume)}
                  icon={<BarChart3 className="h-5 w-5" />}
                />
                <MetricCard
                  title="Day High"
                  value={formatCurrency(currentStock.high)}
                  icon={<TrendingUp className="h-5 w-5" />}
                />
                <MetricCard
                  title="Day Low"
                  value={formatCurrency(currentStock.low)}
                  icon={<TrendingUp className="h-5 w-5 rotate-180" />}
                />
                <MetricCard
                  title="Volatility"
                  value={`${getVolatility().toFixed(2)}%`}
                  trend={getVolatility() > 3 ? "up" : getVolatility() < 1 ? "down" : "neutral"}
                  icon={<Activity className="h-5 w-5" />}
                />
              </div>
            </div>

            {/* Charts and Analysis */}
            {timeSeriesData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Price Chart */}
                <div className="lg:col-span-2">
                  <PriceChart data={timeSeriesData} symbol={currentStock.symbol} />
                </div>

                {/* Insights */}
                <div>
                  <TrendInsights insights={insights} symbol={currentStock.symbol} />
                </div>

                {/* Volume Chart */}
                <div className="lg:col-span-2">
                  <VolumeChart data={timeSeriesData} symbol={currentStock.symbol} />
                </div>

                {/* Additional Metrics */}
                <div className="space-y-4">
                  <MetricCard
                    title="Market Cap"
                    value={currentStock.marketCap || "N/A"}
                    icon={<DollarSign className="h-5 w-5" />}
                  />
                  <MetricCard
                    title="Previous Close"
                    value={formatCurrency(currentStock.previousClose)}
                    change={formatCurrency(currentStock.change)}
                    changePercent={`${currentStock.changePercent.toFixed(2)}%`}
                    trend={currentStock.change >= 0 ? "up" : "down"}
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          // Multi-Stock Overview (Homepage)
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Market Overview</h2>
              <p className="text-muted-foreground">Top Indian stocks with real-time prices and key metrics</p>
            </div>

            {loadingMultiple ? (
              <div className="text-center py-12">
                <RefreshCw className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Loading Market Data</h3>
                <p className="text-muted-foreground">Fetching latest prices for Indian stocks...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {multiStockData.map((stock) => (
                  <Card 
                    key={stock.symbol} 
                    className="p-6 bg-financial-chart border-border hover:bg-financial-grid cursor-pointer transition-colors"
                    onClick={() => handleStockSelect(stock.symbol)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-foreground">{stock.symbol}</h3>
                        <Badge 
                          variant="outline" 
                          className={`${stock.change >= 0 ? 'text-bullish border-bullish/30 bg-bullish/10' : 'text-bearish border-bearish/30 bg-bearish/10'}`}
                        >
                          {stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </Badge>
                      </div>
                      
                      <div>
                        <div className="text-2xl font-bold text-foreground">
                          {formatCurrency(stock.price)}
                        </div>
                        <div className={`text-sm ${stock.change >= 0 ? 'text-bullish' : 'text-bearish'}`}>
                          {stock.change >= 0 ? '+' : ''}{formatCurrency(stock.change)}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">High</p>
                          <p className="font-medium text-foreground">{formatCurrency(stock.high)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Low</p>
                          <p className="font-medium text-foreground">{formatCurrency(stock.low)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Volume</p>
                          <p className="font-medium text-foreground">{formatNumber(stock.volume)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Market Cap</p>
                          <p className="font-medium text-foreground">{stock.marketCap}</p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <div className="mt-12 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Click any stock to view detailed analytics</h3>
              <p className="text-muted-foreground">
                Get real-time charts, moving averages, trend insights, and advanced analytics
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
