"use client";

import { usePathname } from "next/navigation";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default function DynamicBreadCrumb() {
  const pathname = usePathname();
  const segmentPaths = pathname.split("/").filter((segment) => segment);
  function formatSegment(segment: string) {
    return segment
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  }
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {segmentPaths.map((path, index) => {
          const href = "/" + segmentPaths.slice(0, index + 1).join("/");
          const isLast = index === segmentPaths.length - 1;
          return (
            <span key={href} className="flex items-center">
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{formatSegment(path)}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>
                    {formatSegment(path)}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </span>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
