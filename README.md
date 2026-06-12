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

The SDK works in two modes depending on where your code is running.

**Development** — pass `baseUrl` pointing to your dev server:

```typescript
import { initArtis } from "artis-sdk";

const app = initArtis({
  baseUrl: "https://dev.yourstore.com",
  apiKey: process.env.ARTIS_API_KEY,
});
```

**Browser production** — omit `baseUrl` entirely. Requests automatically go to
`/api/v1/` relative to the domain the template is installed on. So if a
customer installs your template on `example.com`, all requests go to
`example.com/api/v1/`. If another customer installs it on
`another-example.com`, requests go to `another-example.com/api/v1/`.
No configuration needed.

**Server-side rendering or Node.js** — pass an absolute `baseUrl`.
```typescript
import { initArtis } from "artis-sdk";

const app = initArtis({
  baseUrl: "https://example.com",
  apiKey: process.env.ARTIS_API_KEY,
});
```

```typescript
import { initArtis } from "artis-sdk";

const app = initArtis({
  apiKey: process.env.ARTIS_API_KEY,
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

The API key identifies you as a licensed developer on every request. The user
token identifies the logged-in customer on top of that. The SDK holds the token
in memory — you are responsible for persisting it in your own storage.

### Register

Returns the new user and an access token.

```typescript
const res = await app.auth.register({
  firstname: "John",
  lastname: "Doe",
  email: "john@example.com",
  password: "password",
  password_confirmation: "password",
  phone: "08012345678",
});

if (res.success) {
  const { user, token } = res.data;
  app.setUserToken(token.access_token);
  // persist however your app handles it
  localStorage.setItem("artis_token", token.access_token);
}
```

### Login

```typescript
const res = await app.auth.login({
  email: "john@example.com",
  password: "password",
});

if (res.success) {
  app.setUserToken(res.data.token.access_token);
  localStorage.setItem("artis_token", res.data.token.access_token);
}
```

### Restore session on app boot

```typescript
// Option A — pass at init
const app = initArtis({
  apiKey: process.env.ARTIS_API_KEY,
  userToken: localStorage.getItem("artis_token") ?? undefined,
});

// Option B — set after init
const app = initArtis({ apiKey: process.env.ARTIS_API_KEY });
const token = localStorage.getItem("artis_token");
if (token) app.setUserToken(token);
```

### Get current user

```typescript
const res = await app.auth.me();
if (res.success) {
  console.log(res.data.fullname);
}
```

### Update profile

```typescript
const res = await app.auth.updateProfile({ firstname: "Jane" });
```

### Logout

```typescript
await app.auth.logout();
app.clearUserToken();
localStorage.removeItem("artis_token");
```

---

## Orders

```typescript
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
const calc = await app.cart.calculate({
  items: [{ product_id: 10, quantity: 2 }],
  delivery_type: "delivery",
});
```

---

## Bookings

```typescript
// Check available timeslots
const slots = await app.bookings.availability();

// Create a booking
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
{
  success: boolean;
  status: string;
  status_code: number;
  message: string;
  data: T;
}
```

Always check `success` before using `data`:

```typescript
const res = await app.products.getById(42);

if (res.success) {
  console.log(res.data.name); // typed as Product
} else {
  console.log(res.status_code); // e.g. 404
  console.log(res.message); // e.g. "Product not found"
}
```

---

## Pagination

Paginated endpoints return a nested pagination object inside `data`:

```typescript
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
const res = await app.orders.track("TEN-PAY-69ef51be845ff");

if (!res.success) {
  console.error(res.status_code, res.message);
  return;
}

console.log(res.data);
```

---

## TypeScript

All types are built in — no separate `@types` package needed.

Exported types include:

- Core: `ApiResponse`, `Pagination`, `PaginatedData`, `ArtisApiError`
- Auth: `User`, `Token`, `RegisterPayload`, `LoginPayload`, `UpdateProfilePayload`, `ResetPasswordPayload`, `SendOtp`, `VerifyAccount`, `RegisterResponse`, `LoginResponse`
- Storefront: `Category`, `HomePage`
- Products: `Product`, `ProductImage`, `ProductListParams`
- Orders: `OrderItemAddon`, `OrderItem`, `CreateOrderPayload`, `CreateOrderResponse`, `OrderTrackingItem`, `OrderTrackingTimelineEntry`, `OrderTrackingResponse`, `MyOrder`
- Cart: `CartItemInput`, `CartCalculatePayload`, `CartCalculatedItem`, `CartSummary`, `CartCalculationResponse`
- Bookings: `BookingAvailability`, `CreateBookingPayload`, `CreateBookingResponse`
- Business: `DaySchedule`, `OpeningHours`, `Business`, `Theme`, `Social`, `Settings`

```typescript
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

## Development

```bash
npm install
npm run build   # build once
npm run dev     # watch mode
npm run lint    # type check only
npm run test    # run tests
```

---

## Contributing

All contributions are welcome! If you find a bug or have a feature request, feel free to open an issue or a PR.

- Issues: [github.com/kaizen-Ai-Agent/artis-sdk/issues](https://github.com/kaizen-Ai-Agent/artis-sdk/issues)
- Pull requests: [github.com/kaizen-Ai-Agent/artis-sdk/pulls](https://github.com/kaizen-Ai-Agent/artis-sdk/pulls)

---

## License

MIT License — see the [LICENSE](https://github.com/kaizen-Ai-Agent/artis-sdk/blob/main/LICENSE) file for details.
