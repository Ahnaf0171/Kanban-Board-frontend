"use client";

import { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { Plus } from "lucide-react";
import { Column } from "@/components/organisms/task/Column";
import { TaskModal } from "@/components/organisms/task/TaskModal";
import { TaskCard } from "@/components/organisms/task/TaskCard";
import { useTasks } from "@/hooks/useTasks";
import { useTaskUIStore } from "@/store/taskUIStore";
import { TASK_STATUS_ORDER } from "@/lib/constants";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import type { Task, TaskStatus } from "@/types/task";

export function Board() {
  const { selectedDate } = useTaskUIStore();
  const { data, isLoading, reorder } = useTasks(selectedDate);
  const [editingTask, setEditingTask] = useState<Task | null | undefined>(
    undefined,
  );
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const tasks = data?.results ?? [];
  const byStatus = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status).sort((a, b) => a.order - b.order);

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveTask(tasks.find((t) => t.id === active.id) ?? null);
  };

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null);
    if (!over) return;
    const task = tasks.find((t) => t.id === active.id);
    if (!task) return;

    const targetStatus = (
      TASK_STATUS_ORDER.includes(over.id as TaskStatus)
        ? over.id
        : tasks.find((t) => t.id === over.id)?.status
    ) as TaskStatus | undefined;
    if (!targetStatus) return;

    const siblings = byStatus(targetStatus).filter((t) => t.id !== task.id);
    const overIndex = siblings.findIndex((t) => t.id === over.id);
    const order = overIndex === -1 ? siblings.length : overIndex;

    reorder.mutate({ id: task.id, data: { status: targetStatus, order } });
  };

  if (isLoading)
    return (
      <div className="flex justify-center p-10">
        <Spinner />
      </div>
    );

  return (
    <>
      <div className="flex justify-start pb-2">
        <Button size="lg" onClick={() => setEditingTask(null)}>
          <Plus className=" size-4" />
          Create Task
        </Button>
      </div>

      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex flex-col gap-4 overflow-x-auto snap-x sm:flex-row">
          {TASK_STATUS_ORDER.map((status) => (
            <Column
              key={status}
              status={status}
              tasks={byStatus(status)}
              onTaskEdit={setEditingTask}
            />
          ))}
        </div>
        <DragOverlay>
          {activeTask && (
            <TaskCard task={activeTask} onEdit={() => {}} overlay />
          )}
        </DragOverlay>
      </DndContext>

      {editingTask !== undefined && (
        <TaskModal
          task={editingTask}
          onClose={() => setEditingTask(undefined)}
        />
      )}
    </>
  );
}
