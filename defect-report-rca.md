# Defect Report / Root Cause Analysis

Defects and quirks found while building Core automation. Includes product quirks and automation false-fails (useful for showing AI validation).

---

## DEF-01 — Invoice requires Confirm twice (product quirk)

| Field | Detail |
|-------|--------|
| Severity | Medium (UX / documented behavior) |
| Area | UI Checkout — Cash on Delivery |
| Steps | Complete CoD payment → click **Confirm** once |
| Actual | Invoice number / My Invoices entry not created yet |
| Expected (naive) | One Confirm completes order |
| Expected (per assessment) | Press Confirm **twice** to generate invoice |
| RCA | Application payment finish handler appears to require a second confirmation before creating the invoice entity |
| Evidence | Manual explore + TC-UI-06 (×2) / TC-UI-07 (×1) |
| Status | Accepted as known behavior; covered by smoke + regression |

---

## DEF-02 — Country option label mismatch broke registration automation

| Field | Detail |
|-------|--------|
| Severity | High (blocker for UI suite) |
| Area | UI Registration |
| Steps | `selectOption({ label: 'Netherlands' })` |
| Actual | Timeout; option not found |
| Expected | Country selected |
| RCA | Live DOM option text is **`Netherlands (the)`**. AI/script assumed short label without checking snapshot |
| Fix | Map Netherlands → `Netherlands (the)`; reorder form to country → postal → house (auto-fill) |
| Validation lesson | Always validate AI selectors against Playwright snapshot / headed run |
| Status | Fixed in `RegisterPage` |

---

## DEF-03 — Cart assertion used wrong JSON field (automation false fail)

| Field | Detail |
|-------|--------|
| Severity | Medium |
| Area | API GET cart after add product |
| Steps | Add product → GET `/carts/{id}` → assert line items length |
| Actual | Assertion saw `0` via `cart_products` / `items` |
| Expected | ≥1 line item |
| RCA | Response uses **`cart_items`**. AI-generated assertion guessed alternate names |
| Fix | Assert `toHaveProperty('cart_items')` and length &gt; 0 (no `cart_products` / `items` fallbacks); assert add-product HTTP status in setup |
| Status | Fixed in `02_invoiceTest.spec.js` |

---

## DEF-04 — Missing `WebUtils.goto` (framework gap)

| Field | Detail |
|-------|--------|
| Severity | Critical (all UI navigation via WebUtils) |
| Area | `UI/utilities/webUtils.js` |
| Actual | `this.web.goto is not a function` |
| RCA | Page objects called `goto` but helper never implemented; starter assumed method existed |
| Fix | Implement `goto` wrapping `page.goto` + logger |
| Status | Fixed |

---

## DEF-05 — Edit-address locator matched disabled Proceed (automation false hang)

| Field | Detail |
|-------|--------|
| Severity | High (UI-AC2 smoke timeout) |
| Area | `CheckoutPage.editAddressButton` |
| Steps | Broad locator `app-address` button / `getByRole('button').first()` during billing fill |
| Actual | Resolved to disabled `[data-test="proceed-3"]`; click retried until test timeout |
| Expected | Click only the address **edit** control (or skip if profile address already valid) |
| RCA | Over-broad button locator inside `app-address` also matched Proceed |
| Fix | Use `[data-test="edit-address"], app-address .float-end` only; never match `proceed-3` |
| Status | Fixed; suite green after change |

---

## Summary for evaluators

These items show **validation of AI output**: several failures were not “SUT down” but incorrect assumptions in generated/starter code. Fixes were driven by live DOM snapshots and OpenAPI, then recorded in `ai-prompts/automation-and-debugging.md`.
