"use client";

import { cn } from "@/lib/utils";
import React from "react";

export default function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "p-2 max-w-96 sm:max-w-xl md:max-w-[45rem] lg:max-w-5xl xl:max-w-7xl mx-auto",
        className
      )}
    >
      {children}
    </div>
  );
}
