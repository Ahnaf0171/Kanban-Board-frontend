import { api } from "@/lib/api";
import type { PaginatedResponse, Tag } from "@/types/types";

export const tagsService = {
  list: () => api.get<PaginatedResponse<Tag>>("/tags/"),
};
