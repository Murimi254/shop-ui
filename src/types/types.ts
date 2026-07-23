import { z } from "zod";
import {
  AdminOrdersResponseSchema,
  AdminCategoriesResponseSchema,
  ApiProductResponseSchema,
  ApiProductSchema,
  ApproveCashPaymentRequestSchema,
  CancelOrderRequestSchema,
  CartItemRequestSchema,
  CartPreviewRequestSchema,
  CartPreviewResponseSchema,
  CategoriesResponseSchema,
  CategoryCreateRequestSchema,
  CategoryEditRequestSchema,
  CategoryResponseSchema,
  CreateOrderRequestSchema,
  CreateOrderResponseSchema,
  DeleteModelRequestSchema,
  EditShipmentRequestSchema,
  LoginCredentialsSchema,
  LoginResponseSchema,
  MarketingEmailRequestSchema,
  MarketingEmailResponseSchema,
  MessageResponseSchema,
  OrderStatusResponseSchema,
  OrderSummarySchema,
  ProductCreateRequestSchema,
  ProductEditRequestSchema,
  ProductsViewModelSchema,
  RefreshResponseSchema,
  RestoreSessionResponseSchema,
  ShipmentRequestSchema,
  ShipmentResponseSchema,
  SignupCredentialsSchema,
  SignupResponseSchema,
  STKPushRequestSchema,
  STKPushResponseSchema,
  TokensSchema,
  UiProductSchema,
  UserRoleSchema,
  UserSchema,
} from "./zod-schemas";

export type UserRoleData = z.infer<typeof UserRoleSchema>;
export type UserData = z.infer<typeof UserSchema>;

export type LoginResponseData = z.infer<typeof LoginResponseSchema>;
export type LoginCredentialsData = z.infer<typeof LoginCredentialsSchema>;
export type SignupCredentialsData = z.infer<typeof SignupCredentialsSchema>;
export type SignupResponseData = z.infer<typeof SignupResponseSchema>;
export type TokensData = z.infer<typeof TokensSchema>;
export type RefreshResponseData = z.infer<typeof RefreshResponseSchema>;
export type RestoreSessionResponseData = z.infer<typeof RestoreSessionResponseSchema>;

export type UiProduct = z.infer<typeof UiProductSchema>;
export type ApiProduct = z.infer<typeof ApiProductSchema>;
export type ApiProductResponse = z.infer<typeof ApiProductResponseSchema>;
export type ProductsViewModel = z.infer<typeof ProductsViewModelSchema>;

export type CategoriesResponseData = z.infer<typeof CategoriesResponseSchema>;
export type AdminCategoriesResponseData = z.infer<typeof AdminCategoriesResponseSchema>;
export type CartItemRequestData = z.infer<typeof CartItemRequestSchema>;
export type CartPreviewRequestData = z.infer<typeof CartPreviewRequestSchema>;
export type CartPreviewResponseData = z.infer<typeof CartPreviewResponseSchema>;

export type ShipmentRequestData = z.infer<typeof ShipmentRequestSchema>;
export type EditShipmentRequestData = z.infer<typeof EditShipmentRequestSchema>;
export type ShipmentResponseData = z.infer<typeof ShipmentResponseSchema>;

export type CreateOrderRequestData = z.infer<typeof CreateOrderRequestSchema>;
export type CreateOrderResponseData = z.infer<typeof CreateOrderResponseSchema>;
export type OrderSummaryData = z.infer<typeof OrderSummarySchema>;
export type AdminOrdersResponseData = z.infer<typeof AdminOrdersResponseSchema>;
export type CancelOrderRequestData = z.infer<typeof CancelOrderRequestSchema>;
export type OrderStatusResponseData = z.infer<typeof OrderStatusResponseSchema>;
export type ApproveCashPaymentRequestData = z.infer<typeof ApproveCashPaymentRequestSchema>;

export type STKPushRequestData = z.infer<typeof STKPushRequestSchema>;
export type STKPushResponseData = z.infer<typeof STKPushResponseSchema>;

export type ProductCreateRequestData = z.infer<typeof ProductCreateRequestSchema>;
export type ProductEditRequestData = z.infer<typeof ProductEditRequestSchema>;
export type DeleteModelRequestData = z.infer<typeof DeleteModelRequestSchema>;

export type CategoryCreateRequestData = z.infer<typeof CategoryCreateRequestSchema>;
export type CategoryEditRequestData = z.infer<typeof CategoryEditRequestSchema>;
export type CategoryResponseData = z.infer<typeof CategoryResponseSchema>;

export type MessageResponseData = z.infer<typeof MessageResponseSchema>;
export type MarketingEmailRequestData = z.infer<typeof MarketingEmailRequestSchema>;
export type MarketingEmailResponseData = z.infer<typeof MarketingEmailResponseSchema>;
