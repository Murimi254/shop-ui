import { z } from "zod";
import type { AuthStatusSchema, LoginCredentialsSchema, LoginResponseSchema, TokensSchema, UserSchema } from "./zod-schemas";

export type UserData = z.infer<typeof UserSchema>;

export type AuthStatusData = z.infer<typeof AuthStatusSchema>;

export type LoginResponseData = z.infer<typeof LoginResponseSchema>;

export type LoginCredentialsData = z.infer<typeof LoginCredentialsSchema>;

export type TokensData = z.infer<typeof TokensSchema>;
