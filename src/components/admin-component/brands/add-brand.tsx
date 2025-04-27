"use client";
import { ReactNode, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useCreateBrand } from "@/hooks/use-brands";
import { AxiosError } from "axios";
import { ErrorResponse } from "@/lib/types/inteface";
import { toast } from "sonner";

export default function AddBrand({ openDialog }: { openDialog: ReactNode }) {
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof brandScheme>>({
    resolver: zodResolver(brandScheme),
    defaultValues: {
      name: "",
    },
  });

  const { mutate } = useCreateBrand();

  const onSubmit = async (data: z.infer<typeof brandScheme>) => {
    const loadingToast = toast.loading("Loading...");
    mutate(data, {
      onSuccess: (response) => {
        toast.dismiss(loadingToast);
        toast.success(response.message);
        setOpen(false);
        form.reset()
      },
      onError: (error) => {
        toast.dismiss(loadingToast);
        const axiosError = error as AxiosError<ErrorResponse>;
        const errorMessage = axiosError.response?.data?.error;
        toast.error(errorMessage);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{openDialog}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Brand</DialogTitle>
          <DialogDescription>Add new brand perfume</DialogDescription>
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
                    Close
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
