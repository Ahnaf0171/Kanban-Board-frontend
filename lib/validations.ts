import { z } from "zod";
import { isPastDate } from "@/lib/utils";
import { MIN_POLYGON_POINTS } from "@/lib/constants";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

const baseTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(120),
  description: z.string().max(1000).nullable().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  due_date: z.string().min(1, "Due date is required"),
  tags: z.array(z.string()).nullable().optional(),
});

export const taskCreateSchema = baseTaskSchema.refine(
  (data) => !isPastDate(data.due_date),
  {
    message: "Due date cannot be in the past",
    path: ["due_date"],
  },
);

export const taskEditSchema = baseTaskSchema;

export type TaskFormValues = z.infer<typeof baseTaskSchema>;

const pointSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const annotationFormSchema = z.object({
  image: z.number(),
  points: z
    .array(pointSchema)
    .min(
      MIN_POLYGON_POINTS,
      `A polygon needs at least ${MIN_POLYGON_POINTS} points`,
    ),
  label: z.string().min(1, "Label is required").max(60),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Color must be a hex code"),
});

export type AnnotationFormValues = z.infer<typeof annotationFormSchema>;

export const registerSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(5, "Password must be at least 5 characters"),
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;
