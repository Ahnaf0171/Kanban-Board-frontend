export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ApiErrorResponse {
  success: false;
  error: {
    message: string;
    details?: Record<string, string>;
  };
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Tag {
  id: number;
  name: string;
  color: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  order: number;
  tags_display: Tag[];
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string;
  tags?: string[];
}

export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface ReorderTaskInput {
  status: TaskStatus;
  order: number;
}

export interface ImageAsset {
  id: number;
  file: string; 
  order: number;
  uploaded_by: number;
  uploaded_at: string;
  annotations: Annotation[];
}

export interface ReorderImageInput {
  order: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface Annotation {
  id: number;
  image: number;
  points: Point[];
  label: string;
  color: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface CreateAnnotationInput {
  image: number;
  points: Point[];
  label: string;
  color: string;
}

export interface UpdateAnnotationInput {
  label?: string;
  points?: Point[];
  color?: string;
}
