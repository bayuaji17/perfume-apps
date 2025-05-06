"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCreateLinks } from "@/hooks/use-links";
import { ErrorResponse } from "@/lib/types/inteface";
import { COLinkSchemeInput } from "@/lib/zod-scheme/perfume-scheme";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type AddLink = {
  perfumeId: string | null;
  open: boolean;
  setOpen: (val: boolean) => void;
};

const allPlatforms = [
  "whatsapp",
  "shopee",
  "tokopedia",
  "lazada",
  "tiktok",
] as const;
export default function AddLink({ perfumeId, open, setOpen }: AddLink) {
  const form = useForm<z.infer<typeof COLinkSchemeInput>>({
    resolver: zodResolver(COLinkSchemeInput),
    defaultValues: {
      perfumeId: perfumeId ?? "",
      links: [{ platform: "whatsapp", link: "" }],
    },
  });

  useEffect(() => {
    if (perfumeId) {
      form.setValue("perfumeId", perfumeId);
    }
  }, [perfumeId, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "links",
  });

  const selectedPlatforms = fields.map((f) => f.platform);
  const availablePlatforms = useMemo(
    () => allPlatforms.filter((p) => !selectedPlatforms.includes(p)),
    [selectedPlatforms]
  );
  const { mutate } = useCreateLinks();

  const onSubmit = (data: z.infer<typeof COLinkSchemeInput>) => {
    const loadingToast = toast.loading("Loading...");
    mutate(data, {
      onSuccess: (response) => {
        toast.dismiss(loadingToast);
        toast.success(response.message);
        setOpen(false);
        form.reset({
          perfumeId:form.getValues("perfumeId")
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Checkout Link</DialogTitle>
          <DialogDescription>
            Checkout Link can&apos;t be duplicate. Please ensure that each
            platform has a unique link and all required fields are filled out
            correctly before saving.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2.5">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-start gap-3 border rounded-2xl p-4 shadow-sm bg-white"
              >
                <div className="w-full">
                  <FormField
                    control={form.control}
                    name={`links.${index}.link`}
                    render={({ field: linkField }) => (
                      <FormItem>
                        <FormLabel className="capitalize text-sm font-medium">
                          {field.platform}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={`https://www.${field.platform}.com/example`}
                            {...linkField}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="mt-7 text-red-500 hover:text-red-700"
                  onClick={() => remove(index)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            ))}

            <div className="flex flex-wrap gap-2">
              {availablePlatforms.map((platform) => (
                <Button
                  key={platform}
                  type="button"
                  variant="outline"
                  onClick={() => append({ platform, link: "" })}
                  disabled={fields.length >= 5}
                  className="capitalize text-sm"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  {platform}
                </Button>
              ))}
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                variant="destructive"
                type="button"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
{
  /* <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {fields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`links.${index}.link`}
                render={({ field: linkField }) => (
                  <FormItem className="mt-2">
                    <FormLabel className="capitalize">
                      {field.platform}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={`Enter ${field.platform} link`}
                        {...linkField}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}

            <div className="flex flex-wrap gap-2 mt-2">
              {availablePlatforms.map((platform) => (
                <Button
                  key={platform}
                  type="button"
                  variant="outline"
                  onClick={() => append({ platform, link: "" })}
                  disabled={fields.length >= 5}
                >
                  Add {platform}
                </Button>
              ))}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                type="button"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form> */
}
