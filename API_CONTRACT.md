# Jam Window Bakery API Contract

## Conventions

- Base path: `/api/v1`.
- JSON uses `camelCase`.
- Prices and totals use integer minor units: `{ "amount": 650, "currency": "USD" }` means $6.50.
- Lists use `page` and `pageSize` query parameters. Responses return `items` and `pagination`.
- Authenticated requests use `Authorization: Bearer <accessToken>`.
- Errors use `{ "error": { "code": "PRODUCT_UNAVAILABLE", "message": "...", "details": [] } }`.

## Products And Categories

### `GET /products`

Query: `category`, `q`, `sort`, `page`, `pageSize`.

```json
{
  "items": [
    {
      "id": "prd_butter_swirl",
      "slug": "butter-swirl",
      "name": "Butter Swirl",
      "price": { "amount": 650, "currency": "USD" },
      "availability": "in_stock"
    }
  ],
  "pagination": { "page": 1, "pageSize": 12, "total": 1, "totalPages": 1 }
}
```

### `GET /products/{id}`

Returns the authoritative product, variant identifiers, media, ingredients/allergens supplied by the backend, and current stock messaging.

### `GET /categories`

Returns `{ "items": [{ "id": "cat_pastries", "slug": "pastries", "name": "Pastries" }] }`.

## Authentication

### `POST /auth/register`

Request: `{ "email": "baker@example.com", "password": "...", "name": "..." }`.

### `POST /auth/login`

Request: `{ "email": "baker@example.com", "password": "..." }`.

Both return `{ "accessToken": "...", "customer": { "id": "cus_...", "email": "...", "name": "..." } }`.

## Cart

### `GET /cart`

Requires authentication when the future backend uses customer carts. Guest-cart behavior is a future backend decision.

### `POST /cart/items`

Request: `{ "variantId": "var_...", "quantity": 1 }`.

### `PATCH /cart/items/{id}`

Request: `{ "quantity": 2 }`.

### `DELETE /cart/items/{id}`

Each cart response is authoritative for price, discount, availability, subtotal, and total.

## Orders And Payment Simulation

### `POST /orders`

Request: `{ "cartId": "cart_...", "contact": {}, "shippingAddress": {}, "fulfillment": "delivery", "idempotencyKey": "uuid" }`.

The future backend must safely treat a repeated idempotency key as the same submission. It validates stock and totals at order creation; a cart check is not a checkout guarantee.

### `GET /orders`

Returns the current customer order history.

### `GET /orders/{id}`

Returns the authoritative order, items, fulfillment status, and payment status.

Order status and payment status are separate enums. Examples: `pending`, `confirmed`, `fulfilled`, `cancelled` versus `unpaid`, `payment_pending`, `paid`, `payment_failed`, `refunded`.

The frontend mock payment is only a UI simulation. It never stores card credentials or represents a real payment attempt.

## Admin API

Admin APIs are proposed Go endpoints. Browser route guards are an experience aid only. Every request must be authenticated and authorized by Go.

### Session and authorization

`POST /admin/login` accepts `{ "email": "...", "password": "..." }` and, after rate limiting and credential verification, sets a `Secure`, `HttpOnly`, `SameSite` session cookie. It returns `{ "admin": { "id": "...", "name": "...", "email": "...", "permissions": ["products:write"] }, "expiresAt": "..." }`.

`POST /admin/logout` revokes the server session and clears the cookie. `GET /admin/me` returns the same current-session shape. Authentication does not imply permission. The backend must provide explicit permissions and enforce them for each operation.

Cookie-authenticated mutations must use Go-issued CSRF protection. Login errors must remain generic, session revocation must be supported, and no frontend-stored credential, token, or mock session is production security.

### Dashboard

`GET /admin/dashboard` returns:

```json
{
  "activeProductCount": 12,
  "lowStockProductCount": 2,
  "totalOrderCount": 0,
  "pendingOrderCount": 0,
  "recentOrders": []
}
```

Counts are operational metrics only. The frontend does not invent financial data.

### Products

`GET /admin/products?q=&category=&status=&sort=&page=&pageSize=` returns the standard paginated list shape. Product price uses integer IDR units:

```json
{
  "id": "prd_...",
  "name": "Butter Swirl",
  "slug": "butter-swirl",
  "description": "...",
  "category": "pastries",
  "price": { "amount": 650, "currency": "IDR" },
  "sku": "JW-PAS-001",
  "stockQuantity": 18,
  "availability": "in_stock",
  "publicationStatus": "active",
  "tags": ["bestseller"],
  "images": [],
  "updatedAt": "..."
}
```

`POST /admin/products`, `GET /admin/products/{id}`, and `PATCH /admin/products/{id}` use that product payload. `PATCH` may transition publication between `draft` and `active`, but it must reject transitions to or from `archived`; those transitions use the archive actions below. When variants exist, each variant owns its own ID, SKU, and stock quantity. Product-level stock must not duplicate variant stock ambiguously.

`DELETE /admin/products/{id}` is an archive or soft-delete action. Go must preserve immutable historical order snapshots and reject unsafe deletion.

`POST /admin/products/{id}/unarchive` restores an archived product as `draft`. Go must preserve the product history and must not publish the product automatically. The frontend prompts staff to review price, stock, and content before publishing.

### Categories

`GET|POST /admin/categories`, `PATCH /admin/categories/{id}`, and `DELETE /admin/categories/{id}` manage `{ name, slug, description, imageUrl, active }`. `PATCH` must not change `active`; use archive or unarchive actions. Go must reject archival or require product reassignment when a category still contains products.

`POST /admin/categories/{id}/unarchive` restores an archived category to `active`, making it available for new products again.

### Inventory, orders, and media

`GET /admin/inventory` and `POST /admin/inventory/adjustments` are future endpoints. An adjustment contains a variant ID, signed delta, reason, actor, timestamp, and before/after quantities. Go must make the mutation atomic and auditable.

`GET /admin/orders`, `GET /admin/orders/{id}`, and `PATCH /admin/orders/{id}/fulfillment` remain future endpoints. Payment and fulfillment status remain separate. Go supplies and enforces valid fulfillment transitions.

`POST /admin/media` will accept a file upload and return `{ id, url, alt, position }`. Go must authenticate and authorize uploaders, verify CSRF, enforce file-size and MIME limits, inspect dimensions, generate safe object keys, and return safe URLs. The mock adapter only creates browser-local temporary previews.

## Integration Notes

- The Go API owns prices, discounts, stock, totals, identity, authorization, validation, and order transitions.
- The frontend service contracts are replaceable adapters. UI components must never call a REST endpoint directly.
- Mock authentication is development-only and provides no security model.
