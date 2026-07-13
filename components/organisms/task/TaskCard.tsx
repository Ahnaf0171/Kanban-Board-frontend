"use client";

import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/atoms/Badge";
import { ConfirmDialog } from "@/components/molecules/ConfirmDialog";
import { TASK_CARD_COLOR, PRIORITY_COLOR } from "@/lib/constants";
import { formatDate, cn } from "@/lib/utils";
import { useTasks } from "@/hooks/useTasks";
import { useTaskUIStore } from "@/store/taskUIStore";
import type { Task } from "@/types/task";

export function TaskCard({
  task,
  onEdit,
  overlay = false,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  overlay?: boolean;
}) {
  const { selectedDate } = useTaskUIStore();
  const { remove } = useTasks(selectedDate);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
  });

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        {...attributes}
        {...listeners}
        className={cn(
          "group cursor-grab space-y-2 rounded-lg border border-transparent p-3 shadow-sm active:cursor-grabbing",
          TASK_CARD_COLOR[task.status],
          isDragging && "opacity-30",
        )}
      >
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium">{task.title}</p>
          <div className="flex shrink-0 gap-1">
            <button
              onPointerDownCapture={(e) => e.stopPropagation()}
              onClick={() => onEdit(task)}
              aria-label="Edit task"
              className="rounded p-1 hover:bg-black/5"
            >
              <Pencil className="size-3.5" />
            </button>
            <button
              onPointerDownCapture={(e) => e.stopPropagation()}
              onClick={() => setConfirmOpen(true)}
              aria-label="Delete task"
              className="rounded p-1 hover:bg-black/5"
            >
              <Trash2 className="size-3.5 text-destructive" />
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <Badge className={PRIORITY_COLOR[task.priority]}>
            {task.priority}
          </Badge>
          {task.tags_display.map((tag) => (
            <Badge key={tag.id} style={{ backgroundColor: tag.color }}>
              {tag.name}
            </Badge>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {formatDate(task.due_date)}
        </p>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete task?"
        description={task.title}
        variant="destructive"
        isLoading={remove.isPending}
        onConfirm={() =>
          remove.mutate(task.id, { onSuccess: () => setConfirmOpen(false) })
        }
      />
    </>
  );
}
