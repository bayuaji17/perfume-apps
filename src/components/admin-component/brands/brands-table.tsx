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
  Pen,
  Search,
  Trash,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useBrands } from "@/hooks/use-brands";
import useDebounce from "@/hooks/use-debounce";
import { Button } from "@/components/ui/button";
import TableLoading from "../table-skeleton";
import { Brands, Params } from "@/lib/types/inteface";
import AddBrand from "./add-brand";
import EditBrand from "./edit-brand";
import DeleteBrand from "./delete-brand";

export default function Brand() {
  const [params, setParams] = useState<Params>({
    currentPage: 1,
    pageSize: 5,
    search: "",
  });
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<Brands | null>(null);
  const [editDialog, setEditDialog] = useState<boolean>(false);
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  const debounce = useDebounce(searchInput, 400);
  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      search: debounce,
      currentPage: 1,
    }));
  }, [debounce]);
  const { data, isLoading } = useBrands({
    page: params.currentPage,
    pageSize: params.pageSize,
    search: params.search,
  });

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

  const brands = data?.data.data || [];
  const totalCount = data?.data.total || (0 as number);
  const totalPages = data?.data.totalPages || (0 as number);

  const startItem = (params.currentPage - 1) * params.pageSize + 1;
  const endItem = Math.min(params.currentPage * params.pageSize, totalCount);

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
        <AddBrand openDialog={<Button>Add Brand</Button>} />
        <EditBrand
          brand={selectedBrand}
          open={editDialog}
          setOpen={setEditDialog}
        />
        <DeleteBrand
          brand={selectedBrand}
          open={deleteDialog}
          setOpen={setDeleteDialog}
        />
      </div>
      <div className="rounded-lg overflow-hidden border-1 my-2 border-black">
        <Table>
          <TableHeader className="bg-gray-100 h-11">
            <TableRow className="border-b-2 border-black">
              <TableHead className="text-center">No</TableHead>
              <TableHead>Id Brand</TableHead>
              <TableHead>Brand Name</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableLoading rowCount={10} columnCount={4} />
            ) : brands.length > 0 ? (
              brands.map((brand: Brands, index: number) => (
                <TableRow key={brand.id} className="border-black">
                  <TableCell className="h-14 text-center">
                    {(params.currentPage - 1) * params.pageSize + index + 1}
                  </TableCell>
                  <TableCell>{brand.id}</TableCell>
                  <TableCell>{brand.name}</TableCell>
                  <TableCell>
                    <span className="flex items-center justify-center space-x-2">
                      <Button
                        variant={"outline"}
                        onClick={() => {
                          setSelectedBrand(brand);
                          setEditDialog(true);
                        }}
                      >
                        <Pen />
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setSelectedBrand(brand);
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
                  No brands found
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
            value={params.pageSize.toString()}
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
            disabled={params.currentPage === 1}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            onClick={() => gotoPage(params.currentPage - 1)}
            disabled={params.currentPage === 1}
          >
            <ChevronLeft />
          </Button>
          <Button>{params.currentPage}</Button>
          <Button
            variant="outline"
            onClick={() => gotoPage(params.currentPage + 1)}
            disabled={params.currentPage >= totalPages}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            onClick={() => gotoPage(totalPages)}
            disabled={params.currentPage >= totalPages}
          >
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </>
  );
}
