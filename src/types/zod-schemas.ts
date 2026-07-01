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

export const ApiProductSchema = z.object({
  _id: z.uuid(),
  name: z.string(),
  description: z.string(),
  quantity: z.number().nonnegative(),
  price: z.number().positive(),
  category: z.string(),
  imageUrl: z.url(),
});

export const UiProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  originalPrice: z.number().optional(),
  discount: z.number().optional(),
  rating: z.number(),
  reviews: z.number(),
  image: z.string(),
  images: z.array(z.string()).optional(),
  category: z.string(),
  badge: z.string().optional().default("NEW"),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  description: z.string().optional(),
  inStock: z.boolean().optional(),
  isNew: z.boolean().optional(),
});

export const ApiProductResponseSchema = z.object({
  products: z.array(ApiProductSchema),
  totalPages: z.number().nonnegative(),
  currentPage: z.number().nonnegative(),
  productsCount: z.number().nonnegative(),
  returnedProducts: z.number().nonnegative(),
});

export const ProductsViewModelSchema = z.object({
  products: z.array(UiProductSchema),
  sections: z.object({
    flashSale: z.array(UiProductSchema),
    bestSelling: z.array(UiProductSchema),
    explore: z.array(UiProductSchema),
  }),
});
