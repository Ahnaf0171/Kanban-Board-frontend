"use client";

import { useState } from "react";
import { useForm, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  taskCreateSchema,
  taskEditSchema,
  type TaskFormValues,
} from "@/lib/validations";
import { useTasks } from "@/hooks/useTasks";
import { useTaskUIStore } from "@/store/taskUIStore";
import { Modal } from "@/components/molecules/Modal";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { TASK_STATUS_ORDER, TASK_PRIORITY } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import type { Task } from "@/types/types";
import { todayISODate } from "@/lib/utils";

export function TaskModal({
  task,
  onClose,
}: {
  task: Task | null;
  onClose: () => void;
}) {
  const { selectedDate } = useTaskUIStore();
  const { create, update, remove } = useTasks(selectedDate);
  const schema = task ? taskEditSchema : taskCreateSchema;
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: task ?? {
      status: "todo",
      priority: "medium",
      due_date: selectedDate ?? todayISODate(),
    },
  });

  const onSubmit = async (data: TaskFormValues) => {
    setServerError("");
    try {
      task
        ? await update.mutateAsync({ id: task.id, data })
        : await create.mutateAsync(data);
      onClose();
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  const onInvalid = (formErrors: FieldErrors<TaskFormValues>) => {
    console.log("Validation failed:", formErrors);
    const message = Object.values(formErrors)
      .map((e) => e?.message)
      .filter(Boolean)
      .join(", ");
    setServerError(message || "Please check the form fields");
  };

  const handleDelete = async () => {
    if (!task) return;
    try {
      await remove.mutateAsync(task.id);
      onClose();
    } catch (err) {
      setServerError(getErrorMessage(err));
    }
  };

  return (
    <Modal
      open
      onOpenChange={onClose}
      title={task ? "Edit task" : "New task"}
      dismissible={false}
    >
      <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
        <FormField
          label="Title"
          {...register("title")}
          error={errors.title?.message}
        />
        <FormField
          label="Due date"
          type="date"
          {...register("due_date")}
          error={errors.due_date?.message}
        />

        <div className="grid grid-cols-2 gap-3">
          <select
            {...register("status")}
            className="rounded-md border bg-background p-2 text-sm"
          >
            {TASK_STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <select
            {...register("priority")}
            className="rounded-md border bg-background p-2 text-sm"
          >
            {Object.keys(TASK_PRIORITY).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <div className="flex justify-between pt-2">
          {task && (
            <Button type="button" variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting} className="ml-auto">
            {task ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
