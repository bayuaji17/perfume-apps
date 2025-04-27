"use client";

import { Skeleton } from "../ui/skeleton";
import { TableCell, TableRow } from "../ui/table";

export default function TableLoading({
  rowCount,
  columnCount,
}: {
  rowCount: number;
  columnCount: number;
}) {
  return (
    <>
      {[...Array(rowCount)].map((_, index) => (
        <TableRow key={index}>
          {[...Array(columnCount)].map((_, i) => (
            <TableCell key={i}>
              <Skeleton className="h-4 w-[250px]" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
