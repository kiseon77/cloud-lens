"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input"; // 사용 중인 UI 컴포넌트 경로
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { loginSchema, type LoginFormValues } from "@/lib/auth";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    const { error } = await supabase.auth.signInWithPassword(values);
    if (error) {
      setError("root", {
        message: "이메일 또는 비밀번호가 올바르지 않습니다.",
      });
      return;
    }
    router.replace("/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="email">이메일</label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && <p role="alert">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password">비밀번호</label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && <p role="alert">{errors.password.message}</p>}
      </div>
      {errors.root && <p role="alert">{errors.root.message}</p>}
      <div>
        {process.env.NODE_ENV === "development" && (
          <p className="text-xs text-muted-foreground">
            (개발용) admin@admin.com admin1234
          </p>
        )}
        <Button type="submit" disabled={isSubmitting}>
          로그인
        </Button>
      </div>
    </form>
  );
}
