import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface StockSearchProps {
  onSearch: (symbol: string) => void;
  isLoading?: boolean;
}

export function StockSearch({ onSearch, isLoading }: StockSearchProps) {
  const [symbol, setSymbol] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (symbol.trim()) {
      onSearch(symbol.trim().toUpperCase());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-md">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter stock symbol (e.g., RELIANCE, TCS, INFY)"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="pl-10 bg-financial-grid border-border"
          disabled={isLoading}
        />
      </div>
      <Button 
        type="submit" 
        disabled={!symbol.trim() || isLoading}
        className="bg-primary hover:bg-primary/90"
      >
        {isLoading ? "Loading..." : "Search"}
      </Button>
    </form>
  );
}