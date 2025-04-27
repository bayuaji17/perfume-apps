import { httpClient } from "@/lib/http";
import { brandScheme } from "@/lib/zod-scheme/perfume-scheme";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { z } from "zod";

type Params = {
  page: number;
  pageSize: number;
  search?: string;
};
type BrandResponse = {
  data: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
  message: string;
  success: boolean;
};
type EditBrandInput = {
  id: string;
  data: z.infer<typeof brandScheme>;
};
export function useBrands({ page, pageSize, search }: Params) {
  return useQuery({
    queryKey: ["brands", page, pageSize, search],
    queryFn: async () => {
      const response = httpClient.get(
        `/brands?page=${page}&limit=${pageSize}&search=${search}`
      );
      return response;
    },
  });
}
export function useCreateBrand() {
  const queryClient = useQueryClient();
  return useMutation<
    BrandResponse,
    AxiosError,
    z.infer<typeof brandScheme>
  >({
    mutationFn: async (data) => {
      const { data: response } = await httpClient.post("/brands", data);
      return response;
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["brands"],
      }),
  });
}

export function useEditBrand() {
  const queryClient = useQueryClient();
  return useMutation<BrandResponse, AxiosError, EditBrandInput>({
    mutationFn: async ({ id, data }) => {
      const { data: response } = await httpClient.put(`/brands/${id}`, data);
      return response;
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["brands"],
      }),
  });
}
export function useDeleteBrand() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id:string) => {
      const { data: response } = await httpClient.delete(`/brands/${id}`);
      return response;
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["brands"],
      }),
  });
}
