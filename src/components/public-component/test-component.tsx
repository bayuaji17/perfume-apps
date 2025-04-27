"use client";

import { useBrands } from "@/hooks/use-brands";
import { Brands } from "@/lib/types/inteface";
import { useState } from "react";

export default function PerfumesComponent() {
  const [params, setParams] = useState({
    currentPage: 1,
    pageSize: 5,
    search: "",
  });
  const { data, isLoading } = useBrands({
    page: params.currentPage,
    pageSize: params.pageSize,
    search: params.search,
  });
  console.log(isLoading, "loading");
  console.log(data);
  return (
    <div>
      <h1>fetch perfumes</h1>
      {data?.data.data.map((brand:Brands) => (
        <div key={brand.id}>
          <h1>{brand.id}</h1>
        </div>
      ))}
    </div>
  );
}
