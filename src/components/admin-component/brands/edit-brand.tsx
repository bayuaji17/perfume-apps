"use client";
import { useEffect} from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { brandScheme } from "@/lib/zod-scheme/perfume-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Brands, ErrorResponse } from "@/lib/types/inteface";
import { useEditBrand } from "@/hooks/use-brands";
import { AxiosError } from "axios";

type EditBrand = {
  brand: Brands | null;
  open: boolean;
  setOpen: (val: boolean) => void;
};

export default function EditBrand({ brand, open, setOpen }: EditBrand) {
  const form = useForm<z.infer<typeof brandScheme>>({
    resolver: zodResolver(brandScheme),
    defaultValues: {
      name: "",
    },
  });
  useEffect(() => {
    if (open && brand) {
      form.reset({ name: brand.name });
    }
  }, [open, brand, form]);

  const { mutate } = useEditBrand();

  const onSubmit = async (data: z.infer<typeof brandScheme>) => {
    const loadingToast = toast.loading("Loading...");
    if (!brand) return;
    mutate(
      { id: brand.id, data },
      {
        onSuccess: (response) => {
          toast.dismiss(loadingToast);
          toast.success(response.message);
          setOpen(false);
          form.reset();
        },
        onError: (error) => {
          toast.dismiss(loadingToast);
          const axiosError = error as AxiosError<ErrorResponse>;
          const errorMessage = axiosError.response?.data?.error;
          toast.error(errorMessage);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Brand</DialogTitle>
          <DialogDescription>Edit Brand Name</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Add new brand name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-2 mt-2.5 justify-end">
                <DialogClose asChild>
                  <Button type="button" variant="destructive">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">Save</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
