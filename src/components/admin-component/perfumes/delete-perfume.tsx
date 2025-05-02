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
import { useDeletePerfume } from "@/hooks/use-perfumes";
import { ErrorResponse, Perfumes } from "@/lib/types/inteface";
import { AxiosError } from "axios";

type DeletePerfume = {
  perfume: Perfumes | null;
  open: boolean;
  setOpen: (val: boolean) => void;
};

export default function DeletePerfume({
  perfume,
  open,
  setOpen,
}: DeletePerfume) {
  const { mutate } = useDeletePerfume();
  const handleDelete = () => {
    const loadingToast = toast.loading("Loading...");
    if (!perfume) return;
    mutate(perfume.id, {
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
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Delete Perfume</DialogTitle>
          <DialogDescription className="text-lg">
            Are you sure want to delete{" "}
            <strong className="text-red-500">{perfume?.name}</strong> ?
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
