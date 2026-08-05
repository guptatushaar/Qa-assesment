# Exploratory Testing Notes — Toolshop

SUT: https://practicesoftwaretesting.com/  
API: https://api.practicesoftwaretesting.com/api/documentation  
Session focus: new-user auth, cart, CoD checkout, invoice (UI + API)

## Charter

Explore whether a newly registered customer can complete Cash on Delivery checkout and obtain an invoice, and whether API mirrors the same lifecycle with the documented invoice payload.

## Observations

| Area | Observation | Risk / note |
|------|-------------|-------------|
| Registration | Country dropdown label is `Netherlands (the)`, not `Netherlands` | Automation/selectOption fails if label guessed |
| Registration | Postal code + house number trigger address auto-fill | Street/city/state may be read-only until lookup |
| Checkout | Steps: cart (`proceed-1`) → signed-in (`proceed-2`) → address (`proceed-3`) → payment | Skipping `proceed-2` breaks E2E scripts |
| Payment | **Confirm must be pressed twice** to generate invoice | Documented product quirk; single confirm = no invoice yet |
| My Invoices | After successful CoD, invoice appears under account invoices | AC2 UI verification target |
| API cart | Cart line items exposed as `cart_items` | Easy false fail if asserting `items` / `cart_products` |
| API invoice | Required billing fields + `payment_details` + `cart_id` | Guide fixture uses `billing_country: "TG"` |

## Time-boxed paths exercised

1. Happy path register → login → profile  
2. Duplicate email / wrong password  
3. Add two products → quantity change → totals  
4. CoD confirm×1 vs confirm×2  
5. API register → login → token → cart → add product → invoice  

## Follow-ups (not automated — Stretch)

- Search / category filters  
- Credit-card payment variants  
- Admin invoice search  
- Localization (language switcher)
