# RTK QUERY CRASH COURSE

We use the `createApi` function imported from `@reduxjs/toolkit/query/react`, this helps do a lot of the heavy lifting for you.
This function receives and object of configurations as the argument.

```javascript
const exclusiveApiSlice = createApi({
  // Identity
  reducerPath: "exclusiveApi",

  // HTTP setup
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8080" }),

  // Cache behavior
  tagTypes: ["Products", "Users"],
  keepUnusedDataFor: 60,
  refetchOnMountOrArgChange: 30,
  refetchOnFocus: true,
  refetchOnReconnect: true,

  // SSR/persistence
  extractRehydrationInfo(action, { reducerPath }) {
    if (action.type === "REHYDRATE") return action.payload[reducerPath];
  },

  // All your endpoints
  endpoints: builder => ({
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Products"],
    }),
  }),
});
```

Let us now dive deeper into each of these properties passed to the createApi itself.

## Configurations passed to the `createApi` function Explained in details.

1. **`reducerPath`** A unique name/key for where your state lives in the Redux store. It receives a string. If you have multiple `createApi` instances, they each need to be unique `reducerPath` to avoid clashes in your store.
2. **`baseQuery`** Defines the base HTTP configuration that all endpoints in this API share e.g. the base url, default headers e.g.

   ```javascript
   baseQuery: fetchBaseQuery({
     baseUrl: "https://api.example.com",
     prepareHeaders: (headers, { getState }) => {
       const token = getState().auth.token;
       if (token) {
         headers.set("Authorization", `Bearer ${token}`);
       }
       return headers;
     },
     credentials: "include",
   });
   ```

   - `baseUrl` => Prefix for all requests. It prevents repetition in your endpoints.
   - `prepareHeaders` =>It gives you a central interception point to mutate request headers before every request is sent.It allows you to inspect and modify HTTP headers dynamically for every outgoing request. This is where you inject cross-cutting concerns like:
     - Authentication tokens
     - Content negotiation (Content-Type)
     - Custom metadata headers

       ```javascript
       prepareHeaders: (headers, api) => {
         /**
          The api is an object that contains {endpoint,getState,type,forced,extra}.
          1.getState - function to access redux store. The most commonly used field.
          2.endpoint - name of the endpoint being called e.g. getUsers Useful when you want endpoint-specific logic.
          3.type - type of the request, Either "query" or "mutation". Lets you differentiate behavior
          4.forced - A boolean that indicates if the request was force-refetched
       
          ##You must return headers, if you don't your modifications won't work.
          ##Should be synchronous, No await and no async token fetching.If you need async logic (like refreshing tokens), that belongs in a custom baseQuery, not prepareHeaders.
          ##Even if you don't modify anything,RTK Query still runs it for every request.
       
          Only use it To ✅ Attach auth tokens ✅ Add global headers ✅ Conditionally modify headers ✅ Read from Redux state before request
       
       
          */
         return headers;
       };
       ```

   - `credentials` => is used to control how cookies, HTTP Basic authentication, and client-side SSL certificates are handled with cross-origin requests.  
      **_'omit'_**: Instructs the browser to exclude any credentials (like cookies) with the request. This is the default value.  
      **_'same-origin'_**: Instructs the browser to send credentials only for same-origin requests.  
     **_'include'_**: Instructs the browser to send credentials (cookies, etc.) with both same-origin and cross-origin requests. This is commonly required when your backend API is on a different domain or port and needs the session cookies to be sent

3. **`tagTypes`** Registers all the tags and lets TS know what tags you have in advance for autocompletion and type checking. Without it TS will yell on your providesTags and invalidatesTags. It receives an array of tags

   ```javascript
   const api = createApi({
     tagTypes: ["Products", "Users", "Orders"],
   });
   ```

4. **`keepUnusedDataFor`** Controls how long(in seconds)cached data stay alive after no component is using it anymore. Receives the number of seconds. Can be set both on the createApi and specific endpoint. The endpoint one takes precedence.
5. **`refetchOnMountOrArgChange`** Controls whether a query re-fetches when a component mounts or when the query argument changes, even if cached data exists. It receives Either a boolean or a number (seconds). By default RTK Query is very cache-happy — it won't re-fetch if it already has data. This lets you change that behavior globally.

   ```javascript
   const api = createApi({
     // true = always re-fetch on mount
     refetchOnMountOrArgChange: true,

     // OR a number = re-fetch only if cached data is older than 30 seconds
     refetchOnMountOrArgChange: 30,
   });
   ```

6. **`refetchOnFocus`** Automatically re-fetches active queries when the user comes back to the browser tab/window after being away. Great for keeping data fresh when users switch tabs and come back — like a dashboard with live numbers.

   ```javascript
   const api = createApi({
     refetchOnFocus: true, // re-fetch when user returns to the tab
   });
   ```

   You also need to call `setupListeners(store.dispatch)` in your store setup for this to work.

7. **`refetchOnReconnect`** Automatically re-fetches active queries when the user's internet connection comes back after being offline. Essential for apps where users might go offline (mobile apps, poor connections). When they reconnect, stale data is automatically refreshed.

   ```javascript
   const api = createApi({
     refetchOnReconnect: true, // re-fetch when internet comes back
   });
   ```

   Also needs `setupListeners(store.dispatch)` just like `refetchOnFocus`.

8. **`extractRehydrationInfo`** Lets you rehydrate (restore) the RTK Query cache from server-side rendering (SSR) or persisted storage — like when using Next.js or redux-persist.  
   It returns the previously saved cache state, or `undefined` if not applicable.  
   Without this, users doing SSR would see a flash of empty content because the cache would start empty even though the server already fetched the data.

   ```javascript
   const api = createApi({
     extractRehydrationInfo(action, { reducerPath }) {
       if (action.type === "REHYDRATE") {
         return action.payload[reducerPath]; // restore the cache
       }
     },
   });
   ```

9. **`serializeQueryArgs` (global)** Same as the endpoint-level version but this one sets a global default for how cache keys are generated across ALL endpoints.  
    It returns A string or object that becomes the cache key.  
    If you have a consistent custom caching strategy across your whole app, you set it once here instead of repeating it on every endpoint.
   ```javascript
   const api = createApi({
     serializeQueryArgs: ({ endpointName, queryArgs }) => {
       // custom global cache key logic
       return `${endpointName}-${JSON.stringify(queryArgs)}`;
     },
   });
   ```
