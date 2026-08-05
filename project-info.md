# Project Info — QA AI Capability Exercise

**Primary AI Tool(s) Used:** Cursor (Composer / Auto for planning docs; coding model for Playwright Prism automation)  
**Application Under Test:** PracticeSoftwareTesting Toolshop — Registration, Checkout & Invoice Flow  
**UI SUT:** https://practicesoftwaretesting.com/  
**API SUT:** https://api.practicesoftwaretesting.com/api/documentation  
**Repository folder:** `Tushaar_qa-ai-practical-assessment-main`  
**Assessment Start Date:** 2026-08-05  
**Submission Date:** 2026-08-06  
**Public repository:** https://github.com/guptatushaar/Qa-assesment  
**Candidate:** Tushaar Gupta  
**Primary test identity:** first/last = Tushaar / Gupta; password = `Valid#12345` (meets API rules: upper, lower, number, symbol); email base = `tushaarguptatest@gmail.com` (automation uses `tushaarguptatest+<stamp>@gmail.com` so each run stays unique)

---

## 1. What is this project about

This is a Core QA mini-project that demonstrates an AI-assisted testing workflow on the Toolshop ecommerce app. Scope covers **UI** (register → login → cart → Cash on Delivery checkout with **double Confirm** for invoice) and **API** (register → login → bearer token → cart → products → invoice generation with the documented payload). Tests are tagged `@smoke` / `@regression` and kept to a small, maintainable set (5–8 per tier).

## Project Summary

Focus is new-user registration, authenticated checkout, and invoice verification (UI My Invoices + API `/invoices`), with intentional negative paths for duplicate email, bad password, incomplete billing, and invalid invoice payloads.

## Tools Used

| Area | Tools |
|------|--------|
| Browsers | Chromium (Playwright) |
| UI + API automation | Playwright Test (Prism-style page objects + API helpers) |
| Test data | Unique email stamps + shared `commonUtils/utils.js` + `API/testdata/invoicePayload.json` |
| AI | Cursor (planning on Auto/lighter models; automation/debug on coding model) |
| Evidence | `PrismStructure/execution-reports/` (HTML + JSON) |

## Setup Summary — AI Workflow Foundation (Part A)

### 1. How project and SUT context is provided to the tool

- Paste Part A/B guide excerpts, AC1/AC2 wording, and SUT URLs into Cursor.
- Point the agent at `PrismStructure/` (Playwright config, page objects, API helpers) and OpenAPI docs URL.
- Prefer short, single-task prompts (one phase per chat) to stay within token limits.

### 2. How AI is used for requirement analysis

- Extract AC1/AC2 into testable objectives and risks (auth uniqueness, checkout state steps, double-confirm invoice quirk, API required fields).
- Distinguish UI state machine (cart → sign-in → address → payment → confirm×2) from API lifecycle (register → login → cart → add product → invoice).

### 3. How AI is used for test planning and strategy

- **UI vs API:** UI for journey + visual invoice; API for auth token, cart integrity, invoice contract.
- **Smoke:** happy-path register/login/profile, multi-item cart totals, CoD invoice, API register/login/cart, API invoice happy path.
- **Regression:** duplicate email, wrong password, single Confirm (no invoice yet), incomplete billing, missing billing field, invalid `cart_id`.

### 4. How AI is used for manual test case design

- Generate CSV rows for functional / negative / edge cases, then trim to 5–8 rows covering smoke + regression only.
- Validate each row against ACs and the double-confirm known behavior before accepting.

### 5. How AI is used for automation design

- Prism layout: `UI/pageobjects`, `UI/utilities`, `API/pageobjects`, `API/utilities`, `commonUtils`, `tests/UI Test`, `tests/API Test`.
- Shared `generateUniqueUser()` and `validInvoicePayload(cartId)` aligned with documented invoice body (`billing_country: "TG"`).

### 6. How AI-generated cases and scripts are validated

- Run smoke then full suite; fix selectors against live `data-test` attributes.
- Reject unreviewed output (e.g. wrong cart item field names, missing `proceed-2`, `WebUtils.goto` gaps).
- Keep count within 5–8 automated cases per UI and API tier.

### 7. How AI is used for test data generation

- Tushaar Gupta identity; fixed strong password `Valid#12345`; unique emails via `tushaarguptatest+<stamp>@gmail.com`.
- Invoice payload cloned from assessment example; `cart_id` injected at runtime.

### 8. How AI is used for debugging

- Interpret Playwright HTML/JSON reports and `error-context.md`.
- Cross-check failures with API OpenAPI (`/docs`) for `cart_items`, invoice required fields, and auth endpoints.

### 9. What is avoided sharing with AI tools

- Secrets, personal credentials, production tokens, internal customer data.
- Full proprietary corporate docs beyond this public assessment guide.
- Unnecessary PII in prompts; use synthetic Toolshop users only.

### 10. How this workflow is reused on a real project

1. Feed ticket/AC + SUT context.  
2. Risk + smoke/regression split.  
3. Manual CSV + traceability.  
4. Automate core lifecycle only.  
5. Record prompts in `ai-prompts/`.  
6. Execute → evidence → iterative commits.  
7. Reflect in `project-info.md` / summary prompts.

## Requirement & Risk Analysis (summary)

| Area | Risk | Mitigation |
|------|------|------------|
| Registration | Duplicate email / weak password / DOB age rules | Unique emails; valid password; fixed adult DOB |
| Login | Invalid credentials still “succeed” in flaky waits | Negative tests use `expectSuccess: false` |
| Cart | Race when adding products | Wait for toast **or** cart API response after add |
| Checkout | Missing `proceed-2`; address incomplete | Explicit step clicks; incomplete-address regression + `expect.poll` on Proceed |
| Invoice UI | Confirm once does not create invoice | Confirm×1 asserts payment page + empty My Invoices; Confirm×2 fails closed |
| Invoice API | Wrong payload / empty cart | Fixture payload; assert `cart_items` property (no field-name fallbacks) |

## Coverage Matrix (Smoke / Regression)

| Tier | Smoke | Regression |
|------|-------|------------|
| Manual (8) | TC-M-01/02/03; TC-M-07/08 (API) | TC-M-04/05/06 |
| UI automation (8) | TC-UI-01/02, TC-UI-05, TC-UI-06 | TC-UI-03, TC-UI-04, TC-UI-07, TC-UI-08, TC-UI-09 |
| API automation (8) | API-AC1-01/02/03, API-AC2-01/02/03 | API-AC1-04/05/06, API-AC2-04/05/06 |

### Manual ↔ automation traceability

Manual CSV stays within the **5–8** guide cap and maps to ACs as follows:

| Manual | Covers | Automation |
|--------|--------|------------|
| TC-M-01/02 | UI AC1 register/login/profile | TC-UI-01/02 |
| TC-M-03 | UI AC2 cart qty + CoD confirm×2 + My Invoices | TC-UI-05 + TC-UI-06 |
| TC-M-04 | Duplicate email | TC-UI-03 |
| TC-M-05 | Incomplete billing / invalid transition | TC-UI-08 |
| TC-M-06 | Confirm×1 quirk (no invoice yet) | TC-UI-07 |
| TC-M-07/08 | API AC1 + AC2 happy path | API-AC1-01/02/03, API-AC2-01/02/03 |

**Automation-only regressions** (kept out of CSV to stay ≤8 manual rows; still in PrismStructure with `@regression`):

- TC-UI-04 wrong password; TC-UI-09 empty password  
- API-AC1-04/05/06 (duplicate email, wrong password, weak password)  
- API-AC2-04/05/06 (missing billing field, invalid `cart_id`, no bearer token)  

These deepen invalid-transition coverage without duplicating every negative into the manual suite.
