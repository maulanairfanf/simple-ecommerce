import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Enter your username."),
  password: z.string().min(8, "Password must contain at least 8 characters."),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
