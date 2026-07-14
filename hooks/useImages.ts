import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { imagesService } from "@/lib/services/images";
import type { ImageAsset, ReorderImageInput } from "@/types/annotation";
import type { PaginatedResponse } from "@/types/common";

let tempId = -1;

export function useImages() {
  const queryClient = useQueryClient();
  const key = ["images"] as const;

  const query = useQuery({
    queryKey: key,
    queryFn: imagesService.list,
    enabled: typeof window !== "undefined",
  });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const upload = useMutation({
    mutationFn: (file: File) => imagesService.upload(file),
    onMutate: async (file) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous =
        queryClient.getQueryData<PaginatedResponse<ImageAsset>>(key);

      const placeholder: ImageAsset = {
        id: tempId--,
        file: URL.createObjectURL(file),
        order: previous?.results.length ?? 0,
        uploaded_by: 0,
        uploaded_at: new Date().toISOString(),
        annotations: [],
      };

      queryClient.setQueryData<PaginatedResponse<ImageAsset>>(key, (old) =>
        old
          ? {
              ...old,
              results: [...old.results, placeholder],
              count: old.count + 1,
            }
          : { count: 1, next: null, previous: null, results: [placeholder] },
      );

      return { previous, objectUrl: placeholder.file };
    },
    onError: (_err, _file, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: (_data, _err, _file, context) => {
      if (context?.objectUrl) URL.revokeObjectURL(context.objectUrl);
      invalidate();
    },
  });

  const reorder = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReorderImageInput }) =>
      imagesService.reorder(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) => imagesService.remove(id),
    onSuccess: invalidate,
  });

  return { ...query, upload, reorder, remove };
}

export function useImage(id: number | null) {
  return useQuery({
    queryKey: ["images", id],
    queryFn: () => imagesService.retrieve(id as number),
    enabled: id !== null && typeof window !== "undefined",
  });
}
