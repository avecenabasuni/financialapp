import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface ListSkeletonProps {
  rows?: number;
  showHeader?: boolean;
}

export default function ListSkeleton({ rows = 2, showHeader = true }: ListSkeletonProps) {
  return (
    <div className="space-y-6">
       {/* Header Skeleton */}
       {showHeader && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-2">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
        </div>
       )}

       {/* Stats Cards Skeleton */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
              <Card key={i} className="border-none shadow-sm">
                  <CardContent className="p-6 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <Skeleton className="h-10 w-10 rounded-full" />
                          <div className="space-y-2">
                              <Skeleton className="h-3 w-16" />
                              <Skeleton className="h-6 w-24" />
                          </div>
                      </div>
                  </CardContent>
              </Card>
          ))}
       </div>

       {/* Filter Bar Skeleton */}
       <div className="flex flex-col lg:flex-row gap-4 items-center justify-between bg-card p-4 rounded-xl border shadow-sm">
           <div className="flex gap-3">
                <Skeleton className="h-9 w-48 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
           </div>
           <div className="flex gap-3">
                <Skeleton className="h-9 w-48 rounded-lg" />
                <Skeleton className="h-9 w-24 rounded-lg" />
           </div>
       </div>

      {/* List skeleton (Daily Groups) */}
      <div className="space-y-6">
          {Array.from({ length: rows }).map((_, groupIndex) => (
              <div key={groupIndex} className="space-y-2">
                 {/* Daily Header */}
                 <div className="flex justify-between px-4 py-3">
                     <Skeleton className="h-4 w-32" />
                     <div className="flex gap-4">
                         <Skeleton className="h-3 w-20" />
                         <Skeleton className="h-3 w-20" />
                     </div>
                 </div>
                 {/* Table */}
                 <Card className="border shadow-sm">
                    <CardContent className="p-0">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
                                <Skeleton className="h-8 w-8 rounded-lg" />
                                <div className="flex-1 space-y-1">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </CardContent>
                 </Card>
              </div>
          ))}
      </div>
    </div>
  );
}
