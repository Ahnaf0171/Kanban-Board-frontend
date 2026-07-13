import { api } from "@/lib/api";
import type { PaginatedResponse } from "@/types/common";
import type { Tag } from "@/types/task";

export const tagsService = {
  list: () => api.get<PaginatedResponse<Tag>>("/tags/"),
};
