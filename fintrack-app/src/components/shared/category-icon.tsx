import * as LucideIcons from 'lucide-react';
import type { LucideProps } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CategoryIconProps {
  icon: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CategoryIcon({ icon, color, size = 'md', className }: CategoryIconProps) {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<LucideProps>>)[icon] || LucideIcons.Circle;

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const iconSizeClasses = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const style = color ? { backgroundColor: `${color}20` } : undefined;

  return (
    <div
      className={cn(sizeClasses[size], "rounded-lg flex items-center justify-center shrink-0", className)}
      style={style}
    >
      <IconComponent className={iconSizeClasses[size]} color={color} />
    </div>
  );
}
