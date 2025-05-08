"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function PerfumeCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {[...Array(count)].map((_, i) => (
        <Card
          key={i}
          className="p-0 gap-0 rounded-none border-2 border-black overflow-hidden"
        >
          <div className="relative aspect-square w-full lg:h-72 bg-gray-200 animate-pulse" />
          <CardContent className="w-full p-2 border-t-2 border-black space-y-3">
            <div className="h-6 w-full bg-gray-200 animate-pulse" />
            <div className="h-4 w-1/2 bg-gray-200 animate-pulse" />
            <div className="flex justify-between">
              <div className="h-4 w-1/4 bg-gray-200 animate-pulse" />
              <div className="h-4 w-1/4 bg-gray-200 animate-pulse" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-20 bg-gray-200 animate-pulse" />
              <div className="h-6 w-20 bg-gray-200 animate-pulse" />
            </div>
            <div className="h-10 w-full bg-gray-200 animate-pulse mt-3" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}
