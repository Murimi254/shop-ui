import { baseQueryWithReauth } from "@/api/base-query-with-reauth";
import { login, logout as clearAuth, setAccessToken, setInitialized } from "@/store/slices/authSlice";
import type {
  AdminOrdersResponseData,
  ApiProduct,
  ApproveCashPaymentRequestData,
  CancelOrderRequestData,
  CartPreviewRequestData,
  CartPreviewResponseData,
  CategoriesResponseData,
  CategoryCreateRequestData,
  CategoryEditRequestData,
  CategoryResponseData,
  CreateOrderRequestData,
  CreateOrderResponseData,
  DeleteModelRequestData,
  EditShipmentRequestData,
  LoginCredentialsData,
  LoginResponseData,
  MarketingEmailResponseData,
  MessageResponseData,
  OrderStatusResponseData,
  OrderSummaryData,
  ProductCreateRequestData,
  ProductEditRequestData,
  ProductsViewModel,
  ShipmentRequestData,
  ShipmentResponseData,
  SignupCredentialsData,
  STKPushRequestData,
  STKPushResponseData,
  TokensData,
} from "@/types/types";
import {
  AdminOrdersResponseSchema,
  ApiProductResponseSchema,
  ApiProductSchema,
  ApproveCashPaymentRequestSchema,
  CancelOrderRequestSchema,
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
  RestoreSessionResponseSchema,
  ShipmentRequestSchema,
  ShipmentResponseSchema,
  SignupCredentialsSchema,
  SignupResponseSchema,
  STKPushRequestSchema,
  STKPushResponseSchema,
  TokensSchema,
} from "@/types/zod-schemas";
import { tokenStorage } from "@/utils/token-storage";
import { toUiProducts } from "@/utils/utility-functions";
import { createApi } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Products", "Categories", "Orders", "Shipment"],
  keepUnusedDataFor: 60,
  endpoints: builder => ({
    signup: builder.mutation<LoginResponseData, SignupCredentialsData>({
      query: credentials => ({ url: "/signup", method: "POST", body: SignupCredentialsSchema.parse(credentials) }),
      transformResponse: response => SignupResponseSchema.parse(response),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(login({ user: data.user, accessToken: data.accessToken }));
          tokenStorage.setRefreshToken(data.refreshToken);
        } catch {
          // RTK Query exposes the rejected request state to components.
        }
      },
    }),

    login: builder.mutation<LoginResponseData, LoginCredentialsData>({
      query: credentials => ({ url: "/login", method: "POST", body: LoginCredentialsSchema.parse(credentials) }),
      transformResponse: response => LoginResponseSchema.parse(response),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(login({ user: data.user, accessToken: data.accessToken }));
          tokenStorage.setRefreshToken(data.refreshToken);
        } catch {
          // RTK Query exposes the rejected request state to components.
        }
      },
    }),

    logout: builder.mutation<{ message?: string }, void>({
      query: () => ({ url: "/logout", method: "POST" }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          await queryFulfilled;
        } catch {
          // Local logout is authoritative for the UI.
        } finally {
          dispatch(clearAuth());
          tokenStorage.clearRefreshToken();
        }
      },
    }),

    refreshToken: builder.mutation<TokensData, void>({
      query: () => ({ url: "/refresh", method: "POST", body: { refreshToken: tokenStorage.getRefreshToken() } }),
      transformResponse: response => TokensSchema.parse(response),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAccessToken(data.accessToken));
          tokenStorage.setRefreshToken(data.refreshToken);
        } catch {
          dispatch(clearAuth());
          tokenStorage.clearRefreshToken();
        }
      },
    }),

    initializeAuth: builder.query<LoginResponseData, void>({
      query: () => {
        const refreshToken = tokenStorage.getRefreshToken();
        return {
          url: "/restore-session",
          method: "GET",
          headers: refreshToken ? { Authorization: `Bearer ${refreshToken}` } : undefined,
        };
      },
      transformResponse: response => RestoreSessionResponseSchema.parse(response),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(login({ user: data.user, accessToken: data.accessToken }));
          tokenStorage.setRefreshToken(data.refreshToken);
        } catch {
          tokenStorage.clearRefreshToken();
        } finally {
          dispatch(setInitialized());
        }
      },
    }),

    getCategories: builder.query<CategoriesResponseData, void>({
      query: () => ({ url: "/categories", method: "GET" }),
      transformResponse: response => CategoriesResponseSchema.parse(response),
      providesTags: ["Categories"],
    }),

    getProducts: builder.query<ProductsViewModel, { limit?: number; search?: string; page?: number }>({
      query: params => ({ url: "/products", method: "GET", params }),
      providesTags: ["Products"],
      transformResponse: (response: unknown): ProductsViewModel => {
        const validatedResponse = ApiProductResponseSchema.parse(response);
        const products = validatedResponse.products.map((product, index) => toUiProducts(product, index));
        return {
          products,
          pagination: {
            totalPages: validatedResponse.totalPages,
            currentPage: validatedResponse.currentPage,
            productsCount: validatedResponse.productsCount,
            returnedProducts: validatedResponse.returnedProducts,
            message: validatedResponse.message,
          },
          sections: {
            flashSale: products.filter(product => product.discount).slice(0, 8),
            bestSelling: products.slice(8, 16),
            explore: products.slice(16, 26),
          },
        };
      },
    }),

    getProduct: builder.query<ApiProduct, string>({
      query: productId => ({ url: `/product/${productId}`, method: "GET" }),
      transformResponse: response => ApiProductSchema.parse(response),
      providesTags: (_result, _error, productId) => [{ type: "Products", id: productId }],
    }),

    cartPreview: builder.mutation<CartPreviewResponseData, CartPreviewRequestData>({
      query: cart => ({ url: "/cart-preview", method: "POST", body: CartPreviewRequestSchema.parse(cart) }),
      transformResponse: response => CartPreviewResponseSchema.parse(response),
    }),

    createShipment: builder.mutation<ShipmentResponseData, ShipmentRequestData>({
      query: shipment => ({ url: "/shipment", method: "POST", body: ShipmentRequestSchema.parse(shipment) }),
      transformResponse: response => ShipmentResponseSchema.parse(response),
      invalidatesTags: ["Shipment"],
    }),

    editShipment: builder.mutation<ShipmentResponseData, EditShipmentRequestData>({
      query: shipment => ({ url: "/edit-shipment", method: "POST", body: EditShipmentRequestSchema.parse(shipment) }),
      transformResponse: response => ShipmentResponseSchema.parse(response),
      invalidatesTags: ["Shipment"],
    }),

    createOrder: builder.mutation<CreateOrderResponseData, CreateOrderRequestData>({
      query: order => ({ url: "/order", method: "POST", body: CreateOrderRequestSchema.parse(order) }),
      transformResponse: response => CreateOrderResponseSchema.parse(response),
      invalidatesTags: ["Orders"],
    }),

    getOrder: builder.query<OrderSummaryData, string>({
      query: orderId => ({ url: `/order/${orderId}`, method: "GET" }),
      transformResponse: response => OrderSummarySchema.parse(response),
      providesTags: (_result, _error, orderId) => [{ type: "Orders", id: orderId }],
    }),

    cancelOrder: builder.mutation<OrderStatusResponseData, CancelOrderRequestData>({
      query: data => ({ url: "/cancel-order", method: "POST", body: CancelOrderRequestSchema.parse(data) }),
      transformResponse: response => OrderStatusResponseSchema.parse(response),
      invalidatesTags: ["Orders"],
    }),

    getAdminOrders: builder.query<AdminOrdersResponseData, void>({
      query: () => ({ url: "/orders", method: "GET" }),
      transformResponse: response => AdminOrdersResponseSchema.parse(response),
      providesTags: ["Orders"],
    }),

    approveCashPayment: builder.mutation<OrderStatusResponseData, ApproveCashPaymentRequestData>({
      query: data => ({ url: "/approve-cash-payment", method: "POST", body: ApproveCashPaymentRequestSchema.parse(data) }),
      transformResponse: response => OrderStatusResponseSchema.parse(response),
      invalidatesTags: ["Orders"],
    }),

    initiateSTKPush: builder.mutation<STKPushResponseData, STKPushRequestData>({
      query: data => ({ url: "/stkpush", method: "POST", body: STKPushRequestSchema.parse(data) }),
      transformResponse: response => STKPushResponseSchema.parse(response),
    }),

    createProduct: builder.mutation<ApiProduct, ProductCreateRequestData>({
      query: product => ({ url: "/product", method: "POST", body: productRequestToFormData(ProductCreateRequestSchema.parse(product)) }),
      transformResponse: response => ApiProductSchema.parse(response),
      invalidatesTags: ["Products"],
    }),

    editProduct: builder.mutation<ApiProduct, ProductEditRequestData>({
      query: product => ({ url: "/edit-product", method: "POST", body: productRequestToFormData(ProductEditRequestSchema.parse(product)) }),
      transformResponse: response => ApiProductSchema.parse(response),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation<MessageResponseData, DeleteModelRequestData>({
      query: data => ({ url: "/delete-product", method: "POST", body: DeleteModelRequestSchema.parse(data) }),
      transformResponse: response => MessageResponseSchema.parse(response),
      invalidatesTags: ["Products"],
    }),

    createCategory: builder.mutation<CategoryResponseData, CategoryCreateRequestData>({
      query: category => ({ url: "/category", method: "POST", body: CategoryCreateRequestSchema.parse(category) }),
      transformResponse: response => CategoryResponseSchema.parse(response),
      invalidatesTags: ["Categories"],
    }),

    editCategory: builder.mutation<CategoryResponseData, CategoryEditRequestData>({
      query: category => ({ url: "/edit-category", method: "POST", body: CategoryEditRequestSchema.parse(category) }),
      transformResponse: response => CategoryResponseSchema.parse(response),
      invalidatesTags: ["Categories"],
    }),

    deleteCategory: builder.mutation<MessageResponseData, DeleteModelRequestData>({
      query: data => ({ url: "/delete-category", method: "POST", body: DeleteModelRequestSchema.parse(data) }),
      transformResponse: response => MessageResponseSchema.parse(response),
      invalidatesTags: ["Categories"],
    }),

    sendMarketingEmail: builder.mutation<MarketingEmailResponseData, string>({
      query: email => ({ url: "/send-marketing-email", method: "POST", body: MarketingEmailRequestSchema.parse({ email }) }),
      transformResponse: response => MarketingEmailResponseSchema.parse(response),
    }),
  }),
});

function productRequestToFormData(product: ProductCreateRequestData | ProductEditRequestData) {
  const formData = new FormData();
  if ("_id" in product) formData.append("_id", product._id);
  formData.append("name", product.name);
  formData.append("description", product.description);
  formData.append("price", String(product.price));
  formData.append("quantity", String(product.quantity));
  formData.append("category", product.category);
  if (product.file) formData.append("file", product.file);
  return formData;
}

export const {
  useApproveCashPaymentMutation,
  useCancelOrderMutation,
  useCartPreviewMutation,
  useCreateCategoryMutation,
  useCreateOrderMutation,
  useCreateProductMutation,
  useCreateShipmentMutation,
  useDeleteCategoryMutation,
  useDeleteProductMutation,
  useEditCategoryMutation,
  useEditProductMutation,
  useEditShipmentMutation,
  useGetAdminOrdersQuery,
  useGetCategoriesQuery,
  useGetOrderQuery,
  useGetProductQuery,
  useGetProductsQuery,
  useInitializeAuthQuery,
  useInitiateSTKPushMutation,
  useLoginMutation,
  useLogoutMutation,
  useRefreshTokenMutation,
  useSendMarketingEmailMutation,
  useSignupMutation,
} = api;

export default api;
