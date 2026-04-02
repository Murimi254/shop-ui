import { clearCredentials, setAccessToken, setCredentials, setInitialized } from "@/store/slices/auth";
import type { RootState } from "@/store/store";
import type { LoginCredentialsData, LoginResponseData, TokensData } from "@/types/types";
import { LoginCredentialsSchema, LoginResponseSchema, TokensSchema } from "@/types/zod-schemas";
import { tokenStorage } from "@/utils/token-storage";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
const exclusiveApiSlice = createApi({
  reducerPath: "exclusiveApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Products"], //Needs to happen before using them in providesTags and invalidatesTags else TS will yell
  keepUnusedDataFor: 60,
  endpoints: builder => ({
    login: builder.mutation<LoginResponseData, LoginCredentialsData>({
      query: (credentials: LoginCredentialsData) => ({ url: "/login", method: "POST", body: LoginCredentialsSchema.parse(credentials) }),
      onQueryStarted: async (_, { queryFulfilled, dispatch }) => {
        try {
          const { data } = await queryFulfilled;
          const validatedData = LoginResponseSchema.parse(data);
          dispatch(setCredentials(validatedData));
          tokenStorage.setRefreshToken(validatedData.refreshToken);
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
        dispatch(clearCredentials());
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
          dispatch(clearCredentials());
          tokenStorage.clearRefreshToken();
        }
      },
    }),

    initializeAuth: builder.query<void, void>({
      query: () => "/auth/me",
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          const validated = LoginResponseSchema.parse(data);
          dispatch(setCredentials(validated));
        } catch {
          // No valid session — that's fine, just mark as initialized
        } finally {
          dispatch(setInitialized());
        }
      },
    }),

    getProducts: builder.query({
      query: () => ({ url: "/products", method: "GET" }), //NOTE You can either return a string(urlOnly) or an object
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = exclusiveApiSlice;
export default exclusiveApiSlice;
