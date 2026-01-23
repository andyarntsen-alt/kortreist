import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProducerCardSkeleton() {
    return (
        <Card className="overflow-hidden flex flex-col h-full border-2 border-black/10">
            {/* Image skeleton */}
            <Skeleton className="h-40 w-full rounded-none" />

            <CardHeader className="p-4 pb-1">
                <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <div className="flex items-center gap-1 mt-2">
                    <Skeleton className="h-3 w-3 rounded-full" />
                    <Skeleton className="h-3 w-2/3" />
                </div>
            </CardHeader>

            <CardContent className="p-4 pt-1 flex-grow">
                <Skeleton className="h-3 w-full mb-1" />
                <Skeleton className="h-3 w-4/5" />
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Skeleton className="h-9 w-full" />
            </CardFooter>
        </Card>
    );
}

export function ProducerGridSkeleton({ count = 6 }: { count?: number }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: count }).map((_, i) => (
                <ProducerCardSkeleton key={i} />
            ))}
        </div>
    );
}
