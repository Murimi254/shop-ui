// store/api/baseQueryWithReauth.ts
import { logout, setAccessToken } from "@/store/slices/authSlice";
import type { RootState } from "@/store/store";
import { tokenStorage } from "@/utils/token-storage";
import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

// The base query all requests use — attaches access token automatically
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;
    if (token) headers.set("Authorization", `Bearer ${token}`);
    return headers;
  },
});

// Module-level flag and queue — shared across all requests
let isRefreshing = false;
let waitingQueue: Array<(token: string | null) => void> = [];

function processQueue(token: string | null) {
  waitingQueue.forEach(callback => callback(token));
  waitingQueue = [];
}

export const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  // 1. Fire the original request
  let result = await baseQuery(args, api, extraOptions);

  // 2. If it's not a 401, return immediately — nothing to do
  if (result.error?.status !== 401) {
    return result;
  }

  // 3. We have a 401 — check if a refresh is already in progress
  if (isRefreshing) {
    // Another request is already handling the refresh
    // Get in line and wait for the new token
    return new Promise(resolve => {
      waitingQueue.push((newToken: string | null) => {
        if (!newToken) {
          // Refresh failed — return the original 401
          resolve(result);
          return;
        }

        // Retry this request with the new token
        const retryArgs = buildRetryArgs(args, newToken);
        resolve(baseQuery(retryArgs, api, extraOptions));
      });
    });
  }

  // 4. This request leads the refresh
  isRefreshing = true;

  try {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    // Call the refresh endpoint directly with fetch — not through RTK Query
    // Using RTK Query here would cause a circular dependency
    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new Error("Refresh failed");
    }

    const { accessToken } = await response.json();

    // Update store and storage with new tokens
    api.dispatch(setAccessToken(accessToken));

    // Release everyone waiting in the queue with the new token
    processQueue(accessToken);

    // Retry the original request that triggered the 401
    const retryArgs = buildRetryArgs(args, accessToken);
    result = await baseQuery(retryArgs, api, extraOptions);
    return result;
  } catch {
    // Refresh failed — session is dead
    // Release the queue with null so waiting requests know it failed
    processQueue(null);
    api.dispatch(logout());
    tokenStorage.clearRefreshToken();

    // Return the original 401 to the component
    return result;
  } finally {
    isRefreshing = false;
  }
};

// Helper — injects the new token into the request args
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
