"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { TaskCard } from "@/components/organisms/TaskCard";
import { TASK_STATUS, COLUMN_COLOR } from "@/lib/constants";
import { EmptyState } from "@/components/organisms/EmptyState";
import type { Task, TaskStatus } from "@/types/types";
import { cn } from "@/lib/utils";

export function Column({
  status,
  tasks,
  onTaskEdit,
}: {
  status: TaskStatus;
  tasks: Task[];
  onTaskEdit: (task: Task) => void;
}) {
  const { setNodeRef } = useDroppable({ id: status });
  const ids = tasks.map((t) => t.id);

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-full shrink-0 snap-start flex-col gap-3 rounded-lg p-3 sm:w-72",
        COLUMN_COLOR[status],
      )}
    >
      <p className="text-sm font-semibold">
        {TASK_STATUS[status]} · {tasks.length}
      </p>
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {tasks.length === 0 && <EmptyState message="No tasks" />}
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onEdit={onTaskEdit} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}
