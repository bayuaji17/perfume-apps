"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import useDebounce from "@/hooks/use-debounce";
import { usePerfumes } from "@/hooks/use-perfumes";
import { Perfumes } from "@/lib/types/inteface";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function AddLink() {
  const [search, setSearch] = useState<string>("");
  const form = useForm({
    defaultValues: {
      perfumeId: "",
    },
  });
  const debounceSearch = useDebounce(search, 300);
  const { data: dataAllPerfumes, isLoading: isPerfumeLoading } = usePerfumes({
    page: 1,
    pageSize: 10,
    search: debounceSearch,
  });
  const perfumes = dataAllPerfumes?.data.data || [];

  return (
    <Card>
      <CardHeader>Add link Checkout Perfumes</CardHeader>
      <CardContent>
        <Form {...form}>
            {/* Perfumes Id */}
          <FormField
            control={form.control}
            name="perfumeId"
            render={({ field }) => (
              <FormItem className="flex flex-col sm:w-1/2">
                <FormLabel className="after:content-['*'] after:text-red-500">
                  Perfumes
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? perfumes?.find(
                              (perfume: Perfumes) => perfume.id === field.value
                            )?.name
                          : "Select Perfume"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent
                    className="p-0 w-[var(--radix-popover-trigger-width)]"
                    align="start"
                  >
                    <Command shouldFilter={false}>
                      <CommandInput
                        placeholder="Search Brand"
                        value={search}
                        onValueChange={setSearch}
                      />
                      <CommandList>
                        {isPerfumeLoading && (
                          <span className="text-sm px-4 py-2">Loading...</span>
                        )}
                        <CommandEmpty
                          className={isPerfumeLoading ? "hidden" : ""}
                        >
                          No Perfume Found.
                        </CommandEmpty>
                        <CommandGroup>
                          {perfumes?.map((perfume: Perfumes) => (
                            <CommandItem
                              value={perfume.id}
                              key={perfume.id}
                              onSelect={() => {
                                form.setValue("perfumeId", perfume.id);
                              }}
                            >
                              {perfume.name}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  field.value === perfume.id
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
                <FormMessage />
              </FormItem>
            )}
          />
        </Form>
      </CardContent>
    </Card>
  );
}
