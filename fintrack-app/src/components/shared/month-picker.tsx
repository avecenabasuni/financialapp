import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { format, subMonths, addMonths, setMonth, setYear, isSameMonth, isFuture } from 'date-fns';
import { cn } from '@/lib/utils';

interface MonthPickerProps {
  currentDate: Date;
  onMonthChange: (date: Date) => void;
}

export default function MonthPicker({ currentDate, onMonthChange }: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(currentDate.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePreset = (preset: 'this' | 'last') => {
    const today = new Date();
    if (preset === 'this') onMonthChange(today);
    if (preset === 'last') onMonthChange(subMonths(today, 1));
    setIsOpen(false);
  };

  const handleMonthSelect = (monthIndex: number) => {
    const newDate = setMonth(setYear(new Date(currentDate), viewYear), monthIndex);
    onMonthChange(newDate);
    setIsOpen(false);
  };

  const handleYearChange = (increment: number) => {
    setViewYear(prev => prev + increment);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 gap-2 px-3 text-sm font-normal min-w-[200px] justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            <span>{format(currentDate, 'MMMM yyyy')}</span>
          </div>
          <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-auto p-0" align="end">
        <div className="flex">
            {/* Presets Sidebar */}
            <div className="flex flex-col border-r p-2 gap-1 min-w-[140px]">
                <div className="text-xs font-semibold text-muted-foreground px-2 py-1.5 mb-1">
                    Presets
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start text-xs h-8"
                    onClick={() => handlePreset('this')}
                >
                    This Month
                </Button>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start text-xs h-8"
                    onClick={() => handlePreset('last')}
                >
                    Last Month
                </Button>
                 <Button 
                    variant="ghost" 
                    size="sm" 
                    className="justify-start text-xs h-8"
                    onClick={() => {
                        onMonthChange(addMonths(new Date(), 1));
                        setIsOpen(false);
                    }}
                    disabled={isFuture(addMonths(new Date(), 1))}
                >
                    Next Month
                </Button>
            </div>

            {/* Custom Picker */}
            <div className="p-3 w-[280px]">
                 <div className="flex items-center justify-between mb-4">
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleYearChange(-1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm font-semibold">{viewYear}</span>
                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleYearChange(1)} disabled={viewYear >= new Date().getFullYear() + 1}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                    {months.map((month, index) => {
                        const isSelected = isSameMonth(new Date(viewYear, index), currentDate);
                        const isFutureMonth = isFuture(new Date(viewYear, index, 1)) && index > new Date().getMonth(); // Rough future check

                        return (
                            <Button
                                key={month}
                                variant={isSelected ? "default" : "ghost"}
                                size="sm"
                                disabled={isFutureMonth && viewYear >= new Date().getFullYear()}
                                onClick={() => handleMonthSelect(index)}
                                className={cn(
                                    "text-xs h-8",
                                    isSelected && "bg-primary text-primary-foreground hover:bg-primary/90"
                                )}
                            >
                                {month.slice(0, 3)}
                            </Button>
                        );
                    })}
                </div>
            </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
