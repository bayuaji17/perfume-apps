"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Brands, ErrorResponse } from "@/lib/types/inteface";
import { useDeleteBrand } from "@/hooks/use-brands";
import { AxiosError } from "axios";

type DeleteBrand = {
  brand: Brands | null;
  open: boolean;
  setOpen: (val: boolean) => void;
};

export default function DeleteBrand({ brand, open, setOpen }: DeleteBrand) {
  const { mutate } = useDeleteBrand();

  const handleDelete = () => {
    const loadingToast = toast.loading("Loading...");
    if (!brand) return;
    mutate(brand.id, {
      onSuccess: (response) => {
        toast.dismiss(loadingToast);
        toast.success(response.message);
        setOpen(false);
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
          <DialogTitle>Delete Brand</DialogTitle>
          <DialogDescription>
            Are you sure want to delete <strong>{brand?.name}</strong>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex gap-2 mt-2.5 justify-end">
            <DialogClose asChild>
              <Button type="button" variant="destructive">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
