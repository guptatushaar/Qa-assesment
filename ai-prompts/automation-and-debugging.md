# AI Prompts – Automation and Debugging

Prompts for Prism/Playwright structure, assertions, and failure analysis.

---

### Entry 1
- **Prompt:** Review PrismStructure page objects; find blockers for documented ACs.
- **AI Response Summary:** Missing `WebUtils.goto`; checkout tests skipped `proceed-2`; cart assertion used `cart_products`/`items` instead of `cart_items`; negative login/register waited for success URL.
- **Debugging Outcome:** Fixed helpers and assertions; reduced false failures before full suite re-run.

---

### Entry 2
- **Prompt:** Implement CoD flow with Confirm twice and assert invoice; add regression for Confirm once.
- **AI Response Summary:** First draft waited loosely after second Confirm; TC-UI-07 only checked payment-page `invoice-number` absence.
- **Debugging Outcome:** Later hardened — `confirmTwice()` fails closed on invoice-number **or** POST `/invoices`; TC-UI-07 also asserts My Invoices count is 0.

---

### Entry 3
- **Prompt:** From Playwright JSON report, why did API-AC2 smoke fail with item count 0?
- **AI Response Summary:** Add-to-cart likely succeeded but assertion looked at wrong property; OpenAPI/cart response uses `cart_items`.
- **Debugging Outcome:** Assertion requires `cart_items` only (no fallbacks); setup asserts add-product HTTP status.

---

### Entry 4
- **Prompt:** Keep workers serial and raise timeout for live SUT flakiness without hiding real bugs.
- **AI Response Summary:** `workers: 1`, 60s test timeout, 10s expect timeout, retries: 1.
- **Debugging Outcome:** Improves stability on public demo app while still failing on real AC breaks.

---

### Entry 5
- **Prompt:** Review suite for false-pass risks; harden waits/assertions without expanding Stretch scope.
- **AI Response Summary:** Flagged soft `.catch` waits, weak `0.00` total check, loose invoice rows, edit-address matching `proceed-3`.
- **Debugging Outcome:** Patched page objects + specs; full suite re-run **16 passed**. Recorded DEF-05 for the edit-address hang.

---

### Entry 6 — Few-shot (invoice detail)
- **Prompt:** Given this live `GET /invoices/{id}` JSON sample (`invoice_number: INV-2026000028`, `invoicelines[]`, `billing_*`, `subtotal`/`total`), deepen API-AC2 smoke with assertions. Stay within 8 cases — do not add a new test file.
- **AI Response Summary:** First draft guessed `line_items` and `INV-\d+` only.
- **Debugging Outcome / Validation:** Rejected `line_items` — live field is `invoicelines`. Added `expectInvoiceDetail()` + `InvoiceApi.getInvoice()`. Pattern `^INV-\d{4}\d+$` matches INV-&lt;year&gt;&lt;seq&gt;.

---

### Entry 7 — Chain-of-thought (logout) + dead-end
- **Prompt:** Think step-by-step: how does Toolshop invalidate a session on API and UI? Probe verbs on `/users/logout`, `/logout`, `/auth/logout`. Prove token death with the strongest protected call. Keep Core case count.
- **AI Response Summary:** Suggested `POST /users/logout` then re-call `POST /carts`.
- **Debugging Outcome / Validation (dead-end recorded):** POST `/users/logout` → **405**; `/logout` and `/auth/logout` → **404**. Correct path: **`GET /users/logout`** → 200. Cart `POST` still returned 201 without auth (weak proof). Pivot: assert `GET /users/me` 200 before logout and ≥401 after. UI: `nav-menu` → `nav-sign-out`. Deepened TC-UI-01/02 and API-AC1 smoke instead of adding cases.
