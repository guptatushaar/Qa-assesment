# API Test Scenarios — Toolshop

Base URL: `https://api.practicesoftwaretesting.com`  
Auth: Bearer `access_token` from `POST /users/login`

## AC1 — User Authentication & Cart Creation

| ID | Tag | Scenario | Request outline | Expected |
|----|-----|----------|-----------------|----------|
| API-AC1-01/02/03 | @smoke | Register, login, create cart | `POST /users/register` → `POST /users/login` → `POST /carts` | &lt;300 / 200 + `access_token` / cart `id` |
| API-AC1-04 | @regression | Duplicate email rejected | Second `POST /users/register` same email | ≥400 |
| API-AC1-05 | @regression | Wrong password rejected | `POST /users/login` bad password | ≥400 |
| API-AC1-06 | @regression | Weak password rejected | `POST /users/register` password=`weak` | ≥400 |

## AC2 — Product Selection & Invoice Generation

| ID | Tag | Scenario | Request outline | Expected |
|----|-----|----------|-----------------|----------|
| API-AC2-01/02/03 | @smoke | Products → add to cart → invoice | `GET /products` → `POST /carts/{id}` → `GET /carts/{id}` → `POST /invoices` | 200; `cart_items.length` &gt; 0; invoice id |
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

## Automation mapping

Implemented under `PrismStructure/tests/API Test/` using Playwright `request` fixture + `AuthApi` / `CartApi` / `InvoiceApi`.
