"use client";
import { usePerfumes } from "@/hooks/use-perfumes";
import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { useBrands } from "@/hooks/use-brands";
import { Params } from "@/lib/types/inteface";
import { Component, Flower } from "lucide-react";

export default function TotalCards() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [params, setParams] = useState<Params>({
    currentPage: 1,
    pageSize: 5,
    search: "",
  });
  const { data: totalPerfumes } = usePerfumes({
    page: params.currentPage,
    pageSize: params.pageSize,
    search: params.search,
  });

  const perfumes = totalPerfumes?.data.total;

  const { data: totalBrand } = useBrands({
    page: params.currentPage,
    pageSize: params.pageSize,
    search: params.search,
  });
  const brands = totalBrand?.data.total;
  return (
    <div className="flex flex-col md:flex-row gap-2 my-10">
      <Card className="w-full md:w-1/2 bg-black">
        <CardContent>
          <div className="flex justify-between items-center gap-2 ">
            <h1 className="text-3xl capitalize text-white">Total Perfumes</h1>
            <Flower className="text-white" />
          </div>
          <span className="text-2xl font-bold uppercase text-white">
            {perfumes} Perfumes
          </span>
        </CardContent>
      </Card>
      <Card className="w-full md:w-1/2 border-black">
        <CardContent>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl capitalize">Total Brands</h1>
            <Component />
          </div>
          <span className="text-2xl font-bold uppercase">{brands} Brands</span>
        </CardContent>
      </Card>
    </div>
  );
}
