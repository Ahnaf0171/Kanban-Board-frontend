"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/lib/validations";
import { registerAction } from "@/lib/actions/auth";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";

export function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError("");
    const { error } = await registerAction(data);
    if (error) return setServerError(error);
    router.push("/tasks");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <FormField
          label="First name"
          {...register("first_name")}
          error={errors.first_name?.message}
        />
        <FormField
          label="Last name"
          {...register("last_name")}
          error={errors.last_name?.message}
        />
      </div>
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
        {isSubmitting ? <Spinner className="size-4" /> : "Create account"}
      </Button>
    </form>
  );
}
