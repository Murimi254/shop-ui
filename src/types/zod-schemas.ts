import { z } from "zod";

export const UserSchema = z.object({
  _id: z.uuid(),
  fullName: z.string(),
  email: z.email(),
  role: z.string(),
});

export const AuthStatusSchema = z.enum(["idle", "loading", "authenticated", "error"]);

export const TokensSchema = z.object({
  accessToken: z.uuid(),
  refreshToken: z.uuid(),
});

export const LoginResponseSchema = z.object({
  user: UserSchema,
  accessToken: z.uuid(),
  refreshToken: z.uuid(),
});

export const LoginCredentialsSchema = z.object({
  email: z.email("Invalid Email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});
