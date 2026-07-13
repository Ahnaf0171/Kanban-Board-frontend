"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Select } from "@/components/atoms/Select";
import { TASK_STATUS_ORDER, TASK_PRIORITY } from "@/lib/constants";
import { getErrorMessage } from "@/lib/utils";
import type { Task } from "@/types/task";
import { todayISODate } from "@/lib/utils";

export function TaskModal({
  task,
  onClose,
}: {
  task: Task | null;
  onClose: () => void;
}) {
  const { selectedDate } = useTaskUIStore();
  const { create, update } = useTasks(selectedDate);
  const schema = task ? taskEditSchema : taskCreateSchema;
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(schema),
    defaultValues: task ?? {
      status: "todo",
      priority: "medium",
      due_date: selectedDate ?? todayISODate(),
    },
  });

  const onSubmit = async (formValues: TaskFormValues) => {
    setServerError("");

    const data = {
      ...formValues,
      description: formValues.description ?? undefined,
      tags: formValues.tags ?? undefined,
    };

    try {
      task
        ? await update.mutateAsync({ id: task.id, data })
        : await create.mutateAsync(data);
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          label="Title"
          {...register("title")}
          error={errors.title?.message}
        />
        <FormField
          label="Due date"
          type="date"
          min={task ? undefined : todayISODate()}
          {...register("due_date")}
          error={errors.due_date?.message}
        />

        <div className="grid grid-cols-2 gap-3">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={TASK_STATUS_ORDER.map((s) => ({
                  value: s,
                  label: s,
                }))}
                error={errors.status?.message}
              />
            )}
          />
          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                options={Object.keys(TASK_PRIORITY).map((p) => ({
                  value: p,
                  label: p,
                }))}
                error={errors.priority?.message}
              />
            )}
          />
        </div>

        {serverError && (
          <p className="text-sm text-destructive">{serverError}</p>
        )}

        <div className="flex justify-end pt-2">
          <Button type="submit" disabled={isSubmitting}>
            {task ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
