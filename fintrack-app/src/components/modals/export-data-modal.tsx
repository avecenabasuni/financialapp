import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTransactionStore } from '@/store/useTransactionStore';
import { Download } from 'lucide-react';
import { api } from '@/services/api';

interface ExportDataModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ExportDataModal({ open, onClose }: ExportDataModalProps) {
  const { transactions } = useTransactionStore();
  const [format, setFormat] = useState('csv');
  const [includeTransactions, setIncludeTransactions] = useState(true);
  const [includeBudgets, setIncludeBudgets] = useState(true);
  const [includeWallets, setIncludeWallets] = useState(true);
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-02-28');

  /* CSV Generator Helper */
  const convertToCSV = (data: any[]) => {
    if (data.length === 0) return '';
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => {
        const escaped = ('' + value).replace(/"/g, '""'); // Escape double quotes
        return `"${escaped}"`; // Wrap in quotes
      }).join(',')
    );
    return [headers, ...rows].join('\n');
  };

  const handleExport = async () => {
    // If CSV format for transactions is selected, leverage the backend generator
    if (format === 'csv' && includeTransactions && !includeBudgets && !includeWallets) {
        try {
            await api.exportCSV('/export/csv', `fintrack-transactions-export.csv`);
            onClose();
        } catch (error) {
            console.error('Failed to export CSV from server:', error);
        }
        return;
    }

    // Fallback for JSON or other combinations (local export)
    const data = transactions.filter((t) => t.date >= dateFrom && t.date <= dateTo);
    
    let content = '';
    let mimeType = '';
    let extension = '';

    if (format === 'json') {
        const dataToExport = includeTransactions ? data : [];
        content = JSON.stringify(dataToExport, null, 2);
        mimeType = 'application/json';
        extension = 'json';
    } else {
        if (includeTransactions) {
             content = convertToCSV(data);
             mimeType = 'text/csv';
             extension = 'csv';
        }
    }

    if (!content) {
        // Handle empty selection
        return; 
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintrack-export-${dateFrom}-to-${dateTo}.${extension}`;
    a.click();
    URL.revokeObjectURL(url);
    onClose();
  };

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-sm" onClose={onClose}>
        <DialogHeader>
          <DialogTitle>Export Data</DialogTitle>
          <DialogClose onClick={onClose} />
        </DialogHeader>
        <DialogBody className="space-y-4">
          <div>
            <Label>Format</Label>
            <Tabs value={format} onValueChange={setFormat} className="mt-1.5">
              <TabsList className="w-full">
                <TabsTrigger value="csv" className="flex-1">CSV</TabsTrigger>
                <TabsTrigger value="json" className="flex-1">JSON</TabsTrigger>
                <TabsTrigger value="pdf" className="flex-1">PDF</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="space-y-3">
            <Label>Include</Label>
            <div className="flex items-center space-x-2">
              <Checkbox id="includeTransactions" checked={includeTransactions} onCheckedChange={setIncludeTransactions} />
              <Label htmlFor="includeTransactions" className="text-sm font-normal">Transactions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="includeBudgets" checked={includeBudgets} onCheckedChange={setIncludeBudgets} />
              <Label htmlFor="includeBudgets" className="text-sm font-normal">Budgets</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="includeWallets" checked={includeWallets} onCheckedChange={setIncludeWallets} />
              <Label htmlFor="includeWallets" className="text-sm font-normal">Wallets</Label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div><Label>From</Label><Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="mt-1.5" /></div>
            <div><Label>To</Label><Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="mt-1.5" /></div>
          </div>

          <div className="p-3 rounded-lg bg-secondary text-xs text-muted-foreground">
            {transactions.length} transactions found in selected range
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleExport} className="gap-1.5"><Download className="w-3.5 h-3.5" /> Export</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
