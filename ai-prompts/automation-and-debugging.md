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
