import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { tasksService } from "@/lib/services/tasks";
import type { PaginatedResponse } from "@/types/common";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  ReorderTaskInput,
  Task,
} from "@/types/task";

export function useTasks(dueDate?: string | null) {
  const queryClient = useQueryClient();
  const key = ["tasks", dueDate ?? "all"] as const;

  const query = useQuery({
    queryKey: key,
    queryFn: () => tasksService.list(dueDate ?? undefined),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["tasks"], refetchType: "all" });

  const create = useMutation({
    mutationFn: (data: CreateTaskInput) => tasksService.create(data),
    onSuccess: (newTask) => {
      queryClient.setQueryData<PaginatedResponse<Task>>(key, (old) =>
        old
          ? { ...old, results: [...old.results, newTask], count: old.count + 1 }
          : old,
      );
      invalidate();
    },
  });

  const update = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateTaskInput }) =>
      tasksService.update(id, data),
    onSuccess: invalidate,
  });

  const reorder = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ReorderTaskInput }) =>
      tasksService.reorder(id, data),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: number) => tasksService.remove(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<PaginatedResponse<Task>>(key, (old) =>
        old
          ? {
              ...old,
              results: old.results.filter((t) => t.id !== id),
              count: old.count - 1,
            }
          : old,
      );
      invalidate();
    },
  });

  return { ...query, create, update, reorder, remove };
}
