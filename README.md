# Shop UI

Frontend for the Shop e-commerce application. It is a React + TypeScript single-page app built with Vite, TanStack Router, Redux Toolkit, RTK Query, Tailwind CSS, and Radix UI primitives.

## Features

- Customer storefront with product browsing, product details, cart, wishlist, checkout, account, and order status pages.
- Authentication flows for sign up, login, logout, refresh tokens, and session restoration.
- Protected account routes and admin-only dashboard routes.
- Admin screens for products, categories, and orders.
- RTK Query API layer with Zod response validation.
- Product image upload support through the backend product endpoints.
- M-Pesa STK Push checkout integration through the backend.
- Product chat widget connected to the backend product assistant endpoint.

## Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Router
- Redux Toolkit and RTK Query
- Tailwind CSS
- Radix UI
- Zod
- Lucide React

## Requirements

- Node.js 20 or newer is recommended.
- npm
- The backend server running locally or deployed somewhere reachable by the browser.

## Getting Started

Install dependencies:

```powershell
npm install
```

Create a local environment file:

```powershell
Copy-Item .env.example .env
```

Set the API URL in `.env`:

```env
VITE_API_URL=http://localhost:3000
```

Start the development server:

```powershell
npm run dev
```

Vite will print the local URL, usually:

```text
http://localhost:5173
```

## Available Scripts

```powershell
npm run dev
```

Runs the Vite development server with hot module replacement.

```powershell
npm run build
```

Type-checks the project and creates a production build in `dist`.

```powershell
npm run preview
```

Serves the production build locally for final verification.

```powershell
npm run lint
```

Runs ESLint across the project.

## Environment Variables

| Variable | Required | Description |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Base URL for the backend API. Defaults to `http://localhost:3000` in code when missing. |

Only variables prefixed with `VITE_` are exposed to the browser by Vite.

## Project Structure

```text
src/
  api/              RTK Query API slice and authenticated base query
  assets/           Static assets imported by React components
  components/       Reusable UI, layout, guards, and widgets
  hooks/            Typed Redux hooks
  pages/            Route page components
  routes/           TanStack Router file routes
  store/            Redux store and feature slices
  types/            TypeScript types and Zod schemas
  utils/            Token, checkout, API error, and formatting utilities
```

## Routing

Routes are defined with TanStack Router under `src/routes`.

Main customer routes:

- `/`
- `/about`
- `/contact`
- `/login`
- `/sign-up`
- `/product/$productId`
- `/cart`
- `/wishlist`
- `/checkout`
- `/account`
- `/order-status`

Admin routes:

- `/admin`
- `/admin/products`
- `/admin/categories`
- `/admin/orders`

Admin pages are protected by `RequireAdmin`, which allows users with the `admin` or `superAdmin` role.

## API Integration

The API client is defined in `src/api/exclusive.ts`. Requests use `baseQueryWithReauth`, which:

- Reads the API base URL from `VITE_API_URL`.
- Adds the current access token to authenticated requests.
- Refreshes expired access tokens using the stored refresh token.
- Logs the user out locally when refresh fails.
- Normalizes API errors for the UI.

The UI expects the backend to expose endpoints for auth, categories, products, cart previews, shipments, orders, invoices, M-Pesa STK Push, marketing email capture, and product chat.

## Build Output

Production assets are generated in:

```text
dist/
```

Do not edit files in `dist` directly. Change the source files under `src`, then rebuild.

## Notes for Development

- Keep request and response schemas in `src/types/zod-schemas.ts` aligned with the backend response shape.
- Keep shared domain types in `src/types/types.ts` aligned with the backend models and handlers.
- When adding new API endpoints, add the RTK Query endpoint, the request/response types, and the Zod schemas together.
- If auth behavior changes, update both `src/api/base-query-with-reauth.ts` and the auth slice.
