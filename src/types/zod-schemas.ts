import { z } from "zod";

const IdSchema = z.uuid();
const JwtSchema = z.jwt();

export const UserRoleSchema = z.enum(["superAdmin", "admin", "customer"]);

export const UserSchema = z.object({
  _id: IdSchema,
  fullName: z.string(),
  email: z.email(),
  role: UserRoleSchema,
});

export const AuthStatusSchema = z.enum(["idle", "loading", "authenticated", "error"]);

export const TokensSchema = z.object({
  accessToken: JwtSchema,
  refreshToken: JwtSchema,
});

export const LoginResponseSchema = z.object({
  user: UserSchema,
  accessToken: JwtSchema,
  refreshToken: JwtSchema,
});

export const LoginCredentialsSchema = z.object({
  email: z.email("Invalid Email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export const SignupCredentialsSchema = LoginCredentialsSchema.extend({
  fullName: z.string().min(2, "Full name must be at least 2 characters."),
});

export const SignupResponseSchema = UserSchema.extend({
  accessToken: JwtSchema,
  refreshToken: JwtSchema,
})
  .passthrough()
  .transform(({ accessToken, refreshToken, ...user }) => ({
    user: UserSchema.parse(user),
    accessToken,
    refreshToken,
  }));

export const RefreshResponseSchema = TokensSchema;
export const RestoreSessionResponseSchema = LoginResponseSchema;

export const ApiProductSchema = z.object({
  _id: IdSchema,
  name: z.string(),
  description: z.string(),
  quantity: z.number().nonnegative(),
  price: z.number().positive(),
  category: z.string(),
  imageUrl: z.url(),
  adminId: IdSchema.optional(),
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
  totalPages: z.number().nonnegative().optional(),
  currentPage: z.number().nonnegative().optional(),
  productsCount: z.number().nonnegative(),
  returnedProducts: z.number().nonnegative(),
  message: z.string().optional(),
});

export const ProductsViewModelSchema = z.object({
  products: z.array(UiProductSchema),
  pagination: z
    .object({
      totalPages: z.number().nonnegative().optional(),
      currentPage: z.number().nonnegative().optional(),
      productsCount: z.number().nonnegative(),
      returnedProducts: z.number().nonnegative(),
      message: z.string().optional(),
    })
    .optional(),
  sections: z.object({
    flashSale: z.array(UiProductSchema),
    bestSelling: z.array(UiProductSchema),
    explore: z.array(UiProductSchema),
  }),
});

export const CategoriesResponseSchema = z.array(z.string());

export const CartItemRequestSchema = z.object({
  productId: IdSchema,
  quantity: z.number().int().positive(),
});

export const CartPreviewRequestSchema = z.object({
  items: z.array(CartItemRequestSchema),
});

export const CartPreviewItemSchema = z.object({
  productId: IdSchema,
  name: z.string(),
  price: z.number().nonnegative(),
  quantity: z.number().int().positive(),
  lineTotal: z.number().nonnegative(),
});

export const CartPreviewResponseSchema = z.object({
  items: z.array(CartPreviewItemSchema),
  subtotal: z.number().nonnegative(),
  shippingCost: z.number().nonnegative(),
  total: z.number().nonnegative(),
});

export const ShipmentRequestSchema = z.object({
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  postalCode: z.string().min(1),
});

export const EditShipmentRequestSchema = ShipmentRequestSchema.extend({
  _id: IdSchema,
});

export const ShipmentResponseSchema = ShipmentRequestSchema.extend({
  _id: IdSchema,
  userId: IdSchema,
  fullName: z.string(),
});

export const PaymentMethodSchema = z.enum(["MPESA", "CASH"]);
export const OrderStatusSchema = z.enum(["PENDING", "CANCELLED", "PAID"]);
export const PaymentStatusSchema = z.enum(["PENDING", "SUCCESS", "FAILED"]);

export const CreateOrderRequestSchema = z.object({
  items: z.array(CartItemRequestSchema),
  paymentMethod: PaymentMethodSchema,
});

export const OrderItemResponseSchema = z.object({
  _id: IdSchema,
  orderId: IdSchema,
  productName: z.string(),
  purchasePrice: z.number().positive(),
  productId: IdSchema,
  quantity: z.number().int().positive(),
});

export const CreateOrderResponseSchema = z.object({
  orderId: IdSchema,
  totalAmount: z.number().nonnegative(),
  customerId: IdSchema,
  fullName: z.string(),
  items: z.array(OrderItemResponseSchema),
  shippingCost: z.number().nonnegative(),
  orderStatus: OrderStatusSchema,
  paymentStatus: PaymentStatusSchema,
  paymentMethod: PaymentMethodSchema,
  shipmentId: IdSchema,
});

export const OrderSummarySchema = z.object({
  _id: IdSchema,
  totalAmount: z.number().nonnegative(),
  paymentStatus: PaymentStatusSchema,
  paymentMethod: PaymentMethodSchema,
  customerId: IdSchema,
  customerEmail: z.email(),
  shippingCost: z.number().nonnegative(),
  subTotal: z.number().nonnegative(),
  fullName: z.string(),
  orderStatus: OrderStatusSchema,
});

export const AdminOrdersResponseSchema = z.object({
  orders: z.array(OrderSummarySchema),
  message: z.string().optional(),
});

export const OrderStatusResponseSchema = z.object({
  orderId: IdSchema,
  orderStatus: OrderStatusSchema,
  paymentStatus: PaymentStatusSchema,
  customerId: IdSchema,
});

export const CancelOrderRequestSchema = z.object({
  orderId: IdSchema,
});

export const ApproveCashPaymentRequestSchema = z.object({
  orderId: IdSchema,
});

export const STKPushRequestSchema = z.object({
  orderId: IdSchema,
  phoneNumber: z.string().trim().min(10).max(13),
});

export const STKPushResponseSchema = z.object({
  merchantRequestId: z.string(),
  checkoutRequestId: z.string(),
  responseCode: z.string(),
  responseDescription: z.string(),
  customerMessage: z.string(),
  message: z.string(),
});

export const ProductCreateRequestSchema = z.object({
  file: z.custom<File>(),
  name: z.string().min(1),
  description: z.string().min(5),
  price: z.coerce.number().positive().int(),
  quantity: z.coerce.number().positive().int(),
  category: z.string().min(1),
});

export const ProductEditRequestSchema = ProductCreateRequestSchema.extend({
  _id: IdSchema,
  file: z.custom<File>().optional(),
});

export const DeleteModelRequestSchema = z.object({
  modelId: IdSchema,
});

export const CategoryCreateRequestSchema = z.object({
  name: z.string().min(1),
});

export const CategoryEditRequestSchema = CategoryCreateRequestSchema.extend({
  _id: IdSchema,
});

export const CategoryResponseSchema = z.object({
  _id: IdSchema,
  name: z.string(),
  adminId: IdSchema,
});

export const MessageResponseSchema = z.object({
  message: z.string(),
});

export const MarketingEmailRequestSchema = z.object({
  email: z.email(),
});

export const MarketingEmailResponseSchema = MessageResponseSchema;
