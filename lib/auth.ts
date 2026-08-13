import { z } from "zod";

export const loginSchema = z.object({
  email: z.email({ error: "올바른 이메일을 입력하세요." }),
  password: z.string().min(6, { error: "6자 이상 입력하세요." }),
});
export type LoginFormValues = z.infer<typeof loginSchema>;
