import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface PriceChartProps {
  data: Array<{
    time: string;
    price: number;
    sma20?: number;
    sma50?: number;
  }>;
  symbol: string;
}

export function PriceChart({ data, symbol }: PriceChartProps) {
  const [showSMA20, setShowSMA20] = useState(true);
  const [showSMA50, setShowSMA50] = useState(true);

  const formatPrice = (value: number) => `₹${value.toFixed(2)}`;
  const formatTime = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="p-6 bg-financial-chart border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{symbol} Price Chart</h3>
        <div className="flex gap-2">
          <Button
            variant={showSMA20 ? "default" : "outline"}
            size="sm"
            onClick={() => setShowSMA20(!showSMA20)}
            className="text-xs"
          >
            SMA 20
          </Button>
          <Button
            variant={showSMA50 ? "default" : "outline"}
            size="sm"
            onClick={() => setShowSMA50(!showSMA50)}
            className="text-xs"
          >
            SMA 50
          </Button>
        </div>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatPrice}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: number, name: string) => [formatPrice(value), name]}
              labelFormatter={formatTime}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="hsl(var(--chart-1))" 
              strokeWidth={2}
              dot={false}
              name="Price"
            />
            {showSMA20 && (
              <Line 
                type="monotone" 
                dataKey="sma20" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="SMA 20"
              />
            )}
            {showSMA50 && (
              <Line 
                type="monotone" 
                dataKey="sma50" 
                stroke="hsl(var(--chart-3))" 
                strokeWidth={1}
                strokeDasharray="5 5"
                dot={false}
                name="SMA 50"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}