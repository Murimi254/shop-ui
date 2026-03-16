# The Complete Redux & RTK Query Masterclass
## One Comprehensive Guide for E-Commerce Development

---

## Table of Contents

### FOUNDATION (You Are Here)
1. [Overview & Learning Path](#1-overview--learning-path)
2. [Your E-Commerce Architecture](#2-your-ecommerce-architecture)

### PART A: REDUX MASTERY (Tonight & Tomorrow)
3. [Redux Fundamentals](#3-redux-fundamentals)
4. [Redux for E-Commerce](#4-redux-for-ecommerce)
5. [Redux Advanced Patterns](#5-redux-advanced-patterns)
6. [Redux DevTools & Debugging](#6-redux-devtools--debugging)

### PART B: RTK QUERY INTEGRATION (Next Week)
7. [RTK Query Fundamentals](#7-rtk-query-fundamentals)
8. [RTK Query for E-Commerce](#8-rtk-query-for-ecommerce)
9. [Cache Management Deep Dive](#9-cache-management-deep-dive)
10. [Authentication Integration](#10-authentication-integration)
11. [Advanced RTK Query Patterns](#11-advanced-rtk-query-patterns)

### PART C: PUTTING IT ALL TOGETHER
12. [Complete Project Setup](#12-complete-project-setup)
13. [Real E-Commerce Implementation](#13-real-ecommerce-implementation)
14. [Common Mistakes & Solutions](#14-common-mistakes--solutions)
15. [Mental Models & Architecture](#15-mental-models--architecture)

---

## 1. Overview & Learning Path

### Why This Comprehensive Guide?

You're building an **e-commerce project** that needs:
- ✅ **App-wide state management** (Redux)
- ✅ **Server data fetching** (RTK Query on top of Redux)
- ✅ **Complex data relationships** (both systems working together)
- ✅ **Production-grade implementation** (not tutorials, real patterns)

This guide gives you **everything in one place**, organized to follow sequentially.

### Your Journey Timeline

```
TONIGHT (3-4 hours):
└─ Read: Sections 3-4 (Redux fundamentals + e-commerce slices)
   Goal: Understand Redux core concepts

TOMORROW (3-4 hours):
└─ Read: Sections 5-6 (Advanced patterns + debugging)
   Goal: Master async operations and debugging
   Code: Create your auth + cart slices

NEXT WEEK (3-4 hours):
└─ Read: Sections 7-10 (RTK Query fundamentals + auth)
   Goal: Understand RTK Query architecture
   Code: Implement API slices

WEEK 2 (3-4 hours):
└─ Read: Sections 11-15 (Advanced patterns + complete project)
   Goal: Build production features
   Code: Complete e-commerce implementation

TOTAL: 12-16 hours to complete mastery
```

### What You'll Know After Each Phase

**After Redux (Tomorrow):**
- Store, reducers, actions, selectors, async thunks
- How to manage auth, cart, filters, notifications
- Full app-wide state management

**After RTK Query (Next Week):**
- Cache, subscriptions, tags, invalidation
- How to fetch products, orders, user data
- Authentication with token refresh
- Combining Redux + RTK Query seamlessly

**After Complete Section (Week 2):**
- Production-grade e-commerce architecture
- Building any feature with confidence
- Debugging any issue independently

---

## 2. Your E-Commerce Architecture

### Project Structure

```
src/
├── app/
│   ├── store.ts              ← One store for entire app
│   └── hooks.ts              ← Custom typed hooks
│
├── api/
│   ├── apiSlice.ts           ← RTK Query base
│   ├── baseQuery.ts          ← Fetch with auth
│   ├── productsApi.ts        ← Product endpoints
│   ├── ordersApi.ts          ← Order endpoints
│   └── cartApi.ts            ← Cart endpoints (optional with RTK Query)
│
├── features/
│   ├── auth/
│   │   ├── authSlice.ts      ← Auth state (Redux)
│   │   ├── authApi.ts        ← Auth endpoints (RTK Query)
│   │   ├── authSelectors.ts
│   │   ├── LoginForm.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── cart/
│   │   ├── cartSlice.ts      ← Cart state (Redux)
│   │   ├── cartSelectors.ts
│   │   ├── CartSummary.tsx
│   │   └── CartIcon.tsx
│   │
│   ├── products/
│   │   ├── productsSlice.ts  ← Filter/sort state (Redux)
│   │   ├── ProductList.tsx
│   │   ├── ProductCard.tsx
│   │   └── ProductFilters.tsx
│   │
│   ├── ui/
│   │   ├── uiSlice.ts        ← Notifications, theme (Redux)
│   │   └── NotificationCenter.tsx
│   │
│   └── orders/
│       ├── OrderHistory.tsx  ← Uses RTK Query
│       └── OrderDetails.tsx
│
└── App.tsx
```

### The State Structure (What Lives Where)

```typescript
Redux Store:
{
  // Redux Slices - State you manage manually
  auth: {
    token: string,
    user: User,
    isLoading: boolean,
  },
  cart: {
    items: CartItem[],
    total: number,
  },
  products: {
    filters: { search, category, sortBy }
  },
  ui: {
    notifications: Notification[],
    isDarkMode: boolean,
  },

  // RTK Query - State it manages automatically
  api: {
    queries: {
      'getProducts(undefined)': { status, data, timestamp },
      'getProductById("1")': { status, data, timestamp },
      'getMyOrders()': { status, data, timestamp },
    },
    subscriptions: { /* ... */ },
    requests: { /* ... */ }
  }
}
```

---

# PART A: REDUX MASTERY

---

## 3. Redux Fundamentals

### 3.1 The Core Concept: Store

**What is the Redux Store?**

The Redux store is a **single JavaScript object** that holds **all your app state**.

```typescript
// This ONE object holds everything:
{
  auth: { token, user, isLoading, error },
  cart: { items, total, itemCount },
  products: { filters },
  ui: { notifications, isDarkMode },
  api: { queries, subscriptions }  // RTK Query adds this
}
```

**Why One Store?**

```
❌ Without Redux (multiple state locations):
Component A: const [products, setProducts] = useState([]);
Component B: const [products, setProducts] = useState([]);
Component C: const [products, setProducts] = useState([]);
→ Same data in 3 places, can get out of sync

✅ With Redux (single source of truth):
Store has: state.api.queries['getProducts'].data
All components read from same place
→ Always in sync, single source of truth
```

### 3.2 Creating the Store

```typescript
// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import productsReducer from '../features/products/productsSlice';
import uiReducer from '../features/ui/uiSlice';
import { apiSlice } from '../api/apiSlice';

export const store = configureStore({
  reducer: {
    // Your Redux slices
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    ui: uiReducer,

    // RTK Query (added later, same store)
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  // Add RTK Query middleware (later)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware), // Will add this next week

  devTools: process.env.NODE_ENV === 'development',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Key Point:** One store for ENTIRE app. Both Redux state and RTK Query cache live here.

### 3.3 Slices: Redux Toolkit's Simpler Way

Redux Toolkit's `createSlice` replaces all traditional Redux boilerplate.

```typescript
// features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: null,
  isLoading: false,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth', // Becomes action type prefix: 'auth/loginSuccess'

  initialState,

  // Synchronous state updates
  reducers: {
    // Action: successfully logged in
    loginSuccess: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isLoading = false;
      state.error = null;
      localStorage.setItem('token', action.payload.token);
    },

    // Action: login failed
    loginFailed: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    // Action: user logged out
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },

    // Action: started login process
    loginStarted: (state) => {
      state.isLoading = true;
      state.error = null;
    },
  },
});

// Export actions - components use these to dispatch
export const { loginSuccess, loginFailed, logout, loginStarted } = authSlice.actions;

// Export reducer - store imports this
export default authSlice.reducer;
```

**Key Insight:** `createSlice` creates:
- ✅ Initial state
- ✅ Reducer function
- ✅ Action creators
- ✅ Action types

All automatically!

### 3.4 Reducers: Pure Functions

A **reducer** transforms state based on actions.

```
OLD STATE + ACTION → REDUCER → NEW STATE
```

**Rules for Reducers:**
1. Must be **pure** (same input = same output)
2. No **side effects** (no API calls, no console.log in logic)
3. Never **mutate** old state (Redux Toolkit + Immer handles this)
4. Must handle **all action types**

```typescript
// Redux Toolkit makes this safe with Immer
// Looks like mutation, but Immer converts to immutable update

reducers: {
  addItem: (state, action) => {
    // This LOOKS like mutation
    state.items.push(action.payload);
    
    // But Redux Toolkit + Immer handles it safely
    // Equivalent to: return { ...state, items: [...state.items, action.payload] }
  }
}
```

### 3.5 Actions: Events That Trigger Changes

An **action** is a plain object describing what happened.

```typescript
// Action objects (created automatically by createSlice)
{ type: 'auth/loginSuccess', payload: { token: '...', user: { ... } } }
{ type: 'auth/loginFailed', payload: 'Invalid credentials' }
{ type: 'auth/logout', payload: undefined }
```

**Components trigger actions with `dispatch()`:**

```typescript
// In a component:
const handleLogin = () => {
  dispatch(loginSuccess({ token: '...', user: { ... } }));
}
```

### 3.6 Selectors: Reading State

A **selector** is a function that extracts data from the store.

```typescript
// features/auth/authSelectors.ts
import type { RootState } from '../../app/store';

export const selectToken = (state: RootState) => state.auth.token;
export const selectUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) => !!state.auth.token;

// In a component:
const token = useSelector(selectToken);
const user = useSelector(selectUser);
const isAuth = useSelector(selectIsAuthenticated);
```

---

## 4. Redux for E-Commerce

### 4.1 Auth Slice (Complete Example)

```typescript
// features/auth/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  refreshToken: localStorage.getItem('refreshToken'),
  user: null,
  isLoading: false,
  error: null,
};

// Async thunk for login API call
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.message);
      }

      const data = await response.json();
      return data; // { token, refreshToken, user }
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    // Synchronous actions
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
  },

  // Handle async thunk results
  extraReducers: (builder) => {
    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.isLoading = false;
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    });
  },
});

export const { setToken } = authSlice.actions;
export default authSlice.reducer;
```

### 4.2 Cart Slice (Complete Example)

```typescript
// features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

const initialState: CartState = {
  items: JSON.parse(localStorage.getItem('cart') || '[]'),
  total: 0,
  itemCount: 0,
};

// Helper to recalculate totals
const recalculateTotals = (items: CartItem[]) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  return { total, itemCount };
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,

  reducers: {
    // Add item or increase quantity
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        item => item.productId === action.payload.productId
      );

      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }

      const { total, itemCount } = recalculateTotals(state.items);
      state.total = total;
      state.itemCount = itemCount;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    // Update quantity
    updateQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const item = state.items.find(i => i.productId === action.payload.productId);
      if (item) {
        item.quantity = action.payload.quantity;
      }

      const { total, itemCount } = recalculateTotals(state.items);
      state.total = total;
      state.itemCount = itemCount;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    // Remove item
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);

      const { total, itemCount } = recalculateTotals(state.items);
      state.total = total;
      state.itemCount = itemCount;
      localStorage.setItem('cart', JSON.stringify(state.items));
    },

    // Clear cart (after checkout)
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      localStorage.removeItem('cart');
    },
  },
});

export const { addToCart, updateQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
```

### 4.3 Using Redux in Components

**Reading State with `useSelector`:**

```typescript
// features/auth/LoginForm.tsx
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from './authSlice';
import type { RootState } from '../../app/store';

function LoginForm() {
  const dispatch = useDispatch();

  // Read from Redux store
  const { isLoading, error } = useSelector((state: RootState) => state.auth);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    // Dispatch async thunk
    dispatch(loginUser({ email, password }));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />

      {isLoading && <p>Logging in...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button type="submit" disabled={isLoading}>
        Login
      </button>
    </form>
  );
}
```

**Triggering Actions with `useDispatch`:**

```typescript
// features/products/ProductCard.tsx
import { useDispatch } from 'react-redux';
import { addToCart } from '../cart/cartSlice';
import { addNotification } from '../ui/uiSlice';

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = () => {
    // Dispatch add to cart action
    dispatch(addToCart({
      id: Math.random().toString(),
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      imageUrl: product.image,
    }));

    // Dispatch notification action
    dispatch(addNotification({
      type: 'success',
      message: `${product.name} added to cart!`,
    }));
  };

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
    </div>
  );
}
```

---

## 5. Redux Advanced Patterns

### 5.1 Selectors for Computed State

```typescript
// features/cart/cartSelectors.ts
import type { RootState } from '../../app/store';

// Basic selectors
export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotal = (state: RootState) => state.cart.total;
export const selectCartItemCount = (state: RootState) => state.cart.itemCount;

// Computed selectors (derived data)
export const selectTotalWithTax = (state: RootState) => {
  const taxRate = 0.08; // 8% tax
  return state.cart.total * (1 + taxRate);
};

export const selectShippingCost = (state: RootState) => {
  const total = state.cart.total;
  if (total > 100) return 0; // Free shipping over $100
  if (total > 50) return 5;  // $5 shipping
  return 10; // $10 standard
};

export const selectFinalTotal = (state: RootState) => {
  const subtotal = state.cart.total;
  const tax = subtotal * 0.08;
  const shipping = selectShippingCost(state);
  return subtotal + tax + shipping;
};

// In component:
function CheckoutSummary() {
  const subtotal = useSelector(selectCartTotal);
  const tax = useSelector(selectTotalWithTax);
  const shipping = useSelector(selectShippingCost);
  const final = useSelector(selectFinalTotal);

  return (
    <div>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <p>Tax: ${(tax - subtotal).toFixed(2)}</p>
      <p>Shipping: ${shipping.toFixed(2)}</p>
      <h3>Total: ${final.toFixed(2)}</h3>
    </div>
  );
}
```

### 5.2 Filters & Sorting (Product Slice)

```typescript
// features/products/productsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProductsState {
  filters: {
    search: string;
    category: string;
    priceRange: [number, number];
    sortBy: 'price' | 'rating' | 'newest';
  };
}

const initialState: ProductsState = {
  filters: {
    search: '',
    category: 'all',
    priceRange: [0, 1000],
    sortBy: 'newest',
  },
};

export const productsSlice = createSlice({
  name: 'products',
  initialState,

  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
    },

    setCategory: (state, action: PayloadAction<string>) => {
      state.filters.category = action.payload;
    },

    setPriceRange: (state, action: PayloadAction<[number, number]>) => {
      state.filters.priceRange = action.payload;
    },

    setSortBy: (state, action: PayloadAction<'price' | 'rating' | 'newest'>) => {
      state.filters.sortBy = action.payload;
    },
  },
});

export const { setSearch, setCategory, setPriceRange, setSortBy } = productsSlice.actions;
export default productsSlice.reducer;
```

**Using filters in component:**

```typescript
// features/products/ProductList.tsx
function ProductList() {
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.products.filters);

  return (
    <div>
      <input
        value={filters.search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        placeholder="Search..."
      />

      <select
        value={filters.category}
        onChange={(e) => dispatch(setCategory(e.target.value))}
      >
        <option value="all">All</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select
        value={filters.sortBy}
        onChange={(e) => dispatch(setSortBy(e.target.value as any))}
      >
        <option value="newest">Newest</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
      </select>
    </div>
  );
}
```

### 5.3 Notifications System (UI Slice)

```typescript
// features/ui/uiSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number; // ms before auto-dismiss
}

interface UIState {
  notifications: Notification[];
  isDarkMode: boolean;
}

const initialState: UIState = {
  notifications: [],
  isDarkMode: localStorage.getItem('darkMode') === 'true',
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,

  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id'>>) => {
      state.notifications.push({
        id: Math.random().toString(),
        ...action.payload,
      });
    },

    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },

    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', state.isDarkMode.toString());
    },
  },
});

export const { addNotification, removeNotification, toggleDarkMode } = uiSlice.actions;
export default uiSlice.reducer;
```

**Using notifications:**

```typescript
// Anywhere in app
function SomeComponent() {
  const dispatch = useDispatch();

  const handleSuccess = () => {
    dispatch(addNotification({
      type: 'success',
      message: 'Operation successful!',
      duration: 3000,
    }));

    // Auto-dismiss
    setTimeout(() => {
      dispatch(removeNotification(id));
    }, 3000);
  };
}

// Show notifications
function NotificationCenter() {
  const notifications = useSelector((state: RootState) => state.ui.notifications);
  const dispatch = useDispatch();

  return (
    <div className="notifications">
      {notifications.map(notif => (
        <div key={notif.id} className={`notification ${notif.type}`}>
          <p>{notif.message}</p>
          <button onClick={() => dispatch(removeNotification(notif.id))}>×</button>
        </div>
      ))}
    </div>
  );
}
```

---

## 6. Redux DevTools & Debugging

### 6.1 Setup

Redux DevTools are **already built in** to Redux Toolkit:

```typescript
// app/store.ts
const store = configureStore({
  reducer: { /* ... */ },
  devTools: process.env.NODE_ENV === 'development', // Already on
});
```

### 6.2 Using DevTools

1. **Install Redux DevTools browser extension**
2. **Open browser DevTools**
3. **Click "Redux" tab**
4. **Watch your app's state changes in real-time**

### 6.3 What You'll See

```
Actions Timeline:
├─ @@INIT
├─ auth/loginUser/pending
├─ auth/loginUser/fulfilled
├─ cart/addToCart
├─ products/setCategory
└─ ui/addNotification

State Panel:
{
  auth: { token, user, isLoading, error },
  cart: { items, total, itemCount },
  products: { filters },
  ui: { notifications, isDarkMode }
}

Action Details:
- Type: 'cart/addToCart'
- Payload: { id: '...', productId: '...', quantity: 1 }
- New State Diff
```

### 6.4 Time-Travel Debugging

**Superpowers of Redux DevTools:**

```
✅ Click on any action → see state at that point
✅ Step backwards through actions (undo)
✅ Dispatch test actions manually
✅ Export/import state snapshots
✅ Search for specific actions
✅ See exact state diffs
```

**Example debugging:**
```
1. User clicks "Add to Cart"
2. Cart doesn't update
3. Open DevTools
4. Look for "cart/addToCart" action
5. Check if action was dispatched
6. Check if state updated correctly
7. Done debugging in 30 seconds!
```

---

# PART B: RTK QUERY INTEGRATION

---

## 7. RTK Query Fundamentals

### 7.1 What is RTK Query?

**RTK Query** is a data fetching and caching layer built on top of Redux.

```
Redux (manages app state)
  ↓ (includes)
RTK Query (manages server state + caching)

Benefits:
✅ Automatic caching
✅ Request deduplication
✅ Automatic refetching
✅ Subscription-based cache lifetime
✅ Tag-based invalidation
✅ Built-in loading/error states
```

### 7.2 The API Slice

```typescript
// api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

// Base query with auth
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    // Get token from Redux auth state
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// Create API slice
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Products', 'Product', 'Orders', 'Order', 'Cart'],
  endpoints: (builder) => ({
    // Endpoints will be added here
  }),
});
```

### 7.3 Queries vs Mutations

**Queries (GET):**
- Fetch data
- Cached automatically
- Refetch on tag invalidation
- Can be re-run with different arguments

**Mutations (POST/PATCH/DELETE):**
- Modify data
- Not cached by default
- Trigger with `.trigger()` or manual action
- Used for optimistic updates

```typescript
// In api slice
endpoints: (builder) => ({
  // Query - fetches products
  getProducts: builder.query({
    query: () => '/products',
    providesTags: ['Products'],
  }),

  // Mutation - creates order
  createOrder: builder.mutation({
    query: (orderData) => ({
      url: '/orders',
      method: 'POST',
      body: orderData,
    }),
    invalidatesTags: ['Orders', 'Cart'],
  }),
})
```

### 7.4 Generated Hooks

RTK Query automatically generates hooks from endpoints:

```typescript
// Automatically created from endpoints
export const {
  useGetProductsQuery,        // Hook for getProducts query
  useGetProductByIdQuery,     // Hook for getProductById query
  useCreateOrderMutation,     // Hook for createOrder mutation
  useCancelOrderMutation,     // Hook for cancelOrder mutation
} = apiSlice;
```

**Using them in components:**

```typescript
// features/products/ProductList.tsx
function ProductList() {
  // useGetProductsQuery automatically:
  // ✅ Fetches on mount
  // ✅ Caches result
  // ✅ Tracks subscriptions
  // ✅ Returns { data, isLoading, error, refetch }
  const { data: products, isLoading, error } = useGetProductsQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading products</div>;

  return <div>{products?.map(p => <ProductCard key={p.id} product={p} />)}</div>;
}
```

---

## 8. RTK Query for E-Commerce

### 8.1 Products API

```typescript
// api/productsApi.ts
import { apiSlice } from './apiSlice';

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  inventory: number;
}

export interface ProductsResponse {
  data: Product[];
  total: number;
  page: number;
}

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all products with filters
    getProducts: builder.query<ProductsResponse, { page?: number; search?: string }>({
      query: ({ page = 1, search }) => ({
        url: '/products',
        params: { page, search },
      }),
      providesTags: (result) =>
        result
          ? [
              'Products',
              ...result.data.map(({ id }) => ({ type: 'Product' as const, id })),
            ]
          : ['Products'],
    }),

    // Get single product by ID
    getProductById: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product' as const, id }],
    }),

    // Update product (admin)
    updateProduct: builder.mutation<Product, { id: string; patch: Partial<Product> }>({
      query: ({ id, patch }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Product' as const, id },
        'Products',
      ],
    }),
  }),
});

export const { useGetProductsQuery, useGetProductByIdQuery, useUpdateProductMutation } =
  productsApi;
```

### 8.2 Orders API

```typescript
// api/ordersApi.ts
import { apiSlice } from './apiSlice';

export interface Order {
  id: string;
  items: { productId: string; quantity: number; price: number }[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered';
  createdAt: string;
}

export const ordersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get user's orders
    getMyOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: (result) =>
        result
          ? [
              'Orders',
              ...result.map(({ id }) => ({ type: 'Order' as const, id })),
            ]
          : ['Orders'],
    }),

    // Get single order
    getOrderById: builder.query<Order, string>({
      query: (id) => `/orders/${id}`,
      providesTags: (result, error, id) => [{ type: 'Order' as const, id }],
    }),

    // Create order
    createOrder: builder.mutation<Order, { items: any[]; shippingAddress: string }>({
      query: (orderData) => ({
        url: '/orders',
        method: 'POST',
        body: orderData,
      }),
      invalidatesTags: ['Orders', 'Cart'],
    }),
  }),
});

export const { useGetMyOrdersQuery, useGetOrderByIdQuery, useCreateOrderMutation } = ordersApi;
```

### 8.3 Using in Components

```typescript
// features/orders/OrderHistory.tsx
import { useGetMyOrdersQuery } from '../../api/ordersApi';

function OrderHistory() {
  // Fetches user's orders
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) return <div>Loading orders...</div>;
  if (error) return <div>Error loading orders</div>;

  return (
    <div>
      <h2>Your Orders</h2>
      {orders?.map(order => (
        <div key={order.id} className="order">
          <p>Order #{order.id}</p>
          <p>Status: {order.status}</p>
          <p>Total: ${order.total}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 9. Cache Management Deep Dive

### 9.1 How Caching Works

```
Component mounts
  ↓
useGetProductsQuery()
  ↓
RTK Query checks: "Is this cached?"
  ├─ YES: Return cached data
  └─ NO: Fetch from server
  ↓
Store result in cache
  ↓
Component re-renders with data
```

### 9.2 Tags: The Invalidation System

```typescript
// Tags define what data is related

// Query PROVIDES tags (what data it manages)
getProducts: builder.query({
  query: () => '/products',
  providesTags: ['Products'], // "This query provides Products"
}),

getProductById: builder.query({
  query: (id) => `/products/${id}`,
  providesTags: (result, error, id) => [
    { type: 'Product' as const, id } // "This query provides Product #123"
  ],
}),

// Mutation INVALIDATES tags (what becomes stale)
updateProduct: builder.mutation({
  query: ({ id, patch }) => ({
    url: `/products/${id}`,
    method: 'PATCH',
    body: patch,
  }),
  invalidatesTags: (result, error, { id }) => [
    { type: 'Product' as const, id }, // Specific product is stale
    'Products', // Product list is stale
  ],
}),
```

**How it works:**

```
1. User updates product #123
2. updateProduct mutation succeeds
3. RTK Query reads invalidatesTags
4. Finds all queries with matching tags:
   - getProductById(123) → has { type: 'Product', id: 123 }
   - getProducts() → has 'Products'
5. Marks both as stale
6. If component mounted: automatically refetch
7. If component unmounted: keep cache, refetch on remount
```

### 9.3 Manual Cache Updates (Optimistic Updates)

```typescript
// features/products/UpdateProductForm.tsx
import { useUpdateProductMutation } from '../../api/productsApi';
import { useAppDispatch } from '../../app/hooks';
import { apiSlice } from '../../api/apiSlice';

function UpdateProductForm({ productId }) {
  const dispatch = useAppDispatch();
  const [updateProduct] = useUpdateProductMutation();

  const handleUpdate = async (patch) => {
    // Update cache immediately (optimistic)
    const patchResult = dispatch(
      apiSlice.util.updateQueryData('getProductById', productId, (draft) => {
        Object.assign(draft, patch); // Immer makes this safe
      })
    );

    try {
      // Try to update server
      await updateProduct({ id: productId, patch }).unwrap();
      // Success! Cache was already updated
    } catch (error) {
      // Revert cache on failure
      patchResult.undo();
    }
  };

  return <form onSubmit={() => handleUpdate({ name: 'New Name' })}>...</form>;
}
```

---

## 10. Authentication Integration

### 10.1 Combining Redux Auth + RTK Query

```typescript
// api/baseQuery.ts
import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

export const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api',
  credentials: 'include',

  // Get token from Redux auth state
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
```

**Connection:**
```
1. User logs in (Redux auth slice)
2. Token stored in Redux state
3. RTK Query baseQuery reads token from Redux
4. All API requests include token in header
5. Server validates token
6. If 401: handle token refresh
```

### 10.2 Token Refresh Logic

```typescript
// api/baseQuery.ts
export const baseQueryWithReauth = async (args, api, extraOptions) => {
  // Try initial request
  let result = await baseQuery(args, api, extraOptions);

  // Check for 401 (token expired)
  if (result.error?.status === 401) {
    // Try to refresh token
    const refreshResult = await baseQuery(
      { url: '/auth/refresh', method: 'POST' },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      // Got new token, update Redux state
      api.dispatch(tokenUpdated(refreshResult.data));
      
      // Retry original request with new token
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh failed, logout
      api.dispatch(logout());
    }
  }

  return result;
};

// Use this as baseQuery instead
export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth, // Use wrapped version
  // ...
});
```

---

## 11. Advanced RTK Query Patterns

### 11.1 Pagination

```typescript
// Fetch different pages separately
function ProductListPaginated() {
  const [page, setPage] = useState(1);
  const { data, isFetching } = useGetProductsQuery({ page, limit: 20 });

  return (
    <>
      {data?.data.map(p => <ProductCard key={p.id} product={p} />)}
      <button
        onClick={() => setPage(p => p + 1)}
        disabled={isFetching || page >= (data?.pages || 1)}
      >
        Next Page {isFetching && '...'}
      </button>
    </>
  );
}
```

### 11.2 Dependent Queries

```typescript
// Fetch data that depends on other data
import { skipToken } from '@reduxjs/toolkit/query/react';

function OrderDetails({ orderId }: { orderId?: string }) {
  // First: get order
  const { data: order } = useGetOrderByIdQuery(orderId ?? skipToken);

  // Second: get products (only after order loaded)
  const productIds = order?.items.map(i => i.productId) ?? [];
  const { data: products } = useGetProductsByIdsQuery(productIds, {
    skip: !order, // Don't fetch if no order yet
  });

  if (!order) return <div>Loading...</div>;

  return (
    <div>
      {order.items.map(item => {
        const product = products?.find(p => p.id === item.productId);
        return (
          <div key={item.productId}>
            {product?.name} × {item.quantity}
          </div>
        );
      })}
    </div>
  );
}
```

### 11.3 Prefetching Data

```typescript
// Prefetch data before user navigates
function ProductList() {
  const dispatch = useAppDispatch();

  const handleHover = (productId: string) => {
    // Prefetch product details on hover
    dispatch(
      productsApi.endpoints.getProductById.initiate(productId)
    );
  };

  return (
    <div>
      {products?.map(product => (
        <div
          key={product.id}
          onMouseEnter={() => handleHover(product.id)}
        >
          {product.name}
        </div>
      ))}
    </div>
  );
}
```

---

## 12. Complete Project Setup

### 12.1 Full Store Configuration

```typescript
// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from '../api/apiSlice';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import productsReducer from '../features/products/productsSlice';
import uiReducer from '../features/ui/uiSlice';

export const store = configureStore({
  reducer: {
    // Redux slices (app state)
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    ui: uiReducer,

    // RTK Query (server state)
    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware),

  devTools: process.env.NODE_ENV === 'development',
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

### 12.2 Custom Typed Hooks

```typescript
// app/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

// Use throughout app instead of plain useDispatch/useSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <TSelected,>(
  selector: (state: RootState) => TSelected
) => useSelector<RootState, TSelected>(selector);
```

### 12.3 API Slice Setup

```typescript
// api/apiSlice.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../app/store';

const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Products', 'Product', 'Orders', 'Order', 'Cart'],
  endpoints: () => ({}), // Extended by other files
});
```

---

## 13. Real E-Commerce Implementation

### 13.1 Complete Login Flow

```typescript
// features/auth/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { loginUser } from './authSlice';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isLoading, error } = useAppSelector(state => state.auth);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    dispatch(loginUser({ email, password })).then((action) => {
      if (action.type === 'auth/loginUser/fulfilled') {
        navigate('/dashboard');
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 13.2 Shopping Cart Flow

```typescript
// features/cart/CartPage.tsx
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { updateQuantity, removeFromCart, clearCart } from './cartSlice';
import { useCreateOrderMutation } from '../../api/ordersApi';
import { addNotification } from '../ui/uiSlice';

function CartPage() {
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector(state => state.cart);
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const handleCheckout = async () => {
    try {
      await createOrder({
        items: items.map(i => ({ productId: i.productId, quantity: i.quantity })),
        shippingAddress: '123 Main St', // Get from form
      }).unwrap();

      dispatch(clearCart());
      dispatch(addNotification({
        type: 'success',
        message: 'Order created successfully!',
      }));

      // Navigate to order confirmation
    } catch (error: any) {
      dispatch(addNotification({
        type: 'error',
        message: error?.data?.message || 'Failed to create order',
      }));
    }
  };

  return (
    <div>
      <h2>Shopping Cart</h2>
      {items.map(item => (
        <div key={item.id}>
          <p>{item.name}</p>
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => dispatch(updateQuantity({
              productId: item.productId,
              quantity: parseInt(e.target.value),
            }))}
          />
          <button onClick={() => dispatch(removeFromCart(item.productId))}>
            Remove
          </button>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
      <button onClick={handleCheckout} disabled={isLoading || items.length === 0}>
        {isLoading ? 'Processing...' : 'Checkout'}
      </button>
    </div>
  );
}
```

### 13.3 Product Listing with Filters

```typescript
// features/products/ProductListPage.tsx
import { useGetProductsQuery } from '../../api/productsApi';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { setSearch, setCategory, setSortBy } from './productsSlice';

function ProductListPage() {
  const dispatch = useAppDispatch();
  const filters = useAppSelector(state => state.products.filters);
  const { data: productsData, isLoading } = useGetProductsQuery({
    page: 1,
    search: filters.search,
  });

  return (
    <div>
      <input
        type="text"
        value={filters.search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        placeholder="Search products..."
      />

      <select
        value={filters.category}
        onChange={(e) => dispatch(setCategory(e.target.value))}
      >
        <option value="all">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>

      <select
        value={filters.sortBy}
        onChange={(e) => dispatch(setSortBy(e.target.value as any))}
      >
        <option value="newest">Newest</option>
        <option value="price">Price</option>
        <option value="rating">Rating</option>
      </select>

      {isLoading ? (
        <div>Loading products...</div>
      ) : (
        <div className="product-grid">
          {productsData?.data.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
```

---

## 14. Common Mistakes & Solutions

### 14.1 Forgetting Middleware in Store

```typescript
// ❌ WRONG - Cache never updates
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  // Missing: middleware
});

// ✅ CORRECT
const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(apiSlice.middleware),
});
```

### 14.2 Tag Mismatch

```typescript
// ❌ WRONG - Tags don't match
getProducts: builder.query({
  query: () => '/products',
  providesTags: ['Products'],
}),

updateProduct: builder.mutation({
  query: ({ id, patch }) => ({
    url: `/products/${id}`,
    method: 'PATCH',
    body: patch,
  }),
  invalidatesTags: ['Product'], // Different tag!
}),

// ✅ CORRECT
getProducts: builder.query({
  query: () => '/products',
  providesTags: ['Products'],
}),

updateProduct: builder.mutation({
  query: ({ id, patch }) => ({
    url: `/products/${id}`,
    method: 'PATCH',
    body: patch,
  }),
  invalidatesTags: ['Products'], // Matches!
}),
```

### 14.3 Not Handling Async Errors

```typescript
// ❌ WRONG - No error handling
const handleLogin = () => {
  dispatch(loginUser({ email, password }));
  // Assuming it succeeded...
};

// ✅ CORRECT
const handleLogin = async () => {
  try {
    await dispatch(loginUser({ email, password })).unwrap();
    navigate('/dashboard');
  } catch (error) {
    dispatch(addNotification({
      type: 'error',
      message: 'Login failed',
    }));
  }
};
```

### 14.4 Mutating Redux State

```typescript
// ❌ WRONG - Direct mutation
reducers: {
  addItem: (state, action) => {
    state.items.push(action.payload); // Looks mutating
    // But Redux Toolkit + Immer handles it
    // Still works, but confusing!
  }
}

// ✅ CLEARER
reducers: {
  addItem: (state, action) => {
    // Redux Toolkit + Immer lets us "mutate"
    // It's actually creating new state
    state.items.push(action.payload);
  }
}
```

---

## 15. Mental Models & Architecture

### 15.1 How Everything Works Together

```
USER INTERACTION
    ↓
Component dispatches Redux action (loginUser)
    ↓
Redux calls API via createAsyncThunk
    ↓
API returns token + user
    ↓
Redux reducer stores in state.auth
    ↓
RTK Query prepareHeaders reads state.auth.token
    ↓
Next RTK Query request includes Authorization header
    ↓
Component reads from state.auth and state.api
    ↓
Renders with latest data
```

### 15.2 State Distribution

```
Redux Store:
{
  // Managed by you with reducers
  auth: {
    token,        ← RTK Query reads this
    user,         ← Components read this
    isLoading,
    error,
  },

  cart: {
    items,        ← Persisted to localStorage
    total,
  },

  products: {
    filters,      ← Used to build RTK Query params
  },

  ui: {
    notifications, ← Managed by actions
    isDarkMode,
  },

  // Managed automatically by RTK Query
  api: {
    queries: {
      'getProducts(undefined)': { data, status, timestamp },
      'getProductById("1")': { data, status, timestamp },
    },
    subscriptions: { /* component subscriptions */ },
    requests: { /* in-flight requests */ },
  }
}
```

### 15.3 The Complete Flow: Login → Browse → Checkout

```
PHASE 1: USER LOGS IN (Redux)
  1. User types email + password
  2. onClick → dispatch(loginUser({ email, password }))
  3. createAsyncThunk makes API call
  4. API returns { token, user }
  5. Reducer stores in state.auth
  6. Component reads state.auth.user → re-renders

PHASE 2: USER BROWSES PRODUCTS (RTK Query)
  1. ProductList mounts
  2. useGetProductsQuery() called
  3. RTK Query reads state.auth.token via prepareHeaders
  4. Makes GET /products with Authorization header
  5. Server responds with products
  6. RTK Query stores in state.api.queries['getProducts']
  7. Component reads data → renders products
  8. User hovers product → prefetch details

PHASE 3: USER ADDS TO CART (Redux)
  1. onClick → dispatch(addToCart(product))
  2. Reducer adds to state.cart.items
  3. localStorage updated
  4. Component re-renders
  5. dispatch(addNotification({ type: 'success' }))
  6. Notification shown

PHASE 4: USER CHECKS OUT (RTK Query)
  1. onClick → dispatch(createOrder(items))
  2. RTK Query mutation sends POST /orders
  3. Includes Authorization header (from state.auth.token)
  4. Server creates order
  5. RTK Query invalidates 'Orders' and 'Cart' tags
  6. useGetMyOrdersQuery refetches automatically
  7. useGetCartQuery refetches automatically
  8. Components show updated data
  9. Clear cart: dispatch(clearCart())
```

### 15.4 Redux DevTools View at Each Phase

```
PHASE 1: Login
┌─ @@INIT
├─ auth/loginUser/pending
├─ auth/loginUser/fulfilled
│  └─ state.auth = { token, user, isLoading: false }
└─ ui/addNotification

PHASE 2: Browse
├─ api/executeQuery/pending ('getProducts')
├─ api/executeQuery/fulfilled ('getProducts')
│  └─ state.api.queries['getProducts'] = { data: [...] }
└─ products/setSearch
  └─ state.products.filters.search = 'laptop'

PHASE 3: Add to Cart
├─ cart/addToCart
│  └─ state.cart.items = [..., newItem]
│  └─ localStorage = { cart: [...] }
└─ ui/addNotification
  └─ state.ui.notifications = [{ type: 'success', ... }]

PHASE 4: Checkout
├─ api/executeMutation/pending ('createOrder')
├─ api/executeMutation/fulfilled ('createOrder')
├─ api/invalidateTags
├─ api/executeQuery/pending ('getMyOrders')
├─ api/executeQuery/fulfilled ('getMyOrders')
├─ cart/clearCart
│  └─ state.cart.items = []
│  └─ localStorage.removeItem('cart')
└─ ui/addNotification
```

---

## Your Learning Timeline

### Tonight (3-4 hours)
**Read Sections 3-4**
- Redux Fundamentals
- Redux for E-Commerce (Auth + Cart slices)

Create files:
- `src/features/auth/authSlice.ts`
- `src/features/cart/cartSlice.ts`
- `src/app/store.ts`

### Tomorrow (3-4 hours)
**Read Sections 5-6**
- Advanced Patterns
- DevTools & Debugging

Create files:
- `src/features/products/productsSlice.ts`
- `src/features/ui/uiSlice.ts`
- `src/features/auth/LoginForm.tsx`
- `src/features/cart/CartSummary.tsx`

### Next Week (3-4 hours)
**Read Sections 7-10**
- RTK Query Fundamentals
- RTK Query for E-Commerce
- Cache Management
- Authentication Integration

Create files:
- `src/api/apiSlice.ts`
- `src/api/productsApi.ts`
- `src/api/ordersApi.ts`

### Week 2 (3-4 hours)
**Read Sections 11-15**
- Advanced Patterns
- Complete Implementation
- Common Mistakes

Implement:
- Full product listing with filters
- Shopping cart checkout
- Order history
- Pagination

---

## Quick Reference Guide

### Store Setup Template
```typescript
// app/store.ts
const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    products: productsReducer,
    ui: uiReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (gDM) => gDM().concat(apiSlice.middleware),
});
```

### Slice Template
```typescript
// features/[name]/[name]Slice.ts
const slice = createSlice({
  name: 'name',
  initialState: { /* ... */ },
  reducers: {
    action: (state, action) => { /* update state */ },
  },
  extraReducers: (builder) => {
    // Handle async thunks
  },
});

export const { action } = slice.actions;
export default slice.reducer;
```

### Query Template
```typescript
// api/[name]Api.ts
export const [name]Api = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getData: builder.query({
      query: () => '/endpoint',
      providesTags: ['Tag'],
    }),
    updateData: builder.mutation({
      query: (data) => ({
        url: '/endpoint',
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: ['Tag'],
    }),
  }),
});

export const { useGetDataQuery, useUpdateDataMutation } = [name]Api;
```

---

## Summary

This comprehensive guide covers **everything you need** to:

✅ **Master Redux** (tonight + tomorrow)
✅ **Master RTK Query** (next week)
✅ **Build production e-commerce** (week 2+)

Each section builds on previous ones. Follow systematically, and you'll have complete mastery!

**Start reading:** Section 3 (Redux Fundamentals) tonight.

Good luck! 🚀

