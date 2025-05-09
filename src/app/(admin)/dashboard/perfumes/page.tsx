import PerfumesTable from "@/components/admin-component/perfumes/perfumes-table";
import React from "react";

export default function page() {
  return (
    <>
      <h1 className="font-bold text-4xl">List Perfumes</h1>
      <PerfumesTable />
    </>
  );
}
