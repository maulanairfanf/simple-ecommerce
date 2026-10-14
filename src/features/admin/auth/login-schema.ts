import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z.string().email("Enter a valid work email."),
  password: z.string().min(8, "Password must contain at least 8 characters."),
});

export type AdminLoginValues = z.infer<typeof adminLoginSchema>;
