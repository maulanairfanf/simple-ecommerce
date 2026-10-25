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

### `GET /products/{slug}`

Returns the public product detail for an active product, including media and current stock messaging. The slug route is used by the storefront, for example `/shop/butter-croissant`. Archived or missing products return `404`.

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

The admin product API uses the `/admin/products` resource and returns an envelope with `status`, `data`, and `message`. Product price is an integer IDR amount. Categories are submitted as category IDs and returned as category objects.

#### `GET /admin/products`

Returns a product array:

```json
{
  "status": 200,
  "data": [
    {
      "id": 35,
      "name": "Butter Croissant",
      "slug": "butter-croissant",
      "quantity": 24,
      "categories": [
        {
          "id": 22,
          "name": "Pastries",
          "slug": "pastries",
          "status": "active",
          "created_at": "2026-10-15T20:43:36.199197+07:00",
          "updated_at": "2026-10-25T12:49:13.167645+07:00"
        }
      ],
      "price": 35000,
      "description": "Flaky buttery croissant baked fresh every morning",
      "sku": "PAS-CRO-001",
      "publication_status": "active",
      "image": "https://example.com/products/butter-croissant.webp",
      "created_at": "2026-10-25T12:51:23.010188+07:00",
      "updated_at": "2026-10-25T12:51:23.010188+07:00"
    }
  ],
  "message": "success"
}
```

#### `GET /admin/products/{id}`

Returns the same product object inside `data`.

#### `POST /admin/products`

Accepts `multipart/form-data` with these fields:

```text
name: Butter Croissant
slug: butter-croissant
quantity: 24
price: 35000
description: Flaky buttery croissant baked fresh every morning
sku: PAS-CRO-001
tags: pastry
tags: bestseller
categories: 22
publication_status: active
image: <file>
```

`tags` and `categories` may be repeated for multiple values. The response contains the created product in `data`.

#### `PUT /admin/products/{id}`

Accepts the same `multipart/form-data` fields as create and replaces the product fields. The response contains the updated product in `data`.

#### `PATCH /admin/products/{id}/publication_status`

Updates only publication status:

```json
{ "publication_status": "archived" }
```

Valid values are `active` and `archived`. Unarchiving uses `active`.

#### `DELETE /admin/products/{id}`

Deletes the product. Go must reject deletion when the product is referenced by immutable historical order data.

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
