import { api } from "@/lib/api";
import type {
  Annotation,
  CreateAnnotationInput,
  UpdateAnnotationInput,
} from "@/types/annotation";

export const annotationsService = {
  create: (data: CreateAnnotationInput) =>
    api.post<Annotation>("/annotations/", data),
  update: (id: number, data: UpdateAnnotationInput) =>
    api.patch<Annotation>(`/annotations/${id}/`, data),
  remove: (id: number) => api.delete(`/annotations/${id}/`),
};
