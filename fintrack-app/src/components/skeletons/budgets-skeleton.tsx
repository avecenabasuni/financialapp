import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AnimatedPage from '@/components/shared/animated-page';

export default function BudgetsSkeleton() {
  return (
    <AnimatedPage className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
            <Skeleton className="h-9 w-48" />
            <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      {/* Top Section: Charts & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chart Skeleton */}
          <Card className="flex flex-col h-[400px]">
              <CardHeader>
                  <Skeleton className="h-6 w-48 mb-1" />
                  <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                  <Skeleton className="h-48 w-48 rounded-full" />
              </CardContent>
          </Card>

          {/* Monthly Summary Skeleton */}
          <Card className="flex flex-col justify-center h-[400px]">
              <CardHeader>
                  <Skeleton className="h-6 w-40 mb-1" />
                  <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent className="space-y-8">
                  <div className="grid grid-cols-3 gap-4">
                      {[1, 2, 3].map(i => (
                          <div key={i} className="flex flex-col items-center gap-2">
                              <Skeleton className="h-3 w-16" />
                              <Skeleton className="h-8 w-24" />
                          </div>
                      ))}
                  </div>
                  <div className="space-y-2">
                      <div className="flex justify-between">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-3 w-full rounded-full" />
                  </div>
                  <Skeleton className="h-10 w-full rounded-lg" />
              </CardContent>
          </Card>
      </div>

      <Skeleton className="h-7 w-32 mt-4" />

      {/* Budget Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="h-full">
              <CardContent className="p-5">
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                         <Skeleton className="h-10 w-10 rounded-lg" />
                         <div className="space-y-1">
                             <Skeleton className="h-4 w-24" />
                             <Skeleton className="h-3 w-16" />
                         </div>
                    </div>
                    <Skeleton className="h-6 w-16" />
                 </div>
                 <div className="space-y-2">
                     <div className="flex justify-between">
                         <Skeleton className="h-3 w-12" />
                         <Skeleton className="h-3 w-12" />
                     </div>
                     <Skeleton className="h-2 w-full rounded-full" />
                     <div className="flex justify-between">
                         <Skeleton className="h-3 w-16" />
                         <Skeleton className="h-3 w-20" />
                     </div>
                 </div>
              </CardContent>
            </Card>
        ))}
      </div>
    </AnimatedPage>
  );
}
