import { api } from "@/lib/api";
import type {
  User,
  LoginRequest,
  RegisterRequest,
  AuthTokens,
} from "@/types/types";

export const authService = {
  register: (data: RegisterRequest) => api.post<User>("/auth/register/", data),
  login: (data: LoginRequest) => api.post<AuthTokens>("/auth/login/", data),
  me: () => api.get<User>("/auth/me/"),
};
