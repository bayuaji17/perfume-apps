"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Pen,
  Search,
  Trash,
} from "lucide-react";
import Image from "next/image";
import { formatCurrency, formatDate, mapConcentration } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useDebounce from "@/hooks/use-debounce";
import { useRouter } from "next/navigation";
import { Params, Perfumes } from "@/lib/types/inteface";
import { usePerfumes } from "@/hooks/use-perfumes";
import TableLoading from "../table-skeleton";
import DeletePerfume from "./delete-perfume";

export default function PerfumesTable() {
  const [pagination, setPagination] = useState<Params>({
    currentPage: 1,
    pageSize: 5,
    search: "",
  });
  const [selectedPerfume, setSelectedPerfume] = useState<Perfumes | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const router = useRouter();
  const debounce = useDebounce(searchInput, 400);
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      search: debounce,
      currentPage: 1,
    }));
  }, [debounce]);
  const { data, isLoading } = usePerfumes({
    page: pagination.currentPage,
    pageSize: pagination.pageSize,
    search: pagination.search,
  });

  const handleSearch = (value: string) => {
    setSearchInput(value);
  };
  const handlePageSize = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: Number(value),
      currentPage: 1,
    }));
  };
  const gotoPage = (page: number) => {
    setPagination((prev) => ({
      ...prev,
      currentPage: page,
    }));
  };
  const perfumes = data?.data.data || [];
  const totalCount = data?.data.total || (0 as number);
  const totalPages = data?.data.totalPages || (0 as number);

  const startItem = (pagination.currentPage - 1) * pagination.pageSize + 1;
  const endItem = Math.min(
    pagination.currentPage * pagination.pageSize,
    totalCount
  );

  return (
    <>
      <div className="flex justify-end gap-4 items-center">
        <div className="flex relative">
          <Search size={18} strokeWidth="1.2px" className="absolute inset-2" />
          <Input
            type="search"
            placeholder="Search"
            className="border-black sm:w-2xs pl-9"
            onChange={(e) => handleSearch(e.target.value)}
            value={searchInput}
          />
        </div>
        <Button asChild>
          <Link href={"/dashboard/perfumes/add-perfume"}>Add Perfumes</Link>
        </Button>
      </div>
      <DeletePerfume
        perfume={selectedPerfume}
        open={deleteDialog}
        setOpen={setDeleteDialog}
      />
      <div className="w-full overflow-auto rounded-lg border-1 my-2 border-black">
        <Table>
          <TableHeader className="bg-gray-100 h-16">
            <TableRow className="border-b-2 border-black">
              <TableHead>No</TableHead>
              <TableHead>Perfumes Image</TableHead>
              <TableHead>Perfume Name</TableHead>
              <TableHead>Brand Name</TableHead>
              <TableHead>Category Perfume</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading rowCount={10} columnCount={11} />
            ) : perfumes.length > 0 ? (
              perfumes.map((perfumes: Perfumes, index: number) => (
                <TableRow key={perfumes.id} className="border-black">
                  <TableCell>
                    {(pagination.currentPage - 1) * pagination.pageSize +
                      index +
                      1}
                  </TableCell>
                  <TableCell>
                    {perfumes?.images?.[0]?.imageUrl ? (
                      <Image
                        src={perfumes.images[0].imageUrl}
                        alt={perfumes.name}
                        width={100}
                        height={100}
                      />
                    ) : (
                      <span>No Image Found</span>
                    )}
                  </TableCell>
                  <TableCell>{perfumes.name}</TableCell>
                  <TableCell>{perfumes.brand.name}</TableCell>
                  <TableCell>
                    {mapConcentration(perfumes.concentration)}
                  </TableCell>
                  <TableCell>{perfumes.gender}</TableCell>
                  <TableCell>{perfumes.sizeML} ML</TableCell>
                  <TableCell>{formatCurrency(perfumes.price)}</TableCell>
                  <TableCell>{formatDate(perfumes.createdAt)}</TableCell>
                  <TableCell>{formatDate(perfumes.updatedAt)}</TableCell>
                  <TableCell>
                    <span className="flex items-center justify-center space-x-2">
                      <Button asChild>
                        <Link href={`/collections/${perfumes.id}`}>
                          <Eye
                            size={20}
                            strokeWidth="1.5px"
                          />
                        </Link>
                      </Button>
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          router.push(
                            `/dashboard/perfumes/${perfumes.id}/edit`
                          );
                        }}
                      >
                        <Pen />
                      </Button>
                      <Button
                        variant={"destructive"}
                        onClick={() => {
                          setSelectedPerfume(perfumes);
                          setDeleteDialog(true);
                        }}
                      >
                        <Trash />
                      </Button>
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4">
                  No perfumes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Pagination */}
      <div className="flex flex-col-reverse gap-4 sm:flex-row items-center space-x-2 justify-between">
        <div className="flex items-center gap-2">
          <span>Row per pages:</span>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={handlePageSize}
          >
            <SelectTrigger className="border-black">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel></SelectLabel>
                <SelectItem value="5">5</SelectItem>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <span>
            Showing {startItem} - {endItem} of {totalCount}
          </span>
        </div>
        <div className="flex self-end gap-1">
          <Button
            variant="outline"
            onClick={() => gotoPage(1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            onClick={() => gotoPage(pagination.currentPage - 1)}
            disabled={pagination.currentPage === 1}
          >
            <ChevronLeft />
          </Button>
          <Button>{pagination.currentPage}</Button>
          <Button
            variant="outline"
            onClick={() => gotoPage(pagination.currentPage + 1)}
            disabled={pagination.currentPage >= totalPages}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            onClick={() => gotoPage(totalPages)}
            disabled={pagination.currentPage >= totalPages}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </>
  );
}
