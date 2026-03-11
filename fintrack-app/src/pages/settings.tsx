import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserStore } from "@/store/useUserStore";
import { useEffect } from "react";
import { useTransactionStore } from "@/store/useTransactionStore";
import { useWalletStore } from "@/store/useWalletStore";
import { useBudgetStore } from "@/store/useBudgetStore";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useTheme } from "@/context/theme-context";
import AnimatedPage from "@/components/shared/animated-page";
import {
  Pencil,
  Bell,
  Download,
  Shield,
  LogOut,
  ChevronRight,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Globe,
  DollarSign,
  Key,
  Smartphone,
  Trash2,
  Upload,
  Database,
  CheckCircle2,
} from "lucide-react";
import EditProfileModal from "@/components/modals/edit-profile-modal";
import ChangePasswordModal from "@/components/modals/change-password-modal";
import { toast } from "sonner";

export default function Settings() {
  const { user, setCurrency, setLanguage } = useUserStore();
  const { transactions, reset: resetTransactions } = useTransactionStore();
  const { wallets, reset: resetWallets } = useWalletStore();
  const { budgets, reset: resetBudgets } = useBudgetStore();
  const { categories, reset: resetCategories } = useCategoryStore();
  const { theme, setTheme } = useTheme();
  const [notifTxn, setNotifTxn] = useState(
    user.preferences?.notifications?.transactions ?? true
  );
  const [notifBudget, setNotifBudget] = useState(
    user.preferences?.notifications?.budgets ?? true
  );
  const [notifReport, setNotifReport] = useState(
    user.preferences?.notifications?.reports ?? false
  );
  const importRef = useRef<HTMLInputElement>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Sync local state with store
  useEffect(() => {
    // Initialize from store if needed
  }, [user.currency, user.language]);

  const handleExport = () => {
    const data = JSON.stringify(
      { transactions, wallets, budgets, categories, user },
      null,
      2
    );
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `fintrack-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully");
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      if (!data.transactions || !data.wallets) {
        throw new Error("Invalid backup file: Missing core data.");
      }

      const confirmMsg = `Found backup with:\n- ${data.transactions.length} Transactions\n- ${data.wallets.length} Wallets\n\nRestoring will REPLACE all current data. Continue?`;

      if (window.confirm(confirmMsg)) {
        useTransactionStore.setState({ transactions: data.transactions });
        useWalletStore.setState({ wallets: data.wallets });
        useBudgetStore.setState({ budgets: data.budgets || [] });
        useCategoryStore.setState({ categories: data.categories || [] });

        if (data.user) {
          useUserStore.setState({ user: data.user });
        }

        toast.success("Data restored successfully");
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error("Import failed:", error);
      toast.error("Failed to import data. Invalid file format.");
    } finally {
      e.target.value = "";
    }
  };

  const handleHardReset = () => {
    if (
      !window.confirm(
        "DANGER: This will delete ALL your data (Wallets, Transactions, Settings). This action cannot be undone. Are you sure?"
      )
    )
      return;

    resetTransactions();
    resetWallets();
    resetBudgets();
    resetCategories();

    localStorage.removeItem("fintrack-storage");
    localStorage.removeItem("fintrack-transactions");
    localStorage.removeItem("fintrack-categories");
    localStorage.removeItem("fintrack-budgets");
    localStorage.removeItem("recurring-storage");
    localStorage.removeItem("fintrack-user");

    toast.error("All data has been wiped.");
    setTimeout(() => window.location.reload(), 1000);
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <AnimatedPage className="space-y-5 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl tracking-tight font-bold">Settings</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">
          Manage your account settings and preferences.
        </p>
      </div>

      {/* Profile Card */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold">Profile</CardTitle>
          <CardDescription className="mt-0.5 text-xs">
            Your personal information and appearance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16 ring-2 ring-primary/20">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary text-lg font-semibold">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-base font-semibold text-foreground">
                {user.name}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                {user.email}
              </div>
              <Badge variant="secondary" className="mt-1.5 text-[10px]">
                Free Plan
              </Badge>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 shrink-0"
              onClick={() => setIsEditProfileOpen(true)}
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* General Settings */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">General</CardTitle>
          </div>
          <CardDescription className="mt-0.5 text-xs">
            Customize your experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Currency</Label>
            </div>
            <Select
              className="w-28 h-9 text-xs"
              value={user.currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="IDR">IDR Rp</option>
              <option value="USD">USD $</option>
              <option value="EUR">EUR €</option>
              <option value="GBP">GBP £</option>
              <option value="SGD">SGD $</option>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Language</Label>
            </div>
            <Select
              className="w-28 h-9 text-xs"
              value={user.language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en">English</option>
              <option value="id">Bahasa</option>
            </Select>
          </div>
          <Separator />
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Monitor className="w-4 h-4 text-muted-foreground" />
              <Label className="text-sm font-medium">Theme</Label>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((opt) => {
                const Icon = opt.icon;
                return (
                  <Button
                    key={opt.value}
                    variant={theme === opt.value ? "default" : "outline"}
                    className={`h-14 flex flex-col gap-1 ${
                      theme === opt.value
                        ? "border-primary border-2"
                        : "border-border/60"
                    }`}
                    onClick={() =>
                      setTheme(opt.value as "dark" | "light" | "system")
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{opt.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">
              Notifications
            </CardTitle>
          </div>
          <CardDescription className="mt-0.5 text-xs">
            Control what alerts you receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-500/15 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <Label className="text-sm font-medium">
                  Transaction alerts
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get notified for new transactions
                </p>
              </div>
            </div>
            <Switch checked={notifTxn} onCheckedChange={setNotifTxn} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-500/15 flex items-center justify-center">
                <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <Label className="text-sm font-medium">Budget warnings</Label>
                <p className="text-xs text-muted-foreground">
                  Alert when approaching budget limits
                </p>
              </div>
            </div>
            <Switch checked={notifBudget} onCheckedChange={setNotifBudget} />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-500/15 flex items-center justify-center">
                <Database className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              </div>
              <div>
                <Label className="text-sm font-medium">Weekly reports</Label>
                <p className="text-xs text-muted-foreground">
                  Receive weekly spending summaries
                </p>
              </div>
            </div>
            <Switch checked={notifReport} onCheckedChange={setNotifReport} />
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Data</CardTitle>
          </div>
          <CardDescription className="mt-0.5 text-xs">
            Export or import your financial data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-between h-11"
            onClick={handleExport}
          >
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            className="w-full justify-between h-11"
            onClick={() => importRef.current?.click()}
          >
            <span className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import Data
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <input
            ref={importRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />
          <p className="text-xs text-muted-foreground text-center pt-2">
            Backup your data regularly to avoid losing important information
          </p>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-border/60">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <CardTitle className="text-sm font-semibold">Security</CardTitle>
          </div>
          <CardDescription className="mt-0.5 text-xs">
            Protect your account and data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-between h-11"
            onClick={() => setIsChangePasswordOpen(true)}
          >
            <span className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              Change Password
            </span>
            <ChevronRight className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="w-full justify-between h-11">
            <span className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Two-Factor Authentication
            </span>
            <Badge variant="secondary" className="text-[10px]">
              Coming Soon
            </Badge>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 h-11"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </Button>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500/50 bg-red-500/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
            <CardTitle className="text-sm text-red-600 dark:text-red-400 font-semibold">
              Danger Zone
            </CardTitle>
          </div>
          <CardDescription className="mt-0.5 text-xs text-red-600/70 dark:text-red-400/70">
            Irreversible actions that will permanently delete your data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">
            Once you delete your data, there is no going back. Please be
            certain.
          </p>
          <Button
            variant="destructive"
            className="w-full gap-2"
            onClick={handleHardReset}
          >
            <Trash2 className="w-4 h-4" />
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      <EditProfileModal
        open={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
      <ChangePasswordModal
        open={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
    </AnimatedPage>
  );
}
