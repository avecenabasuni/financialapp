import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import AnimatedPage from '@/components/shared/animated-page';

export default function WalletsSkeleton() {
  return (
    <AnimatedPage className="space-y-6">
      <Card>
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <Skeleton className="h-4 w-24 mb-1" />
            <Skeleton className="h-8 w-40" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-28" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <Skeleton className="h-7 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="p-6">
           <Skeleton className="h-5 w-32 mb-4" />
           <div className="space-y-4">
             {[1, 2, 3].map((i) => (
               <div key={i} className="flex justify-between items-center">
                 <div className="flex items-center gap-3">
                   <Skeleton className="h-10 w-10 rounded-full" />
                   <div className="space-y-1">
                     <Skeleton className="h-4 w-28" />
                     <Skeleton className="h-3 w-16" />
                   </div>
                 </div>
                 <Skeleton className="h-4 w-20" />
               </div>
             ))}
           </div>
        </CardContent>
      </Card>
    </AnimatedPage>
  );
}
