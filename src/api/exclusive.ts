import { logout, setAccessToken, login, setInitialized } from "@/store/slices/authSlice";
import type { RootState } from "@/store/store";
import type { ApiProduct, ApiProductResponse, LoginCredentialsData, LoginResponseData, ProductsViewModel, TokensData } from "@/types/types";
import { LoginCredentialsSchema, LoginResponseSchema, TokensSchema } from "@/types/zod-schemas";
import { tokenStorage } from "@/utils/token-storage";
import { toUiProducts } from "@/utils/utility-functions";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ZodError } from "zod";
const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["products"], //Needs to happen before using them in providesTags and invalidatesTags else TS will yell
  keepUnusedDataFor: 60,
  endpoints: builder => ({
    login: builder.mutation<LoginResponseData, LoginCredentialsData>({
      query: (credentials: LoginCredentialsData) => ({ url: "/login", method: "POST", body: LoginCredentialsSchema.parse(credentials) }),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          const validatedData = LoginResponseSchema.parse(data);
          const { refreshToken, ...credentials } = validatedData;
          dispatch(login(credentials));
          tokenStorage.setRefreshToken(refreshToken);
        } catch {
          // queryFulfilled rejection is handled by RTK Query automatically
        }
      },
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        // Clear locally immediately — don't wait for server
        dispatch(logout());
        tokenStorage.clearRefreshToken();

        try {
          await queryFulfilled; //still try to invalidate server side
        } catch {
          // Server logout failed — local state is already cleared, which is fine hence no problem
        }
      },
    }),

    refreshToken: builder.mutation<{ accessToken: string }, TokensData>({
      query: () => {
        const refreshToken = tokenStorage.getRefreshToken();
        return { url: "/refresh", method: "POST", body: { refreshToken } };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const validatedTokens = TokensSchema.parse(data);
          tokenStorage.setRefreshToken(validatedTokens.refreshToken);
          dispatch(setAccessToken(validatedTokens.accessToken));
        } catch {
          dispatch(logout());
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
          headers: refreshToken
            ? {
                // send refresh token directly since access token isn't in store yet
                Authorization: `Bearer ${refreshToken}`,
              }
            : undefined,
        };
      },
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const validCredentials = LoginResponseSchema.parse(data);
          dispatch(login(validCredentials));
        } catch (error) {
          if (error instanceof ZodError) {
            // Server response shape changed
            console.error("[initializeAuth] Response validation failed:", error.issues);
          }
          //swallow the 401 silently
        } finally {
          dispatch(setInitialized());
        }
      },
    }),

    getProducts: builder.query<ProductsViewModel, { limit?: number; search?: string; page?: number }>({
      query: params => ({ url: "/products", method: "GET", params }), //NOTE You can either return a string(urlOnly) or an object
      providesTags: ["products"],
      transformResponse: (response: ApiProductResponse): ProductsViewModel => {
        const products = response.products.map((product, index) => toUiProducts(product, index));
        return {
          products,
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
      providesTags: (_result, _error, productId) => [{ type: "products", id: productId }],
    }),

    sendMarketingEmail: builder.mutation<void, string>({
      query: (email: string) => ({ url: "/send-marketing-email", method: "POST", body: { email } }),
    }),
  }),
});

export const { useGetProductsQuery, useGetProductQuery, useLoginMutation, useSendMarketingEmailMutation } = api;
export default api;
