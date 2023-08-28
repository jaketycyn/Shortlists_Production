import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(4).max(12),
});

export const registerSchema = loginSchema.extend({
  name: z.string(),
});

export type LoginSchema = z.TypeOf<typeof loginSchema>;
export type RegisterSchema = z.TypeOf<typeof registerSchema>;
