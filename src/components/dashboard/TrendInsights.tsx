import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Activity } from "lucide-react";

interface TrendInsightsProps {
  insights: Array<{
    type: "bullish" | "bearish" | "neutral" | "warning";
    message: string;
    confidence: "high" | "medium" | "low";
  }>;
  symbol: string;
}

export function TrendInsights({ insights, symbol }: TrendInsightsProps) {
  const getInsightIcon = (type: string) => {
    switch (type) {
      case "bullish":
        return <TrendingUp className="h-4 w-4 text-bullish" />;
      case "bearish":
        return <TrendingDown className="h-4 w-4 text-bearish" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Activity className="h-4 w-4 text-neutral" />;
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    const colors = {
      high: "bg-bullish/20 text-bullish border-bullish/30",
      medium: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
      low: "bg-neutral/20 text-neutral border-neutral/30"
    };
    return colors[confidence as keyof typeof colors];
  };

  if (insights.length === 0) {
    return (
      <Card className="p-6 bg-financial-metric border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4">Market Insights</h3>
        <p className="text-muted-foreground text-center py-8">
          Search for a stock to see trend analysis and insights.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-financial-metric border-border">
      <h3 className="text-lg font-semibold text-foreground mb-4">{symbol} Market Insights</h3>
      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-financial-grid">
            {getInsightIcon(insight.type)}
            <div className="flex-1">
              <p className="text-sm text-foreground">{insight.message}</p>
              <Badge 
                variant="outline" 
                className={`mt-2 ${getConfidenceBadge(insight.confidence)}`}
              >
                {insight.confidence} confidence
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}