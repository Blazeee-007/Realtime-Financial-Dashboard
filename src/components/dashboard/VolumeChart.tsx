import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

interface VolumeChartProps {
  data: Array<{
    time: string;
    volume: number;
    price: number;
    prevPrice?: number;
  }>;
  symbol: string;
}

export function VolumeChart({ data, symbol }: VolumeChartProps) {
  const formatVolume = (value: number) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const formatTime = (value: string) => {
    const date = new Date(value);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Color bars based on price movement
  const getBarColor = (item: any) => {
    if (!item.prevPrice) return "hsl(var(--chart-1))";
    return item.price >= item.prevPrice ? "hsl(var(--bullish))" : "hsl(var(--bearish))";
  };

  return (
    <Card className="p-6 bg-financial-chart border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">{symbol} Volume</h3>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="time" 
              tickFormatter={formatTime}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={formatVolume}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
            />
            <Tooltip 
              formatter={(value: number) => [formatVolume(value), "Volume"]}
              labelFormatter={formatTime}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--foreground))"
              }}
            />
            <Bar 
              dataKey="volume" 
              fill="hsl(var(--chart-1))"
              opacity={0.8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}