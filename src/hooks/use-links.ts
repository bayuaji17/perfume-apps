import { httpClient } from "@/lib/http";
import { COLinkSchemeEditDetails, COLinkSchemeInput } from "@/lib/zod-scheme/perfume-scheme";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { z } from "zod";

type LinkResponse = {
  success: boolean;
  message: string;
};

export function useCreateLinks() {
  const queryClient = useQueryClient();
  return useMutation<LinkResponse, AxiosError, z.infer<typeof COLinkSchemeInput>>({
    mutationFn: async (data) => {
      const { data: response } = await httpClient.post("/linkcheckout", data);
      return response;
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["perfumes"],
      }),
  });
}

export function useEditLink() {
    const queryClient = useQueryClient();
    return useMutation<LinkResponse, AxiosError, z.infer<typeof COLinkSchemeEditDetails>>({
      mutationFn: async (data) => {
        const { data: response } = await httpClient.patch("/linkcheckout", data);
        return response;
      },
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: ["perfumes"],
        }),
    });
  }
  
  export function useDeleteLink() {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (id:string) => {
        const { data: response } = await httpClient.delete(`/linkcheckout/${id}`);
        return response;
      },
      onSettled: () =>
        queryClient.invalidateQueries({
          queryKey: ["perfumes"],
        }),
    });
  }