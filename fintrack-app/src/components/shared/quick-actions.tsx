import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Plus,
  Send,
  Download,
  Receipt,
  ArrowRightLeft,
  CreditCard,
  QrCode,
  PiggyBank,
} from "lucide-react";
import { useToast } from "@/context/toast-context";

const actions = [
  {
    label: "Add",
    sublabel: "Transaction",
    icon: Plus,
    color: "bg-primary/10 text-primary hover:bg-primary/15",
    isAdd: true,
  },
  {
    label: "Transfer",
    sublabel: "Money",
    icon: Send,
    color:
      "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-400 dark:hover:bg-blue-500/25",
    isAdd: false,
  },
  {
    label: "Pay",
    sublabel: "Bills",
    icon: Receipt,
    color:
      "bg-amber-50 text-amber-600 hover:bg-amber-100 dark:bg-amber-500/15 dark:text-amber-400 dark:hover:bg-amber-500/25",
    isAdd: false,
  },
  {
    label: "Request",
    sublabel: "Payment",
    icon: Download,
    color:
      "bg-violet-50 text-violet-600 hover:bg-violet-100 dark:bg-violet-500/15 dark:text-violet-400 dark:hover:bg-violet-500/25",
    isAdd: false,
  },
  {
    label: "Convert",
    sublabel: "Currency",
    icon: ArrowRightLeft,
    color:
      "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-500/25",
    isAdd: false,
  },
  {
    label: "Scan",
    sublabel: "QR Code",
    icon: QrCode,
    color:
      "bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-500/15 dark:text-rose-400 dark:hover:bg-rose-500/25",
    isAdd: false,
  },
];

interface QuickActionsProps {
  onAddTransaction?: () => void;
}

export function QuickActions({ onAddTransaction }: QuickActionsProps) {
  const { addToast } = useToast();

  const handleAction = (action: (typeof actions)[0]) => {
    if (action.isAdd) {
      onAddTransaction?.();
    } else {
      addToast(`${action.label} ${action.sublabel} coming soon!`, "info");
    }
  };

  return (
    <Card className="h-full border-border/60 hover:shadow-md hover:shadow-black/5 transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={() => handleAction(action)}
              className="flex flex-col items-center gap-1.5 rounded-xl p-3 hover:bg-accent/50 transition-all duration-150 group"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-150 group-hover:scale-105 ${action.color}`}
              >
                <action.icon className="h-4.5 w-4.5" />
              </div>
              <div className="text-center">
                <p className="text-xs font-semibold">{action.label}</p>
                <p className="text-[10px] text-muted-foreground">
                  {action.sublabel}
                </p>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
