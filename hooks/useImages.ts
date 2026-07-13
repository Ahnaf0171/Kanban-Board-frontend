import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { imagesService } from "@/lib/services/images";
import type { ReorderImageInput } from "@/types/annotation";

export function useImages() {
  const queryClient = useQueryClient();
  const key = ["images"] as const;

  const query = useQuery({ queryKey: key, queryFn: imagesService.list });

  const invalidate = () => queryClient.invalidateQueries({ queryKey: key });

  const upload = useMutation({
    mutationFn: (file: File) => imagesService.upload(file),
    onSuccess: invalidate,
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
    enabled: id !== null,
  });
}
