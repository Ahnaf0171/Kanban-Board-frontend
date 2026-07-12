import { useMutation, useQueryClient } from "@tanstack/react-query";
import { annotationsService } from "@/lib/services/annotations";
import type {
  CreateAnnotationInput,
  UpdateAnnotationInput,
} from "@/types/types";

export function useAnnotations(imageId: number) {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["images", imageId] });

  const create = useMutation({
    mutationFn: (data: CreateAnnotationInput) =>
      annotationsService.create(data),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAnnotationInput }) =>
      annotationsService.update(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) => annotationsService.remove(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
