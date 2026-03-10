import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRightLeft, Zap, ArrowUpRight } from "lucide-react";
import { useWalletStore } from "@/store/useWalletStore";
import { toast } from "sonner";
import { formatCurrency } from "@/lib/utils";

export function QuickTransferWidget() {
  const { wallets, updateWallet } = useWalletStore();
  const [fromWallet, setFromWallet] = useState("");
  const [toWallet, setToWallet] = useState("");
  const [amount, setAmount] = useState("");

  const availableWallets = wallets.filter((w) => w.id !== fromWallet);

  const handleTransfer = () => {
    if (!fromWallet || !toWallet || !amount || parseFloat(amount) <= 0) {
      toast.error("Please fill in all fields correctly");
      return;
    }

    const fromW = wallets.find((w) => w.id === fromWallet);
    if (!fromW || fromW.balance < parseFloat(amount)) {
      toast.error("Insufficient balance in selected wallet");
      return;
    }

    // Update wallets
    updateWallet(fromWallet, { balance: fromW.balance - parseFloat(amount) });
    const toW = wallets.find((w) => w.id === toWallet);
    if (toW) {
      updateWallet(toWallet, { balance: toW.balance + parseFloat(amount) });
    }

    toast.success(
      `Transferred ${formatCurrency(parseFloat(amount))} to ${toW?.name}`
    );
    setAmount("");
    setFromWallet("");
    setToWallet("");
  };

  const quickAmounts = [100, 500, 1000, 5000];

  return (
    <Card className="border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold">
              Quick Transfer
            </CardTitle>
            <CardDescription className="mt-0.5 text-xs">
              Transfer between wallets instantly
            </CardDescription>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <ArrowRightLeft className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* From Wallet */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">
            From
          </label>
          <select
            value={fromWallet}
            onChange={(e) => setFromWallet(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-ring cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select wallet</option>
            {wallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name} ({formatCurrency(wallet.balance)})
              </option>
            ))}
          </select>
        </div>

        {/* To Wallet */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">
            To
          </label>
          <select
            value={toWallet}
            onChange={(e) => setToWallet(e.target.value)}
            className="flex h-9 w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground shadow-sm outline-none focus:border-primary focus:ring-1 focus:ring-ring cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="">Select wallet</option>
            {availableWallets.map((wallet) => (
              <option key={wallet.id} value={wallet.id}>
                {wallet.name}
              </option>
            ))}
          </select>
        </div>

        {/* Amount */}
        <div className="space-y-1.5">
          <label className="text-xs text-muted-foreground font-medium">
            Amount
          </label>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-9 text-sm"
          />
          {/* Quick Amounts */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {quickAmounts.map((amt) => (
              <Button
                key={amt}
                type="button"
                variant="outline"
                size="sm"
                className="h-6 text-[10px] px-2 min-w-[48px]"
                onClick={() => setAmount(amt.toString())}
              >
                {amt >= 1000 ? `${(amt / 1000).toFixed(0)}k` : amt}
              </Button>
            ))}
          </div>
        </div>

        {/* Transfer Button */}
        <Button
          className="w-full h-9 gap-2 font-semibold"
          onClick={handleTransfer}
          disabled={!fromWallet || !toWallet || !amount}
        >
          <Zap className="h-4 w-4" />
          Transfer Now
        </Button>

        {/* Recent transfers hint */}
        <div className="pt-2 border-t border-border/60">
          <p className="text-[10px] text-muted-foreground text-center">
            <ArrowUpRight className="h-3 w-3 inline mr-1" />
            Instant transfer between your wallets
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
