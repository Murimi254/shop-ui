import { z } from "zod";
import type { AuthStatusSchema, LoginCredentialsSchema, UserSchema } from "./zod-schemas";

export type UserData = z.infer<typeof UserSchema>;

export type AuthStatusData = z.infer<typeof AuthStatusSchema>;

export type LoginResponseData = z.infer<typeof LoginCredentialsSchema>;

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
