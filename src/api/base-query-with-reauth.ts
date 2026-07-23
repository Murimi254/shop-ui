import { logout, setAccessToken } from "@/store/slices/authSlice";
import type { RootState } from "@/store/store";
import { TokensSchema } from "@/types/zod-schemas";
import { tokenStorage } from "@/utils/token-storage";
import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

export const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:3000").replace(/\/+$/, "");

export type NormalizedApiError = {
  status: FetchBaseQueryError["status"];
  message: string;
  errors?: unknown;
  origin?: string;
};

const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

let isRefreshing = false;
let waitingQueue: Array<(token: string | null) => void> = [];
const reauthExcludedPaths = new Set(["/login", "/signup", "/refresh", "/restore-session", "/logout"]);

function processQueue(token: string | null) {
  waitingQueue.forEach(callback => callback(token));
  waitingQueue = [];
}

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, NormalizedApiError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status !== 401 || reauthExcludedPaths.has(getRequestPath(args))) {
    return normalizeResult(result);
  }

  if (isRefreshing) {
    return new Promise(resolve => {
      waitingQueue.push(async (newToken: string | null) => {
        if (!newToken) {
          resolve(normalizeResult(result));
          return;
        }

        const retryArgs = buildRetryArgs(args, newToken);
        const retryResult = await baseQuery(retryArgs, api, extraOptions);
        resolve(normalizeResult(retryResult));
      });
    });
  }

  isRefreshing = true;

  try {
    const refreshToken = tokenStorage.getRefreshToken();
    if (!refreshToken) throw new Error("No refresh token");

    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) throw new Error("Refresh failed");

    const tokens = TokensSchema.parse(await response.json());
    api.dispatch(setAccessToken(tokens.accessToken));
    tokenStorage.setRefreshToken(tokens.refreshToken);
    processQueue(tokens.accessToken);

    const retryArgs = buildRetryArgs(args, tokens.accessToken);
    result = await baseQuery(retryArgs, api, extraOptions);
    return normalizeResult(result);
  } catch {
    processQueue(null);
    api.dispatch(logout());
    tokenStorage.clearRefreshToken();
    return normalizeResult(result);
  } finally {
    isRefreshing = false;
  }
};

function buildRetryArgs(args: string | FetchArgs, newToken: string): string | FetchArgs {
  if (typeof args === "string") return args;
  return {
    ...args,
    headers: {
      ...(args.headers ?? {}),
      Authorization: `Bearer ${newToken}`,
    },
  };
}

function getRequestPath(args: string | FetchArgs) {
  const url = typeof args === "string" ? args : args.url;
  return url.split("?")[0] ?? url;
}

function normalizeResult(result: Awaited<ReturnType<typeof baseQuery>>) {
  if (!result.error) return result;
  return {
    ...result,
    error: normalizeApiError(result.error),
  };
}

function normalizeApiError(error: FetchBaseQueryError): NormalizedApiError {
  if (typeof error.status === "number") {
    const data = error.data;
    return {
      status: error.status,
      message: getStringField(data, "message") ?? `Request failed with status ${error.status}.`,
      errors: getUnknownField(data, "errors"),
      origin: getStringField(data, "origin"),
    };
  }

  if ("error" in error && error.error) {
    return { status: error.status, message: error.error };
  }

  return { status: error.status, message: "Request failed." };
}

function getStringField(data: unknown, field: string) {
  const value = getUnknownField(data, field);
  return typeof value === "string" ? value : undefined;
}

function getUnknownField(data: unknown, field: string) {
  if (!data || typeof data !== "object" || !(field in data)) return undefined;
  return (data as Record<string, unknown>)[field];
}
