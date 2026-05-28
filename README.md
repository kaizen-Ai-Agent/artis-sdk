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
  localStorage.setItem("artis_token", token.access_token);
}
```

### Login

Returns an access token. Call `setUserToken` immediately after so all
subsequent requests go out authenticated.

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

---

## Response shape

Every method returns the full `ApiResponse<T>` envelope:

```typescript
{
  success: boolean;
  status: number;
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
  console.log(res.status); // e.g. 404
  console.log(res.message); // e.g. "Product not found"
}
```

---

## TypeScript

All types are built in — no separate `@types` package needed.

```typescript
import type {
  ApiResponse,
  HomePage,
  Product,
  Category,
  PaginatedData,
  User,
  LoginResponse,
  RegisterResponse,
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
