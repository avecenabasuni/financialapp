import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AnimatedPage from '@/components/shared/animated-page';

export default function DashboardSkeleton() {
  return (
    <AnimatedPage className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-[120px] mb-2" />
              <Skeleton className="h-3 w-[80px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Chart Area */}
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-[140px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[320px] w-full rounded-md" />
          </CardContent>
        </Card>

        {/* Budget Overview */}
        <Card className="col-span-12 lg:col-span-4">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-[120px]" />
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-3 w-[80px]" />
                  <Skeleton className="h-3 w-[40px]" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader className="pb-2 flex-row items-center justify-between">
          <Skeleton className="h-4 w-[140px]" />
          <Skeleton className="h-8 w-[80px]" />
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-border">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[100px]" />
                    <Skeleton className="h-3 w-[60px]" />
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <Skeleton className="h-4 w-[80px] ml-auto" />
                  <Skeleton className="h-3 w-[40px] ml-auto" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
