# API Test Scenarios — Toolshop

Base URL: `https://api.practicesoftwaretesting.com`  
Auth: Bearer `access_token` from `POST /users/login`

## AC1 — User Authentication & Cart Creation

| ID | Tag | Scenario | Request outline | Expected |
|----|-----|----------|-----------------|----------|
| API-AC1-01/02/03 | @smoke | Register, login, create cart, logout | `POST /users/register` → `POST /users/login` → `POST /carts` → `GET /users/me` → `GET /users/logout` → `GET /users/me` | &lt;300 / 200 + `access_token` / cart `id` / me 200 then ≥401 after logout |
| API-AC1-04 | @regression | Duplicate email rejected | Second `POST /users/register` same email | ≥400 |
| API-AC1-05 | @regression | Wrong password rejected | `POST /users/login` bad password | ≥400 |
| API-AC1-06 | @regression | Weak password rejected | `POST /users/register` password=`weak` | ≥400 |

## AC2 — Product Selection & Invoice Generation

| ID | Tag | Scenario | Request outline | Expected |
|----|-----|----------|-----------------|----------|
| API-AC2-01/02/03 | @smoke | Products → cart → invoice → GET detail | `GET /products` → `POST /carts/{id}` → `GET /carts/{id}` → `POST /invoices` → `GET /invoices/{id}` | 200; `cart_items.length` &gt; 0; invoice id; `invoicelines`; billing match; `INV-<year><seq>`; totals &gt; 0 |
| API-AC2-04 | @regression | Missing required billing field | Invoice body without `billing_country` | ≥400 |
| API-AC2-05 | @regression | Invalid cart_id | Invoice with fake `cart_id` | ≥400 |
| API-AC2-06 | @regression | Invoice without bearer token | `POST /invoices` no Authorization | ≥401 |

## Invoice body (from assessment guide)

```json
{
  "billing_street": "Zoey Shore",
  "billing_city": "Hesselbury",
  "billing_state": "Florida",
  "billing_country": "TG",
  "billing_postal_code": "1234AA",
  "payment_method": "cash-on-delivery",
  "cart_id": "<runtime-cart-id>",
  "payment_details": {}
}
```

## Invoice detail assertions (live SUT)

`GET /invoices/{id}` returns (among other fields): `invoice_number` (`INV-2026######`), `billing_*` matching POST body, `invoicelines[]` with product + quantity, `subtotal` / `total`.

## Logout note

Logout is **`GET /users/logout`** (POST returns 405). After logout, `GET /users/me` and authenticated invoice calls return ≥401.

## Automation mapping

Implemented under `PrismStructure/tests/API Test/` using Playwright `request` fixture + `AuthApi` / `CartApi` / `InvoiceApi`.
