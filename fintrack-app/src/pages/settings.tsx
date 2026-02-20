import { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useUserStore } from '@/store/useUserStore';
import { useTransactionStore } from '@/store/useTransactionStore';
import { useWalletStore } from '@/store/useWalletStore';
import { useBudgetStore } from '@/store/useBudgetStore';
import { useCategoryStore } from '@/store/useCategoryStore';
import { useTheme } from '@/context/theme-context';
import { useToast } from '@/context/toast-context';
import AnimatedPage from '@/components/shared/animated-page';
import { Pencil, Bell, Download, Shield, LogOut, ChevronRight, AlertTriangle } from 'lucide-react';
import EditProfileModal from '@/components/modals/edit-profile-modal';

export default function Settings() {
  const { user } = useUserStore();
  const { transactions, reset: resetTransactions } = useTransactionStore();
  const { wallets, reset: resetWallets } = useWalletStore();
  const { budgets, reset: resetBudgets } = useBudgetStore();
  const { categories, reset: resetCategories } = useCategoryStore();
  const { theme, setTheme } = useTheme();
  const { addToast } = useToast();
  const [notifTxn, setNotifTxn] = useState(user.preferences?.notifications?.transactions ?? true);
  const [notifBudget, setNotifBudget] = useState(user.preferences?.notifications?.budgets ?? true);
  const [notifReport, setNotifReport] = useState(user.preferences?.notifications?.reports ?? false);
  const importRef = useRef<HTMLInputElement>(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);

  const handleExport = () => {
    const data = JSON.stringify({ transactions, wallets, budgets, categories, user }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintrack-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Data exported successfully');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);

      // Basic Validation
      if (!data.transactions || !data.wallets) {
        throw new Error("Invalid backup file: Missing core data.");
      }

      const confirmMsg = `Found backup with:\n- ${data.transactions.length} Transactions\n- ${data.wallets.length} Wallets\n\nRestoring will REPLACE all current data. Continue?`;
      
      if (window.confirm(confirmMsg)) {
        // Bulk Restore
        useTransactionStore.setState({ transactions: data.transactions });
        useWalletStore.setState({ wallets: data.wallets });
        useBudgetStore.setState({ budgets: data.budgets || [] });
        useCategoryStore.setState({ categories: data.categories || [] });
        
        if (data.user) {
            useUserStore.setState({ user: data.user });
        }

        addToast('Data restored successfully', 'success');
        
        // Reload to ensure all components sync up with new state (lazy way to fix store subscriptions)
        setTimeout(() => window.location.reload(), 1000);
      }
    } catch (error) {
      console.error('Import failed:', error);
      addToast('Failed to import data. Invalid file format.', 'error');
    } finally {
        // Reset input so same file can be selected again if needed
        e.target.value = '';
    }
  };

  const handleHardReset = () => {
    if (!window.confirm('DANGER: This will delete ALL your data (Wallets, Transactions, Settings). This action cannot be undone. Are you sure?')) return;
    
    // Clear State
    resetTransactions();
    resetWallets();
    resetBudgets();
    resetCategories();
    
    // Clear Persistence
    localStorage.removeItem('fintrack-storage'); // Wallets
    localStorage.removeItem('fintrack-transactions');
    localStorage.removeItem('fintrack-categories');
    localStorage.removeItem('fintrack-budgets');
    localStorage.removeItem('recurring-storage');
    localStorage.removeItem('fintrack-user');

    addToast('All data has been wiped.');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <AnimatedPage className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">Profile</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-primary/20 text-primary text-lg font-medium">{user.initials}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="text-base font-medium text-foreground">{user.name}</div>
              <div className="text-sm text-muted-foreground truncate">{user.email}</div>
            </div>
            <Button variant="outline" size="sm" className="gap-1.5 shrink-0" onClick={() => setIsEditProfileOpen(true)}><Pencil className="w-3.5 h-3.5" /> Edit</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2"><CardTitle className="text-sm">General</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Currency</Label>
            <Select className="w-32" defaultValue="IDR"><option>IDR</option><option>USD</option><option>EUR</option></Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label>Language</Label>
            <Select className="w-32" defaultValue="en"><option value="en">English</option><option value="id">Bahasa</option></Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <Label>Theme</Label>
            <Select className="w-32" value={theme} onChange={(e) => setTheme(e.target.value as 'dark' | 'light' | 'system')}>
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2"><Bell className="w-4 h-4 text-muted-foreground" /><CardTitle className="text-sm">Notifications</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between"><Label>Transaction alerts</Label><Switch checked={notifTxn} onCheckedChange={setNotifTxn} /></div>
          <Separator />
          <div className="flex items-center justify-between"><Label>Budget warnings</Label><Switch checked={notifBudget} onCheckedChange={setNotifBudget} /></div>
          <Separator />
          <div className="flex items-center justify-between"><Label>Weekly reports</Label><Switch checked={notifReport} onCheckedChange={setNotifReport} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2"><Download className="w-4 h-4 text-muted-foreground" /><CardTitle className="text-sm">Data</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between" onClick={handleExport}>Export Data <ChevronRight className="w-4 h-4" /></Button>
          <Button variant="outline" className="w-full justify-between" onClick={() => importRef.current?.click()}>Import Data <ChevronRight className="w-4 h-4" /></Button>
          <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImport} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-muted-foreground" /><CardTitle className="text-sm">Account</CardTitle></div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-between">Change Password <ChevronRight className="w-4 h-4" /></Button>
          <Button variant="ghost" className="w-full justify-start gap-2 text-expense hover:text-expense"><LogOut className="w-4 h-4" /> Log Out</Button>
        </CardContent>
      </Card>

      <Card className="border-expense/50 bg-expense/5">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-expense" /><CardTitle className="text-sm text-expense">Danger Zone</CardTitle></div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-4">Once you delete your data, there is no going back. Please be certain.</p>
          <Button variant="destructive" className="w-full" onClick={handleHardReset}>Clear All Data</Button>
        </CardContent>
      </Card>

      <EditProfileModal open={isEditProfileOpen} onClose={() => setIsEditProfileOpen(false)} />
    </AnimatedPage>
  );
}
