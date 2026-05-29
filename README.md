# artis-sdk

Official JavaScript/TypeScript SDK for the Artis platform.
Works in Node.js, Next.js, Vue, Svelte, Express — anywhere JavaScript runs.

---

## Install

```bash
npm install artis-sdk
```

---

## Setup

```typescript
import { initArtis } from "artis-sdk";

const app = initArtis({
  baseUrl: "https://api.yourstore.com",
  apiKey: process.env.ARTIS_API_KEY,
  env: "prod", // 'local' | 'testing' | 'prod' | 'live'
});
```

Call `initArtis` once and reuse the `app` instance across your project.

---

## Modules

The SDK exposes these modules:

- `storefront`
- `products`
- `auth`
- `orders`
- `cart`
- `bookings`
- `business`

---

## Storefront

```typescript
// Everything needed for the homepage in one call
const home = await app.storefront.getHome();

// All active categories
const categories = await app.storefront.getCategories();

// Single category by id or slug
const category = await app.storefront.getCategory(1);
const category = await app.storefront.getCategoryBySlug("bread");

// All images in the gallery
const gallery = await app.storefront.getGallery();
```

---

## Products

```typescript
// Paginated list
const products = await app.products.list({ page: 1, per_page: 20 });

// With filters and sorting
const products = await app.products.list({
  featured: true,
  category: "bag",
  page: 1,
});

// Single product by id or slug
const product = await app.products.getById(42);
const product = await app.products.getBySlug("sourdough-bread");

// Search
const results = await app.products.search("sourdough");
```

---

## Auth

The API key identifies your store on every request. The user token identifies
the logged-in customer on top of that. The SDK holds the token in memory —
you are responsible for persisting it in your own storage.

### Register

Returns the new user and an access token.

```typescript
// Register a new user and get an access token in response
const res = await app.auth.register({
  firstname: "John",
  lastname: "Doe",
  email: "john@example.com",
  password: "password",
  password_confirmation: "password",
  phone: "08012345678",
});

// Set the token so subsequent requests go out authenticated
if (res.success) {
  const { user, token } = res.data;
  app.setUserToken(token.access_token);
  localStorage.setItem("artis_token", token.access_token);
}
```

### Login

Returns an access token. Call `setUserToken` immediately after so all
subsequent requests go out authenticated.

```typescript
// Login an existing user and get an access token in response
const res = await app.auth.login({
  email: "john@example.com",
  password: "password",
});

// Set the token so subsequent requests go out authenticated
if (res.success) {
  app.setUserToken(res.data.token.access_token);
  localStorage.setItem("artis_token", res.data.token.access_token);
}
```

### Restore session on app boot

If you have a token stored from a previous session, pass it at init time
or call `setUserToken` after init:

```typescript
// Option A — pass at init
const app = initArtis({
  baseUrl: "https://api.yourstore.com",
  apiKey: process.env.ARTIS_API_KEY,
  userToken: localStorage.getItem("artis_token") ?? undefined,
});

// Option B — set after init
const app = initArtis({ baseUrl: "...", apiKey: "..." });
const token = localStorage.getItem("artis_token");
if (token) app.setUserToken(token);
```

### Get current user

```typescript
// Get the currently logged-in user's details
const res = await app.auth.me();
if (res.success) {
  console.log(res.data.fullname);
}
```

### Update profile

```typescript
// Update the logged-in user's profile
const res = await app.auth.updateProfile({ firstname: "Jane" });
```

### Logout

```typescript
// Log out the current user and clear the token
await app.auth.logout();
app.clearUserToken();
localStorage.removeItem("artis_token");
```

---

## Orders

```typescript
// Create a new order
const order = await app.orders.create({
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "08012345678",
  delivery_type: "delivery",
  delivery_address: "12 Cocoa Street, Ibadan",
  delivery_date: "2026-05-01",
  payment_channel: "paystack",
  items: [{ product_id: 4, variant_combination_id: 143, quantity: 2 }],
});
```

---

## Cart

```typescript
// Calculate the total for a cart before checkout
const calc = await app.cart.calculate({
  items: [{ product_id: 10, quantity: 2 }],
  delivery_type: "delivery",
});
```

---

## Bookings

```typescript
// Check available timeslots for consultations or appointments
const slots = await app.bookings.availability();

// Create a new booking for a consultation or appointment
const booking = await app.bookings.create({
  customer_name: "Jane Doe",
  customer_email: "jane@example.com",
  customer_phone: "+34600123456",
  timeslot_id: 1,
  consultation_type: "wedding_cake",
  notes: "Looking for a 3-tier rustic design.",
});
```

---

## Response shape

Every method returns the full `ApiResponse<T>` envelope:

```typescript
// Generic API response shape
{
  success: boolean;
  status: string; // e.g. "success"
  status_code: number; // e.g. 200
  message: string; // human-readable
  data: T;
}
```

Always check `success` before using `data`:

```typescript
// Example: get a product by id and handle success and error cases
const res = await app.products.getById(42);

// Handle success case
if (res.success) {
  console.log(res.data.name); // typed as Product
} else {
  // Handle error case
  console.log(res.status_code); // e.g. 404
  console.log(res.message); // e.g. "Product not found"
}
```

---

## Pagination

Paginated endpoints return a nested pagination object inside `data`:

```typescript
// Generic paginated response shape
{
  data: T[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}
```

---

## Error handling

The SDK returns the API response envelope and does not throw by default.
Check `success` and handle errors using `status_code` and `message`.

```typescript
// Example: tracking an order that doesn't exist
const res = await app.orders.track("TEN-PAY-69ef51be845ff");

// Handle error case
if (!res.success) {
  console.error(res.status_code, res.message);
  return;
}

// Handle success case
console.log(res.data);
```

---

## TypeScript

All types are built in — no separate `@types` package needed.

Exported types include:

- Core: `ApiResponse`, `Pagination`, `PaginatedData`, `ArtisApiError`
- Auth: `User`, `Token`, `RegisterPayload`, `LoginPayload`, `UpdateProfilePayload`, `RegisterResponse`, `LoginResponse`
- Storefront: `Category`, `HomePage`
- Products: `Product`, `ProductImage`, `ProductListParams`
- Orders: `OrderItemAddon`, `OrderItem`, `CreateOrderPayload`, `CreateOrderResponse`, `OrderTrackingItem`, `OrderTrackingTimelineEntry`, `OrderTrackingResponse`, `MyOrder`
- Cart: `CartItemInput`, `CartCalculatePayload`, `CartCalculatedItem`, `CartSummary`, `CartCalculationResponse`
- Bookings: `BookingAvailability`, `CreateBookingPayload`, `CreateBookingResponse`
- Business: `DaySchedule`, `OpeningHours`, `Business`, `Theme`, `Social`, `Settings`

```typescript
// Example: importing types for type annotations
import type {
  ApiResponse,
  PaginatedData,
  Product,
  Category,
  LoginResponse,
  CreateOrderPayload,
  CartCalculationResponse,
} from "artis-sdk";
```

---

## Environment switching

```typescript
// local / testing → prepends test- to the subdomain
initArtis({ baseUrl: "https://api.artis.com", apiKey: "...", env: "testing" });
// requests go to → https://test-api.artis.com

// prod / live → uses baseUrl as-is
initArtis({ baseUrl: "https://api.artis.com", apiKey: "...", env: "prod" });
// requests go to → https://api.artis.com
```

---

## Development

```bash
npm install
npm run build   # build once
npm run dev     # watch mode
npm run lint    # type check only
npm run test    # run tests
```

## Publishing

```bash
npm run build
npm publish --access public
```
