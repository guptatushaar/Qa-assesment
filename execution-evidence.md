# Execution Evidence

**Run date:** 2026-08-06  
**Command:** `cd PrismStructure && npm test` (`npx playwright test` + evidence collector)  
**Result:** **16 passed** (see `PrismStructure/execution-reports/results.json`)  
**Test identity:** Ritika Bansal · `ritikabansaltest+<stamp>@gmail.com` · `Valid#12345`

## Reports & screenshots

| Artifact | Path |
|----------|------|
| HTML report | `PrismStructure/execution-reports/html-report/index.html` |
| JSON results | `PrismStructure/execution-reports/results.json` |
| UI screenshots (pass/fail + step captures) | `PrismStructure/execution-reports/screenshots/` |
| Screenshot index | `PrismStructure/execution-reports/screenshots/INDEX.md` |

How evidence is collected:

1. Playwright `screenshot: 'on'` for UI tests (end-of-test capture) → copied into `screenshots/`.
2. Mid-flow `captureStep()` attachments on key AC assertions (profile, logout, errors, cart, Confirm×1/×2, INV format, invoices) — view these in the **HTML report**.
3. `scripts/collectEvidence.js` copies artifact PNGs into `execution-reports/screenshots/` after the run.

```bash
cd PrismStructure
npm test                 # runs suite + collects screenshots
npm run report           # HTML report (embeds attachments too)
npm run collect-evidence # re-copy screenshots from artifacts if needed
```

## Suite breakdown

| Project | Cases | Evidence |
|---------|-------|----------|
| UI (`ui-chromium`) | 8 | Screenshots + HTML/JSON (incl. logout + INV format) |
| API (`api`) | 8 | HTML/JSON (request/response; GET invoice detail + logout token kill) |

UI covers AC1 (register/login/profile/**logout** + negatives) and AC2 (cart totals, CoD confirm×2 → INV + My Invoices, confirm×1 empty My Invoices with late-hydration guard, incomplete billing).  
API covers AC1 (register/login/token/cart/**logout → me 401/403** + 4xx negatives) and AC2 (products/`cart_items`/invoice/**GET detail** + 4xx contract negatives).

## Review hardening (2026-08-06)

False-pass / flake fixes applied before this evidence run:

- Add-to-cart waits on cart **network** (not stale toast)
- Confirm×1 empty My Invoices waits 3s for late rows before asserting count 0
- API negatives require **4xx** (reject 5xx as infra)
- Wrong-password path asserts register succeeded and no `access_token`
- Register `goto` uses 15s timeout; cart waits for `proceed-2` before click
