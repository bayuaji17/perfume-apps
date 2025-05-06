"use client";
import { useEffect } from "react";
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
import { COLinkSchemeEditDetails } from "@/lib/zod-scheme/perfume-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckoutLink, ErrorResponse } from "@/lib/types/inteface";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEditLink } from "@/hooks/use-links";
import { toast } from "sonner";
import { AxiosError } from "axios";

type EditLink = {
  perfumeId?: string | null;
  checkoutLink: CheckoutLink | null;
  open: boolean;
  setOpen: (val: boolean) => void;
};

export default function EditLink({ checkoutLink, open, setOpen }: EditLink) {
  const form = useForm<z.infer<typeof COLinkSchemeEditDetails>>({
    resolver: zodResolver(COLinkSchemeEditDetails),
  });

  useEffect(() => {
    if (open && checkoutLink) {
      form.reset({
        perfumeId: checkoutLink.perfumeId,
        id: checkoutLink.id,
        link: checkoutLink.link,
        status: checkoutLink.status,
      });
    }
  }, [open, checkoutLink, form]);
  const { mutate } = useEditLink();
  const onSubmit = (data: z.infer<typeof COLinkSchemeEditDetails>) => {
    const loadingToast = toast.loading("Loading...");
    mutate(data, {
      onSuccess: (response) => {
        toast.dismiss(loadingToast);
        toast.success(response.message);
        setOpen(false);
        form.reset({
          perfumeId: form.getValues("perfumeId"),
        });
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Link</DialogTitle>
          <DialogDescription>Edit url and status link</DialogDescription>
        </DialogHeader>
        <div className="py-4 my-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform Link</FormLabel>
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a verified email to display" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">active</SelectItem>
                        <SelectItem value="archive">archive</SelectItem>
                      </SelectContent>
                    </Select>
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
