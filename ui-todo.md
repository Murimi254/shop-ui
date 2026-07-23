# UI TODO

**Inspection Date:** 2026-07-23

## Goal

Make the UI fully match the server contract, then implement the remaining customer and admin workflows needed for a complete portfolio e-commerce application.

---

# Sweep Summary

- The server route surface is ready enough for:
  - Customer shopping
  - Checkout
  - MPESA initiation
  - Invoice download
  - Admin order, product, and category management
- The UI currently has partial product listing/detail integration, but authentication, checkout, shipment, MPESA, invoice, and admin workflows are still mostly unwired.
- The UI repository is clean except for this `ui-todo.md` file.
- TypeScript currently passes:

```bash
npx tsc --noEmit -p tsconfig.app.json
```

- `npm run build` previously failed inside the sandbox because TypeScript attempted to write `.tsbuildinfo` into `node_modules/.tmp`, resulting in an `EPERM` error.

---

# Server Contract

## Base URL

```
http://localhost:3000
```

## Authentication

### POST `/signup`

Request

```ts
{
  (fullName, email, password);
}
```

Response

Returns user fields plus:

```ts
{
  (accessToken, refreshToken);
}
```

> Note: Signup currently returns a different response shape from login.

---

### POST `/login`

Request

```ts
{
  (email, password);
}
```

Response

```ts
{
  user: {
    _id,
    fullName,
    email,
    role
  },
  accessToken,
  refreshToken
}
```

---

### POST `/refresh`

```ts
{
  refreshToken;
}
```

Returns

```ts
{
  (accessToken, refreshToken);
}
```

---

### GET `/restore-session`

Header

```
Authorization: Bearer <refreshToken>
```

Returns

```ts
{
  (user, accessToken, refreshToken);
}
```

---

### POST `/logout`

Header

```
Authorization: Bearer <accessToken>
```

---

# Public Catalog

## GET `/categories`

Returns

```ts
string[]
```

(Category names only.)

---

## GET `/products?page=&limit=&search=`

Returns

```ts
{
  totalPages?,
  currentPage?,
  productsCount,
  returnedProducts,
  products,
  message?
}
```

> Empty or out-of-range responses may omit `totalPages` and `currentPage`.

---

## GET `/product/:productId`

Returns

```ts
{
  (_id, name, quantity, description, price, category, imageUrl);
}
```

---

## POST `/cart-preview`

Request

```ts
{
  items: [
    {
      productId,
      quantity,
    },
  ];
}
```

Returns

```ts
{
  (items, subtotal, shippingCost, total);
}
```

---

## POST `/send-marketing-email`

```ts
{
  email;
}
```

Returns

```ts
{
  message;
}
```

---

# Customer Orders & Payments

## POST `/shipment`

- Authentication required

Request

```ts
{
  _id?,
  addressLine1,
  addressLine2?,
  city,
  state,
  postalCode
}
```

Creates one shipment per user.

---

## POST `/edit-shipment`

Requires authentication.

Body requires:

- `_id`
- address fields

---

## POST `/order`

Requires authentication.

```ts
{
  items: [
    {
      productId,
      quantity
    }
  ],
  paymentMethod: "MPESA" | "CASH"
}
```

Requires an existing shipment.

---

## GET `/order/:orderId`

Returns a customer's own order.

---

## POST `/cancel-order`

```ts
{
  orderId;
}
```

Only unpaid orders can be cancelled.

---

## GET `/invoice/:orderId`

Authenticated.

Works only for paid orders belonging to the authenticated user.

---

## POST `/stkpush`

```ts
{
  (orderId, phoneNumber);
}
```

Valid only for MPESA orders owned by the authenticated user.

---

# Admin API

## GET `/orders`

Admin or Super Admin only.

Lists all non-deleted orders.

---

## POST `/approve-cash-payment`

```ts
{
  orderId;
}
```

Only valid for CASH orders.

---

## POST `/category`

```ts
{
  name;
}
```

---

## POST `/edit-category`

```ts
{
  (_id, name);
}
```

---

## POST `/delete-category`

```ts
{
  modelId;
}
```

---

## POST `/product`

Multipart form-data.

Fields

- file
- name
- description
- price
- quantity
- category

---

## POST `/edit-product`

Multipart form-data.

Fields

- `_id`
- name
- description
- price
- quantity
- category
- optional `file`

---

## POST `/delete-product`

```ts
{
  modelId;
}
```

---

# Backend Gaps Affecting the UI

- No endpoint to fetch the authenticated user's shipment.
- No customer order history endpoint.
- Category edit/delete requires IDs, but `/categories` returns only names.
- No profile update endpoint.
- No contact form endpoint.
- Forgot-password route is missing despite an existing handler.

---

# Priority 1 — API Foundation

- Move API base URL to `VITE_API_URL`.
- Add `.env.example`.

```env
VITE_API_URL=http://localhost:3000
```

- Wire `baseQueryWithReauth`.
- Fix refresh endpoint:

```
/refresh
```

instead of

```
/auth/refresh
```

- Store both rotated tokens.
- Add fallback base URL.
- Fix JWT validation.
- Add schemas/types for:
  - Signup
  - Refresh
  - Restore Session
  - Categories
  - Cart Preview
  - Shipment
  - Orders
  - Admin Orders
  - Cash Approval
  - STK Push
  - Product CRUD
  - Category CRUD
  - Marketing Email
- Handle optional pagination fields.
- Normalize RTK Query errors.
- Export all required hooks.

---

# Priority 2 — Authentication & Route Guards

- [x] Wire Login page.
- [x] Wire Signup page.
- [x] Normalize signup response.
- [x] Restore session on app startup.
- [x] Replace synchronous auth guards.
- [x] Add admin route guard component.
- [x] Redirect authenticated users away from auth pages.
- [x] Logout via server.
- [x] Loading/error states.
- [x] Hide Google signup.
- [x] Remove Forgot Password until backend exists.

> Admin route application stays in Priority 6 when the `/admin` route tree is created.

---

# Priority 3 — Customer Product Browsing

- Validate backend product data.
- Implement search.
- Add search results.
- Decide category filtering strategy.
- Use backend categories.
- Empty states.
- Remove fake cart behavior.
- Product detail improvements:
  - Add to Cart / Buy Now
  - Stock validation
  - Out-of-stock state
  - Related products

---

# Priority 4 — Cart & Checkout

- Keep Redux cart.
- Use `POST /cart-preview`.
- Convert IDs.
- Backend shipping costs.
- Remove coupon logic.
- Payment methods:
  - MPESA
  - CASH
- Shipment form fields:
  - addressLine1
  - addressLine2
  - city
  - state
  - postalCode
  - phoneNumber
- Shipment strategy.
- Checkout flow:

1. Validate cart
2. Validate shipment
3. Create shipment
4. Create order
5. STK Push (if MPESA)
6. Confirmation
7. Clear cart

- Validate Kenyan MPESA numbers.
- Add loading/success/error states.

---

# Priority 5 — Orders & Customer Account

- Order status page.
- Store last `orderId`.
- Refresh status.
- Cancel unpaid orders.
- Download invoices.
- Split Account page into:
  - Profile
  - Shipment
  - Orders
  - Wishlist
- Remove fake address initialization.
- Hide password change.

---

# Priority 6 — Admin

Create routes:

- `/admin`
- `/admin/orders`
- `/admin/products`
- `/admin/categories`

Implement:

- Admin layout
- Role guards
- Dashboard
- Orders page
- Product CRUD
- Category CRUD
- Forbidden page

---

# Priority 7 — Marketing & UX

- Marketing email workflow
- Contact page strategy
- Remove stale `/api/...` comments
- Fix mojibake
- Review responsive layouts

---

# Priority 8 — Type & State Cleanup

- Consolidate product types.
- Decide fate of old auth code.
- Remove static fixtures.
- Add state for:
  - Checkout result
  - Shipment ID
  - Order ID

---

# Suggested Implementation Order

1. API foundation
2. Authentication
3. Product browsing
4. Cart preview
5. Shipment & checkout
6. MPESA integration
7. Orders & invoices
8. Admin routes & product management
9. Category management

---

# Verification Checklist

## TypeScript

```bash
npx tsc --noEmit -p tsconfig.app.json
```

## Build

```bash
npm run build
```

(after the `.tsbuildinfo` permission issue is resolved)

## Manual Testing

- [ ] Signup
- [ ] Login
- [ ] Restore session
- [ ] Logout
- [ ] Product listing
- [ ] Product search
- [ ] Product details
- [ ] Add to cart
- [ ] Cart preview totals
- [ ] Create shipment
- [ ] Create CASH order
- [ ] Create MPESA order
- [ ] Refresh order status
- [ ] Cancel unpaid order
- [ ] Download paid invoice
- [ ] Create product as admin
- [ ] Edit product
- [ ] Delete product
- [ ] Create category
- [ ] Approve CASH payment
