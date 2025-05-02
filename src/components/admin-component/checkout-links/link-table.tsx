"use client";

import { useState } from "react";
import {
  ChevronsUpDown,
  Check,
  Trash,
  Pen,
  CircleAlert,
  Plus,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDebounce from "@/hooks/use-debounce";
import { usePerfumes, usePerfumesById } from "@/hooks/use-perfumes";
import { Perfumes } from "@/lib/types/inteface";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CheckoutTable() {
  const [search, setSearch] = useState("");
  const [selectedPerfumeId, setSelectedPerfumeId] = useState<string | null>(
    null
  );

  const debounceSearch = useDebounce(search, 300);

  const { data: dataPerfumes, isLoading: isPerfumesLoading } = usePerfumes({
    page: 1,
    pageSize: 10,
    search: debounceSearch,
  });

  const perfumes = dataPerfumes?.data.data || [];
  const selectedPerfume = perfumes.find(
    (p: Perfumes) => p.id === selectedPerfumeId
  );
  const { data: dataPerfumeById, isLoading: isPerfumeDetailLoading } =
    usePerfumesById(selectedPerfumeId);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Checkout Table</h1>
      <div className="flex gap-2">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-1/2 justify-between",
                !selectedPerfumeId && "text-muted-foreground"
              )}
            >
              {selectedPerfume ? selectedPerfume.name : "Select Perfume"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 w-[var(--radix-popover-trigger-width)]"
            align="start"
          >
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search Perfumes"
                value={search}
                onValueChange={setSearch}
              />
              <CommandList>
                {isPerfumesLoading && (
                  <span className="text-sm px-4 py-2">Loading...</span>
                )}
                <CommandEmpty className={isPerfumesLoading ? "hidden" : "p-2"}>
                  No Perfume Found.
                </CommandEmpty>
                <CommandGroup>
                  {perfumes.map((perfume: Perfumes) => (
                    <CommandItem
                      key={perfume.id}
                      value={perfume.id}
                      onSelect={() => {
                        setSelectedPerfumeId(perfume.id);
                      }}
                    >
                      {perfume.name}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          selectedPerfumeId === perfume.id
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Button className="w-40">Add Link</Button>
      </div>
      {isPerfumeDetailLoading ? (
        <div className="flex justify-center items-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : selectedPerfume ? (
        (dataPerfumeById?.checkoutLinks?.length ?? 0) > 0 ? (
          <div className="rounded-lg overflow-hidden border-1 my-2 border-black">
            <Table>
              <TableHeader className="bg-gray-100">
                <TableRow className="border-b-2 border-black">
                  <TableHead className="pl-10">Platform</TableHead>
                  <TableHead>Link</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dataPerfumeById?.checkoutLinks.map((c) => (
                  <TableRow key={c.id} className="border-black">
                    <TableCell className="capitalize pl-10">{c.type}</TableCell>
                    <TableCell>
                      <a
                        href={c.link}
                        className="hover:underline truncate text-blue-700"
                      >
                        {c.link}
                      </a>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={cn(
                          "p-2 capitalize rounded-2xl text-white font-semibold",
                          c.status === "active" ? "bg-green-500" : "bg-red-700"
                        )}
                      >
                        {c.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button variant="outline">
                          <Pen />
                        </Button>
                        <Button variant="destructive">
                          <Trash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8">
            <CircleAlert className="mx-auto h-12 w-12" />
            <h3 className="mt-2 text-lg font-semibold">
              No checkout links found
            </h3>
            <p className="text-muted-foreground">
              This perfume doesn&apos;t have any checkout links yet.
            </p>
            <Button className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Checkout Link
            </Button>
          </div>
        )
      ) : (
        <div className="text-center py-8">
          <CircleAlert className="mx-auto h-12 w-12" />
          <h3 className="mt-2 text-lg font-semibold">No perfume selected</h3>
          <p className="text-gray-600">
            Please select a perfume to manage its checkout links.
          </p>
        </div>
      )}
    </div>
  );
}
