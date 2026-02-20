import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AnimatedPage from '@/components/shared/animated-page';

export default function StatsSkeleton() {
  return (
    <AnimatedPage className="space-y-6">
      {/* Tabs */}
      <div className="w-[400px]">
        <Skeleton className="h-10 w-full rounded-md" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Pie Chart */}
        <Card className="lg:col-span-5">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-[140px]" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-4">
               <Skeleton className="h-[240px] w-[240px] rounded-full" />
            </div>
          </CardContent>
        </Card>

        {/* Category List */}
        <Card className="lg:col-span-7">
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-[100px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                 <Skeleton className="h-8 w-8 rounded-full" />
                 <Skeleton className="h-4 flex-1" />
                 <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader className="pb-2">
           <Skeleton className="h-4 w-[120px]" />
        </CardHeader>
        <CardContent>
           <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
