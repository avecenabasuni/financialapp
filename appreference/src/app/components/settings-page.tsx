import {
  User,
  Bell,
  Shield,
  CreditCard,
  Palette,
  Globe,
  ChevronRight,
  Mail,
  Smartphone,
  Lock,
  Key,
  Download,
  Trash2,
  FileText,
  BarChart3,
  Upload,
  HardDrive,
  Calendar,
  Sun,
  Moon,
  Monitor,
  CheckCircle2,
  Camera,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Switch } from "./ui/switch";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { toast } from "sonner";

type ThemeChoice = "light" | "dark" | "system";

export function SettingsPage() {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [weeklyReport, setWeeklyReport] = useState(false);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);
  const [billReminders, setBillReminders] = useState(true);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const themeOptions: { value: ThemeChoice; label: string; icon: React.ElementType }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl tracking-tight" style={{ fontWeight: 700 }}>Settings</h1>
        <p className="text-muted-foreground mt-0.5 text-sm">Manage your account preferences and configuration.</p>
      </div>

      {/* Profile */}
      <Card className="border-border/60 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-r from-primary/20 via-emerald-500/10 to-violet-500/10" />
        <CardHeader className="pb-3 relative pt-6">
          <CardTitle className="flex items-center gap-2 text-sm" style={{ fontWeight: 600 }}>
            <User className="h-4 w-4" />
            Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16 ring-2 ring-primary/20 ring-offset-2 ring-offset-card">
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-emerald-500/20 text-primary text-xl" style={{ fontWeight: 700 }}>JD</AvatarFallback>
              </Avatar>
              <button className="absolute -bottom-0.5 -right-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-white shadow-md hover:bg-primary/90 transition-colors">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div className="flex-1">
              <h3 style={{ fontWeight: 600 }}>Jordan Davis</h3>
              <p className="text-sm text-muted-foreground">jordan.davis@email.com</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="border-0 text-xs gap-1 bg-primary/10 text-primary">
                  <Sparkles className="h-2.5 w-2.5" />
                  Personal Plan
                </Badge>
                <span className="text-xs text-muted-foreground">Member since Jan 2025</span>
              </div>
            </div>
            <button
              onClick={() => toast.info("Profile editing coming soon!")}
              className="rounded-xl border border-border px-3 h-9 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
            >
              Edit Profile
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm" style={{ fontWeight: 600 }}>
            <Palette className="h-4 w-4" />
            Appearance
          </CardTitle>
          <CardDescription className="text-xs">Customize how MoneyFlow looks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2.5" style={{ fontWeight: 600 }}>Theme</p>
              <div className="grid grid-cols-3 gap-2">
                {mounted && themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.value;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border py-4 transition-all duration-150 ${
                        isActive
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-border text-muted-foreground hover:border-primary/30 hover:bg-accent"
                      }`}
                    >
                      {isActive && (
                        <span className="absolute top-2 right-2">
                          <CheckCircle2 className="h-3 w-3 text-primary" />
                        </span>
                      )}
                      <Icon className="h-5 w-5" />
                      <span className="text-xs" style={{ fontWeight: isActive ? 600 : 400 }}>{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm" style={{ fontWeight: 600 }}>
            <Bell className="h-4 w-4" />
            Notifications
          </CardTitle>
          <CardDescription className="text-xs">Choose how you want to be notified</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {[
              {
                label: "Email Notifications",
                desc: "Receive updates via email",
                icon: Mail,
                iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
                value: emailNotif,
                onChange: setEmailNotif,
              },
              {
                label: "Push Notifications",
                desc: "Get notified on your device",
                icon: Smartphone,
                iconBg: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
                value: pushNotif,
                onChange: setPushNotif,
              },
              {
                label: "Weekly Reports",
                desc: "Weekly spending summary",
                icon: Download,
                iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
                value: weeklyReport,
                onChange: setWeeklyReport,
              },
              {
                label: "Budget Alerts",
                desc: "Alert when nearing budget limit",
                icon: Bell,
                iconBg: "bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-400",
                value: budgetAlerts,
                onChange: setBudgetAlerts,
              },
              {
                label: "Bill Reminders",
                desc: "Remind me 3 days before due",
                icon: Calendar,
                iconBg: "bg-rose-50 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400",
                value: billReminders,
                onChange: setBillReminders,
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.iconBg}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm" style={{ fontWeight: 500 }}>{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <Switch
                  checked={item.value}
                  onCheckedChange={(v) => {
                    item.onChange(v);
                    toast.success(`${item.label} ${v ? "enabled" : "disabled"}`);
                  }}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm" style={{ fontWeight: 600 }}>
            <Shield className="h-4 w-4" />
            Security
          </CardTitle>
          <CardDescription className="text-xs">Protect your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            <div className="flex items-center justify-between py-3 border-b border-border/50">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-400">
                  <Lock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm" style={{ fontWeight: 500 }}>Two-Factor Authentication</p>
                  <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                </div>
              </div>
              <Switch
                checked={twoFactor}
                onCheckedChange={(v) => {
                  setTwoFactor(v);
                  toast.success(`Two-factor authentication ${v ? "enabled" : "disabled"}`);
                }}
              />
            </div>
            <button
              className="flex w-full items-center justify-between py-3 -mx-1 px-1 hover:bg-accent/50 rounded-xl transition-colors cursor-pointer"
              onClick={() => toast.info("Password change coming soon!")}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-600 dark:bg-slate-700/50 dark:text-slate-300">
                  <Key className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm" style={{ fontWeight: 500 }}>Change Password</p>
                  <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm" style={{ fontWeight: 600 }}>
            <Globe className="h-4 w-4" />
            Preferences
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            {[
              {
                label: "Currency",
                desc: "USD - US Dollar",
                icon: Globe,
                iconBg: "bg-primary/10 text-primary",
              },
              {
                label: "Linked Payment Methods",
                desc: "4 methods connected",
                icon: CreditCard,
                iconBg: "bg-orange-50 text-orange-600 dark:bg-orange-500/15 dark:text-orange-400",
              },
              {
                label: "Fiscal Year Start",
                desc: "January 1st",
                icon: Calendar,
                iconBg: "bg-sky-50 text-sky-600 dark:bg-sky-500/15 dark:text-sky-400",
              },
            ].map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center justify-between py-3 -mx-1 px-1 hover:bg-accent/50 rounded-xl transition-colors cursor-pointer border-b border-border/50 last:border-0"
                onClick={() => toast.info(`${item.label} settings coming soon!`)}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.iconBg}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm" style={{ fontWeight: 500 }}>{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Reports & Export */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm" style={{ fontWeight: 600 }}>
            <FileText className="h-4 w-4" />
            Reports & Export
          </CardTitle>
          <CardDescription className="text-xs">Generate and download financial reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              {
                label: "Monthly Statement",
                desc: "February 2026 summary",
                icon: FileText,
                iconBg: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400",
                actions: ["PDF"],
              },
              {
                label: "Annual Report",
                desc: "2025 full year summary",
                icon: BarChart3,
                iconBg: "bg-blue-50 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400",
                actions: ["PDF"],
              },
              {
                label: "Export Transactions",
                desc: "Download as CSV or Excel",
                icon: Download,
                iconBg: "bg-violet-50 text-violet-600 dark:bg-violet-500/15 dark:text-violet-400",
                actions: ["CSV", "Excel"],
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-border/60 p-3 hover:shadow-sm transition-all">
                <div className="flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${item.iconBg}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm" style={{ fontWeight: 500 }}>{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.actions.map((action) => (
                    <button
                      key={action}
                      onClick={() => toast.success(`${item.label} downloading as ${action}...`)}
                      className="flex items-center gap-1 rounded-lg border border-border px-2.5 h-7 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                    >
                      <Download className="h-3 w-3" />
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm" style={{ fontWeight: 600 }}>
            <HardDrive className="h-4 w-4" />
            Data Management
          </CardTitle>
          <CardDescription className="text-xs">Import, backup, and manage your data</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-0">
            <button
              className="flex w-full items-center justify-between py-3 -mx-1 px-1 hover:bg-accent/50 rounded-xl transition-colors cursor-pointer border-b border-border/50"
              onClick={() => toast.info("Data import coming soon!")}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Upload className="h-4 w-4" />
                </div>
                <div className="text-left">
                  <p className="text-sm" style={{ fontWeight: 500 }}>Import Data</p>
                  <p className="text-xs text-muted-foreground">Import from CSV, OFX, or QIF files</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-400">
                  <HardDrive className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm" style={{ fontWeight: 500 }}>Backup Data</p>
                  <p className="text-xs text-muted-foreground">Last backup: Feb 19, 2026</p>
                </div>
              </div>
              <button
                onClick={() => toast.success("Backup started! You'll be notified when complete.")}
                className="rounded-xl border border-border px-3 h-8 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
              >
                Backup Now
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-red-200 dark:border-red-500/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-600 dark:text-red-400 flex items-center gap-2 text-sm" style={{ fontWeight: 600 }}>
            <Trash2 className="h-4 w-4" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ fontWeight: 500 }}>Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and all data</p>
            </div>
            <button
              onClick={() => toast.error("This action cannot be undone. Please contact support.")}
              className="rounded-xl border border-red-200 dark:border-red-500/30 px-3 h-9 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
