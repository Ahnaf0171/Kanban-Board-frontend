import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { imagesService } from "@/lib/services/images";
import type { ImageAsset, ReorderImageInput } from "@/types/annotation";
import { PaginatedResponse } from "@/types/common";

let tempIdCounter = 0;

export function useImages() {
  const queryClient = useQueryClient();
  const key = ["images"] as const;

  const query = useQuery({ queryKey: key, queryFn: imagesService.list });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const upload = useMutation({
    mutationFn: (file: File) => imagesService.upload(file),
    onMutate: async (file: File) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData(key);
      const tempId = -++tempIdCounter;

      queryClient.setQueryData(key, (old: any) => {
        if (!old) return old;
        const tempImage = {
          id: tempId,
          file: URL.createObjectURL(file),
        } as ImageAsset;
        return { ...old, results: [...old.results, tempImage] };
      });

      return { previous, tempId };
    },
    onSuccess: (data, _file, context) => {
      queryClient.setQueryData(key, (old: any) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((img: ImageAsset) =>
            img.id === context?.tempId ? data : img,
          ),
        };
      });
    },
    onError: (_err, _file, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
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

export function useImage(id: number) {
  const queryClient = useQueryClient();
  return useSuspenseQuery({
    queryKey: ["images", id],
    queryFn: () => imagesService.retrieve(id),
    initialData: () =>
      queryClient
        .getQueryData<PaginatedResponse<ImageAsset>>(["images"])
        ?.results.find((img) => img.id === id),
  });
}
