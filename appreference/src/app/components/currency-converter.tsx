import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { ArrowRightLeft, RefreshCw, TrendingUp } from "lucide-react";
import { currencies } from "./mock-data";
import { toast } from "sonner";

export function CurrencyConverter() {
  const [amount, setAmount] = useState("1000");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fromCurrencyData = currencies.find((c) => c.code === fromCurrency);
  const toCurrencyData = currencies.find((c) => c.code === toCurrency);

  const fromRate = fromCurrencyData?.rate || 1;
  const toRate = toCurrencyData?.rate || 1;
  const convertedAmount = (parseFloat(amount || "0") / fromRate) * toRate;
  const exchangeRate = toRate / fromRate;

  const swap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      toast.success("Exchange rates updated!");
    }, 800);
  };

  return (
    <Card className="border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm flex items-center gap-1.5" style={{ fontWeight: 600 }}>
              <TrendingUp className="h-3.5 w-3.5 text-muted-foreground" />
              Currency Converter
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs">Live exchange rates</CardDescription>
          </div>
          <button
            onClick={handleRefresh}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all"
            title="Refresh rates"
          >
            <RefreshCw className={`h-3.5 w-3.5 transition-all duration-500 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* From */}
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-muted/30 p-2.5 focus-within:border-primary/30 focus-within:bg-muted/50 transition-all">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground shrink-0">{fromCurrencyData?.symbol}</span>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="h-7 w-16 appearance-none rounded-lg bg-card border border-border/50 px-2 text-xs outline-none cursor-pointer hover:border-primary/30 transition-colors"
                style={{ fontWeight: 700 }}
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 bg-transparent text-right text-sm outline-none min-w-0"
              style={{ fontWeight: 700 }}
              placeholder="0.00"
            />
          </div>

          {/* Swap button */}
          <div className="flex items-center justify-center">
            <button
              onClick={swap}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-card hover:bg-primary hover:border-primary hover:text-primary-foreground transition-all duration-200 shadow-sm group"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary-foreground rotate-90 transition-colors" />
            </button>
          </div>

          {/* To */}
          <div className="flex items-center gap-2 rounded-xl border border-border/60 bg-primary/[0.03] p-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground shrink-0">{toCurrencyData?.symbol}</span>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="h-7 w-16 appearance-none rounded-lg bg-card border border-border/50 px-2 text-xs outline-none cursor-pointer hover:border-primary/30 transition-colors"
                style={{ fontWeight: 700 }}
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>{c.code}</option>
                ))}
              </select>
            </div>
            <p className="flex-1 text-right text-sm text-primary" style={{ fontWeight: 700 }}>
              {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Rate display */}
          <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border/60" />
            <span>
              1 {fromCurrency} = <span style={{ fontWeight: 600 }} className="text-foreground">{exchangeRate.toFixed(4)}</span> {toCurrency}
            </span>
            <span className="h-px flex-1 bg-border/60" />
          </div>

          {/* Quick amounts */}
          <div className="flex items-center gap-1.5">
            {[100, 500, 1000, 5000].map((val) => (
              <button
                key={val}
                onClick={() => setAmount(String(val))}
                className={`flex-1 rounded-lg py-1 text-[10px] border transition-all duration-150 ${
                  amount === String(val)
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
                style={{ fontWeight: amount === String(val) ? 700 : 400 }}
              >
                {val >= 1000 ? `${val / 1000}k` : val}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
