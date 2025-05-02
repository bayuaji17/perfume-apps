"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as z from "zod";
import { formScheme } from "@/lib/zod-scheme/perfume-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { categoryPerfumes, cn, gender } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import useDebounce from "@/hooks/use-debounce";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConcentrationType, GenderCategory } from "@prisma/client";
import { ImageUploader } from "./image-uploader";
import { useEditPerfume, usePerfumesById } from "@/hooks/use-perfumes";
import { useBrands } from "@/hooks/use-brands";
import { Brands, ErrorResponse } from "@/lib/types/inteface";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function EditPerfume({ id }: { id: string }) {
  const [search, setSearch] = useState<string>("");
  const [images, setImages] = useState<(File | { preview: string })[]>([]);
  const form = useForm<z.infer<typeof formScheme>>({
    resolver: zodResolver(formScheme),
    defaultValues: {
      name: "",
      description: "",
      brandId: "",
      concentration: "edt" as ConcentrationType,
      gender: "unisex" as GenderCategory,
      sizeML: 0,
      price: 0,
      notes: [
        { role: "top", description: "" },
        { role: "middle", description: "" },
        { role: "base", description: "" },
      ],
    },
  });
  const debounceSearch = useDebounce(search, 300);
  const { data: perfumeDataById } = usePerfumesById(id);
  console.log(perfumeDataById, "perfumeData");
  const { data: brandData, isLoading: isBrandLoading } = useBrands({
    page: 1,
    pageSize: 10,
    search: debounceSearch,
  });
  const brands = brandData?.data.data || [];
  const { mutate } = useEditPerfume();

  const onSubmit = (data: z.infer<typeof formScheme>) => {
    const loadingToast = toast.loading("loading...");
    const imageFiles = images.filter((img): img is File => img instanceof File);

    if (!perfumeDataById?.id) return;

    mutate({
      id: perfumeDataById.id,
      values: {
        ...data,
        sizeML: Number(data.sizeML),
        price: Number(data.price), 
      },
      images: imageFiles,
    },{
      
              onSuccess: (response) => {
                toast.dismiss(loadingToast);
                console.log(response,"response")
                toast.success(response.message);
      
              },
              onError: (error) => {
                toast.dismiss(loadingToast);
                const axiosError = error as AxiosError<ErrorResponse>;
                const errorMessage = axiosError.response?.data?.error;
                toast.error(errorMessage);
              }
            
    });
  };
  useEffect(() => {
    if (perfumeDataById) {
      form.reset({
        name: perfumeDataById.name || "",
        description: perfumeDataById.description || "",
        brandId: perfumeDataById.brandId || "",
        concentration: perfumeDataById.concentration || "",
        gender: perfumeDataById.gender || "",
        sizeML: Number(perfumeDataById.sizeML),
        price: Number(perfumeDataById.price),
        notes: (["top", "middle", "base"] as const).map((role) => ({
          role,
          description:
            perfumeDataById.notes?.find((note) => note.role === role)
              ?.description || "",
        })),
      });
    }
    const hasImages =
      perfumeDataById?.images && perfumeDataById.images.length > 0;

    if (hasImages) {
      const previewImages = perfumeDataById!.images.map((img) => ({
        name: img.imageUrl.split("/").pop() || "image",
        type: "image/jpeg",
        preview: img.imageUrl,
        originUrl: img.imageUrl,
      }));
      setImages(previewImages as (File | { preview: string })[]);
    }
  }, [perfumeDataById, form]);

  return (
    <div>
      <Card className="w-full p-4">
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Perfume name */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="sm:w-1/2">
                    <FormLabel className="after:content-['*'] after:text-red-500">
                      Perfume Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Perfume Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Brand */}
              <FormField
                control={form.control}
                name="brandId"
                render={({ field }) => (
                  <FormItem className="flex flex-col sm:w-1/2">
                    <FormLabel className="after:content-['*'] after:text-red-500">
                      Brand
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
                              ? brands?.find(
                                  (brand:Brands) => brand.id === field.value
                                )?.name
                              : "Select Brand"}
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
                            {isBrandLoading && (
                              <span className="text-sm px-4 py-2">
                                Loading...
                              </span>
                            )}
                            <CommandEmpty
                              className={isBrandLoading ? "hidden" : ""}
                            >
                              No Brand Found.
                            </CommandEmpty>
                            <CommandGroup>
                              {brands?.map((brand:Brands) => (
                                <CommandItem
                                  value={brand.id}
                                  key={brand.id}
                                  onSelect={() => {
                                    form.setValue("brandId", brand.id);
                                  }}
                                >
                                  {brand.name}
                                  <Check
                                    className={cn(
                                      "ml-auto",
                                      field.value === brand.id
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
            </div>
            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="after:content-['*'] after:text-red-500">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Tell us about this perfume"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Concentration / Category */}
              <FormField
                control={form.control}
                name="concentration"
                render={({ field }) => (
                  <FormItem className="sm:w-1/2">
                    <FormLabel className="after:content-['*'] after:text-red-500">
                      Category Perfume
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a concentration perfume" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categoryPerfumes.map((data) => (
                          <SelectItem value={data.id} key={data.id}>
                            {data.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="sm:w-1/2">
                    <FormLabel className="after:content-['*'] after:text-red-500">
                      Gender
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select gender perfume type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {gender.map((data) => (
                          <SelectItem value={data.gender} key={data.gender}>
                            {data.gender}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Price */}
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="sm:w-1/2">
                    <FormLabel className="after:content-['*'] after:text-red-500">
                      Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        min={1}
                        type="number"
                        placeholder="Tell us about this perfume"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* sizeML */}
              <FormField
                control={form.control}
                name="sizeML"
                render={({ field }) => (
                  <FormItem className="sm:w-1/2">
                    <FormLabel className="after:content-['*'] after:text-red-500">
                      Size ML
                    </FormLabel>
                    <FormControl>
                      <Input
                        min={1}
                        type="number"
                        placeholder="Tell us about this perfume"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {/* Notes */}
            <div className="space-y-2">
              <FormLabel className="border-b-2 border-black">Notes</FormLabel>
              {["TOP", "MIDDLE", "BASE"].map((role, index) => (
                <FormField
                  key={role}
                  control={form.control}
                  name={`notes.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{role} Note</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={`Enter ${role.toLowerCase()} note with good story telling`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>
            {/* Images Upload */}
            <ImageUploader images={images} setImages={setImages} />
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}
