"use client";
import { usePerfumes } from "@/hooks/use-perfumes";
import Container from "./container";
import { useEffect, useState } from "react";
import { Params, Perfumes } from "@/lib/types/inteface";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import { Button } from "../ui/button";
import { formatCurrency, mapConcentration } from "@/lib/utils";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import useDebounce from "@/hooks/use-debounce";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
} from "lucide-react";
import Link from "next/link";
import PerfumeCardSkeleton from "./perfume-card-skeleton";

export default function CollectionPerfumes() {
  const [params, setParams] = useState<Params>({
    currentPage: 1,
    pageSize: 6,
    search: "",
  });
  const [searchInput, setSearchInput] = useState<string>("");
  const debounce = useDebounce(searchInput, 400);
  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      search: debounce,
      currentPage: 1,
    }));
  }, [debounce]);
  const { data, isLoading } = usePerfumes({
    page: params.currentPage,
    pageSize: params.pageSize,
    search: params.search,
  });
  console.log(data);
  const dataPerfumes = data?.data.data || [];
  const totalCount = data?.data.total || (0 as number);
  const totalPages = data?.data.totalPages || (0 as number);

  const startItem = (params.currentPage - 1) * params.pageSize + 1;
  const endItem = Math.min(params.currentPage * params.pageSize, totalCount);
  const handleSearch = (value: string) => {
    setSearchInput(value);
  };
  const handlePageSize = (value: string) => {
    setParams((prev) => ({
      ...prev,
      pageSize: Number(value),
      currentPage: 1,
    }));
  };
  const gotoPage = (page: number) => {
    setParams((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };
  return (
    <section className="mb-36">
      <Container>
        <h1 className="text-5xl text-center lg:text-left font-bold my-10">
          Scents You&apos;ll Love
        </h1>
        {/* Search */}
        <div className="flex flex-col-reverse gap-2 lg:gap-0 lg:flex-row lg:justify-between mb-2 w-full">
          <div className="flex items-center gap-2 ">
            <span>Show</span>
            <Select
              value={params.pageSize.toString()}
              onValueChange={handlePageSize}
            >
              <SelectTrigger className="border-black rounded-none">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectGroup>
                  <SelectItem className="capitalize" value="6">
                    6 Items
                  </SelectItem>
                  <SelectItem className="capitalize" value="12">
                    12 Items
                  </SelectItem>
                  <SelectItem className="capitalize" value="30">
                    30 Items
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="relative">
            <Search className="absolute inset-2" />
            <Input
              className="w-full lg:w-72 pl-10 h-10 rounded-none border-black focus-visible:ring-1 focus-visible:ring-black border-2"
              placeholder="Search perfume by name"
              onChange={(e) => handleSearch(e.target.value)}
              value={searchInput}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isLoading ? (
            <PerfumeCardSkeleton/>
          ) : dataPerfumes.length > 0 ? (
            dataPerfumes.map((perfume: Perfumes) => (
              <Link key={perfume.id} href={`/collections/${perfume.id}`}>
                <Card className="p-0 gap-0 rounded-none border-2 border-black overflow-hidden">
                  {perfume.images
                    .filter((i) => i.displayOrder === 0)
                    .map((i) => (
                      <div
                        key={i.id}
                        className="relative aspect-square w-full lg:h-72 overflow-hidden group"
                      >
                        <Image
                          src={i.imageUrl}
                          alt={perfume.name}
                          fill
                          className="object-cover object-center transition duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105"
                        />
                      </div>
                    ))}
                  <CardContent className="w-full p-2 border-t-2 border-black">
                    <div className="flex flex-col gap-2.5">
                      <h1 className="inline-block cursor-pointer group mb-2">
                        <span className="relative inline-block z-10 font-bold text-xl text-wrap">
                          {perfume.name}
                          <span className="absolute left-0 bottom-0 h-0.5 w-full origin-left scale-x-0 bg-black transition-transform duration-300 group-hover:scale-x-100"></span>
                        </span>
                      </h1>

                      <p className="inline-block cursor-pointer group mb-2">
                        <span className="relative inline-block z-10 font-medium text-base text-wrap">
                          {perfume.brand.name}
                          <span className="absolute left-0 bottom-0 h-0.5 w-full origin-left scale-x-0 bg-black transition-transform duration-300 group-hover:scale-x-100"></span>
                        </span>
                      </p>
                      <div className="flex justify-between">
                        <p className="inline-block cursor-pointer group mb-2">
                          <span className="relative inline-block z-10 text-base">
                            {perfume.sizeML} ML
                            <span className="absolute left-0 bottom-0 h-0.5 w-full origin-left scale-x-0 bg-black transition-transform duration-300 group-hover:scale-x-100"></span>
                          </span>
                        </p>

                        <p className="inline-block cursor-pointer group mb-2">
                          <span className="relative inline-block z-10 font-semibold text-base text-wrap">
                            {formatCurrency(perfume.price)}
                            <span className="absolute left-0 bottom-0 h-0.5 w-full origin-right scale-x-0 bg-black transition-transform duration-300 group-hover:scale-x-100"></span>
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <p className="relative overflow-hidden group uppercase bg-white border-2 border-black font-medium p-1 px-2 text-sm cursor-pointer">
                          <span className="relative z-10 text-black group-hover:text-white transition-colors duration-300">
                            {perfume.gender}
                          </span>
                          <span className="absolute inset-0 bg-black scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                        </p>
                        <p className="relative overflow-hidden group uppercase bg-white border-2 border-black font-medium p-1 px-2 text-sm cursor-pointer">
                          <span className="relative z-10 text-black group-hover:text-white transition-colors duration-300">
                            {mapConcentration(perfume.concentration)}
                          </span>
                          <span className="absolute inset-0 bg-black scale-x-0 origin-left transition-transform duration-300 group-hover:scale-x-100"></span>
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="relative w-full rounded-none mt-3 border-black overflow-hidden group text-black border-2 cursor-pointer"
                    >
                      <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                        View Details
                      </span>
                      <span className="absolute inset-0 bg-black scale-y-0 origin-top transition-transform duration-300 group-hover:scale-y-100"></span>
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <h1 className="mt-10">No perfumes found</h1>
          )}
        </div>
        {/* Pagination */}
        <div className="flex flex-col gap-2 lg:gap-0 lg:flex-row items-center lg:justify-between ">
          <span>
            Showing {startItem} - {endItem} of {totalCount}
          </span>
          <div className="flex gap-1 items-center">
            <Button
              variant="outline"
              onClick={() => gotoPage(1)}
              disabled={params.currentPage === 1}
              className="rounded-none border-black border-2"
            >
              <ChevronsLeft />
            </Button>
            <Button
              variant="outline"
              onClick={() => gotoPage(params.currentPage - 1)}
              disabled={params.currentPage === 1}
              className="rounded-none border-black border-2"
            >
              <ChevronLeft />
            </Button>
            <Button className="rounded-none border-black border-2">
              {params.currentPage}
            </Button>
            <Button
              variant="outline"
              onClick={() => gotoPage(params.currentPage + 1)}
              disabled={params.currentPage >= totalPages}
              className="rounded-none border-black border-2"
            >
              <ChevronRight />
            </Button>
            <Button
              variant="outline"
              onClick={() => gotoPage(totalPages)}
              disabled={params.currentPage >= totalPages}
              className="rounded-none border-black border-2"
            >
              <ChevronsRight />
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
