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
