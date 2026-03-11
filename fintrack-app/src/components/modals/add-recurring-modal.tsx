import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Repeat,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  useRecurringStore,
  type RecurringRule,
  type Frequency,
} from "@/store/useRecurringStore";
import { type Category } from "@/types";
import { type Wallet } from "@/types";
import { type Transaction } from "@/types";
import { useToast } from "@/context/toast-context";
import CategoryIcon from "@/components/shared/category-icon";
import { cn, formatCurrency } from "@/lib/utils";

interface AddRecurringModalProps {
  open: boolean;
  onClose: () => void;
  rule?: RecurringRule | null;
  categories: Category[];
  wallets: Wallet[];
}

export default function AddRecurringModal({
  open,
  onClose,
  rule,
  categories,
  wallets,
}: AddRecurringModalProps) {
  const { addRule, updateRule } = useRecurringStore();
  const { addToast } = useToast();
  const isEditing = !!rule;

  // Form states
  const [frequency, setFrequency] = useState<Frequency>("monthly");
  const [interval, setInterval] = useState(1);
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [nextDue, setNextDue] = useState(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
      .toISOString()
      .slice(0, 10)
  );
  const [active, setActive] = useState(true);

  // Template states
  const [transactionType, setTransactionType] = useState<"income" | "expense">(
    "expense"
  );
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [walletId, setWalletId] = useState("");

  // Load rule data for editing
  useEffect(() => {
    if (rule) {
      setFrequency(rule.frequency);
      setInterval(rule.interval);
      setStartDate(rule.startDate);
      setNextDue(rule.nextDue);
      setActive(rule.active);
      setTransactionType(rule.template.type as "income" | "expense");
      setAmount(String(rule.template.amount));
      setCategoryId(rule.template.categoryId);
      setWalletId(rule.template.walletId);
    } else {
      // Reset to defaults
      setFrequency("monthly");
      setInterval(1);
      setStartDate(new Date().toISOString().slice(0, 10));
      setNextDue(
        new Date(new Date().setMonth(new Date().getMonth() + 1))
          .toISOString()
          .slice(0, 10)
      );
      setActive(true);
      setTransactionType("expense");
      setAmount("");
      setCategoryId("");
      setWalletId(wallets[0]?.id || "");
    }
  }, [rule, wallets]);

  const filteredCategories = categories.filter(
    (c) => c.type === transactionType
  );

  const selectedCategory = filteredCategories.find((c) => c.id === categoryId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !categoryId || !walletId) {
      addToast("Please fill in all required fields", "error");
      return;
    }

    const category = categories.find((c) => c.id === categoryId);
    const wallet = wallets.find((w) => w.id === walletId);

    if (!category || !wallet) {
      addToast("Invalid category or wallet selected", "error");
      return;
    }

    const template: Omit<Transaction, "id" | "date" | "createdAt"> = {
      type: transactionType,
      amount: parseFloat(amount),
      categoryId,
      categoryName: category.name,
      categoryIcon: category.icon,
      categoryColor: category.color,
      walletId,
      walletName: wallet.name,
      note: `Recurring ${transactionType}`,
    };

    try {
      if (isEditing && rule) {
        await updateRule(rule.id, {
          frequency,
          interval,
          startDate,
          nextDue,
          active,
          template,
        });
        addToast("Recurring rule updated successfully", "success");
      } else {
        await addRule({
          frequency,
          interval,
          startDate,
          nextDue,
          active,
          template,
        });
        addToast("Recurring rule created successfully", "success");
      }
      onClose();
    } catch (error: any) {
      addToast(error.message || "Failed to save recurring rule", "error");
    }
  };

  const getIntervalLabel = () => {
    if (interval === 1) {
      return frequency.charAt(0).toUpperCase() + frequency.slice(1);
    }
    return `Every ${interval} ${frequency}${interval > 1 ? "s" : ""}`;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Repeat className="w-5 h-5" />
            {isEditing ? "Edit Recurring Rule" : "Create Recurring Rule"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your recurring transaction rule"
              : "Set up an automated transaction that repeats on a schedule"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Transaction Type */}
            <div className="space-y-2">
              <Label>Type</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={transactionType === "income" ? "default" : "outline"}
                  className={cn(
                    "flex-1 gap-2",
                    transactionType === "income" &&
                      "bg-emerald-500 hover:bg-emerald-600"
                  )}
                  onClick={() => {
                    setTransactionType("income");
                    setCategoryId("");
                  }}
                >
                  <TrendingUp className="w-4 h-4" />
                  Income
                </Button>
                <Button
                  type="button"
                  variant={
                    transactionType === "expense" ? "default" : "outline"
                  }
                  className={cn(
                    "flex-1 gap-2",
                    transactionType === "expense" &&
                      "bg-rose-500 hover:bg-rose-600"
                  )}
                  onClick={() => {
                    setTransactionType("expense");
                    setCategoryId("");
                  }}
                >
                  <TrendingDown className="w-4 h-4" />
                  Expense
                </Button>
              </div>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className="pl-9"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="cursor-pointer"
              >
                <option value="">Select category</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Wallet */}
            <div className="space-y-2">
              <Label>Wallet/Account</Label>
              <Select
                value={walletId}
                onChange={(e) => setWalletId(e.target.value)}
                className="cursor-pointer"
              >
                <option value="">Select wallet</option>
                {wallets.map((wallet) => (
                  <option key={wallet.id} value={wallet.id}>
                    {wallet.name} ({formatCurrency(wallet.balance)})
                  </option>
                ))}
              </Select>
            </div>

            {/* Frequency */}
            <div className="space-y-2">
              <Label>Frequency</Label>
              <div className="grid grid-cols-2 gap-2">
                <Select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as Frequency)}
                  className="cursor-pointer"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </Select>
                <div className="relative">
                  <Repeat className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    max="365"
                    value={interval}
                    onChange={(e) => setInterval(parseInt(e.target.value) || 1)}
                    className="pl-9"
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                {getIntervalLabel()}
              </p>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="startDate"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextDue">Next Due Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="nextDue"
                    type="date"
                    value={nextDue}
                    onChange={(e) => setNextDue(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Active Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-3">
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center",
                    active
                      ? "bg-emerald-500/10 text-emerald-500"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {active ? (
                    <Repeat className="w-4 h-4" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium">
                    {active ? "Active" : "Paused"}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {active
                      ? "Transactions will be created automatically"
                      : "No transactions will be created"}
                  </p>
                </div>
              </div>
              <Switch checked={active} onCheckedChange={setActive} />
            </div>

            {/* Preview Card */}
            {selectedCategory && amount && (
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-semibold">
                    Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      {getIntervalLabel()}
                    </span>
                    <span
                      className={cn(
                        "font-semibold",
                        transactionType === "income"
                          ? "text-emerald-600"
                          : "text-rose-600"
                      )}
                    >
                      {transactionType === "income" ? "+" : "-"}
                      {formatCurrency(parseFloat(amount))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{selectedCategory.name}</span>
                    <span>{wallets.find((w) => w.id === walletId)?.name}</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {isEditing ? "Update Rule" : "Create Rule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
