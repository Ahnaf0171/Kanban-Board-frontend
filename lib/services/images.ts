import { api } from "@/lib/api";
import type {
  PaginatedResponse,
  ImageAsset,
  ReorderImageInput,
} from "@/types/types";

export const imagesService = {
  list: () => api.get<PaginatedResponse<ImageAsset>>("/images/"),
  retrieve: (id: number) => api.get<ImageAsset>(`/images/${id}/`),
  upload: (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return api.post<ImageAsset>("/images/", form);
  },
  reorder: (id: number, data: ReorderImageInput) =>
    api.patch<ImageAsset>(`/images/${id}/`, data),
  remove: (id: number) => api.delete(`/images/${id}/`),
};
