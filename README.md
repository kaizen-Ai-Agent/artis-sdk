# artis-sdk

Official JavaScript/TypeScript SDK for the Artis platform.
Works in Node.js, Next.js, Vue, Svelte, Express — anywhere JavaScript runs.

## Install

```bash
npm install artis-sdk
```

## Setup

```typescript
import { initArtis } from 'artis-sdk'

const app = initArtis({
  baseUrl: 'https://api.yourstore.com',
  apiKey: process.env.ARTIS_API_KEY,
  env: 'prod', // 'local' | 'testing' | 'prod' | 'live'
})
```

Call `initArtis` once and reuse the `app` instance across your project.

## Storefront

```typescript
// Everything needed for the homepage in one call
const home = await app.storefront.getHome()

// All active categories
const categories = await app.storefront.getCategories()

// Single category
const category = await app.storefront.getCategory(1)
const category = await app.storefront.getCategoryBySlug('bread')

// Products under a category
const products = await app.storefront.getCategoryProducts(1, { page: 1, per_page: 20 })
```

## Products

```typescript
// Paginated list
const products = await app.products.list({ page: 1, per_page: 20 })

// With filters
const products = await app.products.list({ category_id: 2, sort: 'price_asc' })

// Single product
const product = await app.products.getById(42)
const product = await app.products.getBySlug('sourdough-bread')

// Search
const results = await app.products.search('sourdough')

// Featured and latest
const featured = await app.products.getFeatured()
const latest   = await app.products.getLatest()
```

## Error handling

```typescript
import { ArtisApiError } from 'artis-sdk'

try {
  const product = await app.products.getById(999)
} catch (err) {
  if (err instanceof ArtisApiError) {
    console.log(err.status)  // 404
    console.log(err.message) // "Product not found"
  }
}
```

## TypeScript

All types are built in — no separate `@types` package needed.

```typescript
import type { HomePage, Product, Category, PaginatedData } from 'artis-sdk'
```

## Environment switching

```typescript
// local / testing → prepends test- to the subdomain
initArtis({ baseUrl: 'https://api.artis.com', apiKey: '...', env: 'testing' })
// sends requests to → https://test-api.artis.com

// prod / live → uses baseUrl as-is
initArtis({ baseUrl: 'https://api.artis.com', apiKey: '...', env: 'prod' })
// sends requests to → https://api.artis.com
```

## Development

```bash
npm install
npm run build   # build once
npm run dev     # watch mode
npm run lint    # type check only
```

## Publishing

```bash
cd packages/core
npm publish --access public
```
