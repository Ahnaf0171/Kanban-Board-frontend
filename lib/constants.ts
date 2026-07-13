import type { TaskPriority, TaskStatus } from "@/types/task";

export const TASK_STATUS: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

export const TASK_STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "done"];

export const TASK_PRIORITY: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const PRIORITY_COLOR: Record<TaskPriority, string> = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

export const TASK_CARD_COLOR: Record<TaskStatus, string> = {
  todo: "bg-[#E1F5FE]",
  in_progress: "bg-[#FFF9C4]",
  done: "bg-[#C8E6C9]",
};

export const COLUMN_COLOR: Record<TaskStatus, string> = {
  todo: "bg-blue-50",
  in_progress: "bg-amber-100",
  done: "bg-green-50",
};

export const MIN_POLYGON_POINTS = 3;

export const DEFAULT_ANNOTATION_COLOR = "#FF0000";

export const DEFAULT_PAGE_SIZE = 20;
