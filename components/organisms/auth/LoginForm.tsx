"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { loginAction } from "@/lib/actions/auth";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";

export function LoginForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginFormValues) => {
    setServerError("");
    const { error } = await loginAction(data);
    if (error) return setServerError(error);
    router.replace("/tasks");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        label="Email"
        type="email"
        {...register("email")}
        error={errors.email?.message}
      />
      <FormField
        label="Password"
        type="password"
        {...register("password")}
        error={errors.password?.message}
      />
      {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? <Spinner className="size-4" /> : "Log in"}
      </Button>
    </form>
  );
}
