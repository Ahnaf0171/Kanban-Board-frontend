import { useQuery } from "@tanstack/react-query";
import { tagsService } from "@/lib/services/tags";

export function useTags() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: tagsService.list,
    staleTime: 5 * 60_000,
    enabled: typeof window !== "undefined",
  });
}
