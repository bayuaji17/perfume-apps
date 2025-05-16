import { httpClient, httpFormClient } from "@/lib/http";
import { Perfumes } from "@/lib/types/inteface";
import { formScheme } from "@/lib/zod-scheme/perfume-scheme";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError, AxiosResponse } from "axios";
import { z } from "zod";
type Params = {
  page: number;
  pageSize: number;
  search?: string;
};
type CreatePerfumeResponse = {
  message: string;
  perfume: Perfumes;
};
type CreatePerfumeInput = {
  values: z.infer<typeof formScheme>;
  images: File[];
  id?: string;
};
export function usePerfumes({ page, pageSize, search }: Params) {
  return useQuery({
    queryKey: ["perfumes", page, pageSize, search],
    queryFn: async () => {
      const response = await httpClient.get(
        `/perfumes?page=${page}&limit=${pageSize}&search=${search}`
      );
      return response;
    },
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
    gcTime: 10 * 60,
  });
}

export function useCreatePerfume() {
  const queryClient = useQueryClient();
  return useMutation<CreatePerfumeResponse, AxiosError, CreatePerfumeInput>({
    mutationFn: async ({ values, images }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("concentration", values.concentration);
      formData.append("sizeML", values.sizeML.toString());
      formData.append("price", values.price.toString());
      formData.append("brandId", values.brandId);
      formData.append("gender", values.gender);
      formData.append("notes", JSON.stringify(values.notes));
      for (const image of images) {
        formData.append("images", image);
      }
      const { data: response } = await httpFormClient.post(
        "/perfumes",
        formData
      );
      return response;
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["perfumes"],
      }),
  });
}

export function usePerfumesById(id: string | null) {
  return useQuery<Perfumes>({
    queryKey: ["perfumes", id],
    queryFn: async () => {
      const response: AxiosResponse<Perfumes> = await httpClient.get(
        `/perfumes/${id}`
      );
      return response.data;
    },
    enabled: !!id,
  });
}

export function useEditPerfume() {
  const queryClient = useQueryClient();
  return useMutation<CreatePerfumeResponse, AxiosError, CreatePerfumeInput>({
    mutationFn: async ({ values, images, id }) => {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("concentration", values.concentration);
      formData.append("sizeML", values.sizeML.toString());
      formData.append("price", values.price.toString());
      formData.append("brandId", values.brandId);
      formData.append("gender", values.gender);
      formData.append("notes", JSON.stringify(values.notes));
      for (const image of images) {
        formData.append("images", image);
      }
      const { data: response } = await httpFormClient.patch(
        `/perfumes/${id}`,
        formData
      );
      return response;
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["perfumes"],
      }),
  });
}

export function useDeletePerfume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { data: response } = await httpClient.delete(`/perfumes/${id}`);
      return response;
    },
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ["perfumes"],
      }),
  });
}
