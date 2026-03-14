import { z } from "zod";

export const userSchema = z.object({
  fullName: z.string(),
  email: z.email(),
  password: z.string(),
});
