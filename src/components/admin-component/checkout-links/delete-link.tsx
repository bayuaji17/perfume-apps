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
import { CheckoutLink, ErrorResponse } from "@/lib/types/inteface";
import { AxiosError } from "axios";
import { useDeleteLink } from "@/hooks/use-links";

type DeleteLink = {
  coLink: CheckoutLink | null;
  open: boolean;
  setOpen: (val: boolean) => void;
};

export default function DeleteLink({ coLink, open, setOpen }: DeleteLink) {
  const { mutate } = useDeleteLink();

  const handleDelete = () => {
    const loadingToast = toast.loading("Loading...");
    if (!coLink) return;
    mutate(coLink.id, {
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
          <DialogTitle>Delete Link Platform</DialogTitle>
          <DialogDescription>
            Are you sure want to delete <strong>{coLink?.platform}</strong> link ?
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
