import { api } from "@/lib/api";
import { LIST_FETCH_SIZE } from "@/lib/constants";
import type {
  Task,
  CreateTaskInput,
  UpdateTaskInput,
  ReorderTaskInput,
} from "@/types/task";
import type { PaginatedResponse } from "@/types/common";

export const tasksService = {
  list: (dueDate?: string) =>
    api.get<PaginatedResponse<Task>>("/tasks/", {
      due_date: dueDate,
      page_size: LIST_FETCH_SIZE,
    }),
  create: (data: CreateTaskInput) => api.post<Task>("/tasks/", data),
  update: (id: number, data: UpdateTaskInput) =>
    api.patch<Task>(`/tasks/${id}/`, data),
  reorder: (id: number, data: ReorderTaskInput) =>
    api.patch<Task>(`/tasks/${id}/reorder/`, data),
  remove: (id: number) => api.delete(`/tasks/${id}/`),
};
