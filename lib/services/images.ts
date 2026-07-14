// lib/services/images.ts
import { api } from "@/lib/api";
import { LIST_FETCH_SIZE } from "@/lib/constants";
import type { ImageAsset, ReorderImageInput } from "@/types/annotation";
import type { PaginatedResponse } from "@/types/common";

export const imagesService = {
  list: () =>
    api.get<PaginatedResponse<ImageAsset>>("/images/", {
      page_size: LIST_FETCH_SIZE,
    }),
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
