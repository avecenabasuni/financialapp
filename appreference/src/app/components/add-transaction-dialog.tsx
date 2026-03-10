import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import {
  ArrowDownLeft,
  ArrowUpRight,
  DollarSign,
  Calendar,
  Tag,
  CreditCard,
  FileText,
  Repeat,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";

const categories = [
  "Salary", "Freelance", "Investment", "Groceries", "Entertainment",
  "Transport", "Utilities", "Food & Drink", "Shopping", "Health", "Housing", "Other",
];

const accountsList = ["Checking", "Savings", "Credit Card", "Investment"];

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransactionDialog({ open, onOpenChange }: AddTransactionDialogProps) {
  const [type, setType] = useState<"expense" | "income">("expense");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("Checking");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [isRecurring, setIsRecurring] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!description || !amount || !category) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (parseFloat(amount) <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      toast.success(
        `${type === "income" ? "Income" : "Expense"} of $${parseFloat(amount).toFixed(2)} added!`,
        {
          description: `${description} · ${category}`,
          icon: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
        }
      );
      setIsSubmitting(false);
      resetForm();
      onOpenChange(false);
    }, 400);
  };

  const resetForm = () => {
    setDescription("");
    setAmount("");
    setCategory("");
    setAccount("Checking");
    setDate(new Date().toISOString().split("T")[0]);
    setIsRecurring(false);
    setType("expense");
  };

  const quickAmounts = [10, 25, 50, 100, 200, 500];

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetForm(); onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden border-border/60">
        {/* Gradient header */}
        <div className={`absolute top-0 left-0 right-0 h-1 transition-colors duration-300 ${
          type === "income"
            ? "bg-gradient-to-r from-emerald-500 to-primary"
            : "bg-gradient-to-r from-rose-500 to-orange-500"
        }`} />

        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
              type === "income" ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400" : "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400"
            }`}>
              {type === "income" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownLeft className="h-4 w-4" />}
            </div>
            <DialogTitle className="text-base" style={{ fontWeight: 700 }}>Add Transaction</DialogTitle>
          </div>
          <DialogDescription className="text-xs mt-1">Record a new income or expense.</DialogDescription>
        </DialogHeader>

        <div className="px-6 space-y-4 pb-2">
          {/* Type toggle */}
          <div className="flex gap-1.5 p-1 bg-muted rounded-xl">
            <button
              onClick={() => setType("expense")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition-all duration-200 ${
                type === "expense"
                  ? "bg-card text-rose-600 dark:text-rose-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontWeight: 600 }}
            >
              <ArrowDownLeft className="h-4 w-4" />
              Expense
            </button>
            <button
              onClick={() => setType("income")}
              className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm transition-all duration-200 ${
                type === "income"
                  ? "bg-card text-emerald-600 dark:text-emerald-400 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              style={{ fontWeight: 600 }}
            >
              <ArrowUpRight className="h-4 w-4" />
              Income
            </button>
          </div>

          {/* Amount */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block" style={{ fontWeight: 600 }}>Amount *</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`h-12 w-full rounded-xl border bg-background pl-9 pr-4 text-xl outline-none transition-all focus:ring-2 focus:ring-primary/20 ${
                  type === "income"
                    ? "border-emerald-200 focus:border-emerald-400 dark:border-emerald-500/30"
                    : "border-border focus:border-primary/40"
                }`}
                style={{ fontWeight: 700 }}
                min="0"
                step="0.01"
              />
            </div>
            {/* Quick amounts */}
            <div className="flex items-center gap-1.5 mt-2">
              {quickAmounts.map((val) => (
                <button
                  key={val}
                  onClick={() => setAmount(String(val))}
                  className={`flex-1 rounded-lg py-1 text-[10px] border transition-all ${
                    amount === String(val)
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/30"
                  }`}
                  style={{ fontWeight: amount === String(val) ? 700 : 400 }}
                >
                  ${val}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block" style={{ fontWeight: 600 }}>Description *</label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="What was this for?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all"
              />
            </div>
          </div>

          {/* Category & Account */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block" style={{ fontWeight: 600 }}>Category *</label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-9 pr-8 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 cursor-pointer transition-all"
                >
                  <option value="">Select...</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block" style={{ fontWeight: 600 }}>Account</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <select
                  value={account}
                  onChange={(e) => setAccount(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-border bg-background pl-9 pr-8 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 cursor-pointer transition-all"
                >
                  {accountsList.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Date & Recurring */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block" style={{ fontWeight: 600 }}>Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 cursor-pointer transition-all"
                />
              </div>
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block" style={{ fontWeight: 600 }}>Frequency</label>
              <button
                onClick={() => setIsRecurring(!isRecurring)}
                className={`h-10 w-full flex items-center justify-center gap-2 rounded-xl border text-sm transition-all duration-200 ${
                  isRecurring
                    ? "border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10"
                    : "border-border text-muted-foreground hover:border-primary/30 hover:text-foreground"
                }`}
                style={{ fontWeight: isRecurring ? 600 : 400 }}
              >
                <Repeat className="h-4 w-4" />
                {isRecurring ? "Recurring" : "One-time"}
              </button>
            </div>
          </div>
        </div>

        <DialogFooter className="p-6 pt-4 gap-2">
          <button
            onClick={() => { resetForm(); onOpenChange(false); }}
            className="h-10 rounded-xl border border-border px-4 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`h-10 rounded-xl px-6 text-sm text-white transition-all duration-200 flex items-center gap-2 shadow-md ${
              type === "income"
                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20 disabled:bg-emerald-400"
                : "bg-primary hover:bg-primary/90 shadow-primary/20 disabled:bg-primary/50"
            } ${isSubmitting ? "cursor-not-allowed" : ""}`}
            style={{ fontWeight: 600 }}
          >
            {isSubmitting ? (
              <>
                <div className="h-3.5 w-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                Add {type === "income" ? "Income" : "Expense"}
              </>
            )}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
