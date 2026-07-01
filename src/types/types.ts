import { z } from "zod";
import {
  ApiProductResponseSchema,
  ApiProductSchema,
  ProductsViewModelSchema,
  UiProductSchema,
  type AuthStatusSchema,
  type LoginCredentialsSchema,
  type LoginResponseSchema,
  type TokensSchema,
  type UserSchema,
} from "./zod-schemas";

export type UserData = z.infer<typeof UserSchema>;

export type AuthStatusData = z.infer<typeof AuthStatusSchema>;

export type LoginResponseData = z.infer<typeof LoginResponseSchema>;

export type LoginCredentialsData = z.infer<typeof LoginCredentialsSchema>;

export type TokensData = z.infer<typeof TokensSchema>;

export type UiProduct = z.infer<typeof UiProductSchema>;

export type ApiProduct = z.infer<typeof ApiProductSchema>;

export type ApiProductResponse = z.infer<typeof ApiProductResponseSchema>;

export type ProductsViewModel = z.infer<typeof ProductsViewModelSchema>;
