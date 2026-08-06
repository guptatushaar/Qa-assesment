# Execution Evidence

**Run date:** 2026-08-06  
**Command:** `cd PrismStructure && npm test` (`npx playwright test` + evidence collector)  
**Result:** see latest `PrismStructure/execution-reports/results.json` (**15 passed + 1 flaky** on live SUT retry — overall green / exit 0)

## Reports & screenshots

| Artifact | Path |
|----------|------|
| HTML report | `PrismStructure/execution-reports/html-report/index.html` |
| JSON results | `PrismStructure/execution-reports/results.json` |
| UI screenshots (pass/fail + step captures) | `PrismStructure/execution-reports/screenshots/` |
| Screenshot index | `PrismStructure/execution-reports/screenshots/INDEX.md` |

How evidence is collected:

1. Playwright `screenshot: 'on'` for UI tests (end-of-test capture).
2. Mid-flow `captureStep()` attachments on key AC assertions (profile, logout, errors, cart, Confirm×1/×2, INV format, invoices).
3. `scripts/collectEvidence.js` copies PNGs into `execution-reports/screenshots/` after the run.

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

UI covers AC1 (register/login/profile/**logout** + negatives) and AC2 (cart totals, CoD confirm×2 → INV + My Invoices, confirm×1 empty My Invoices, incomplete billing).  
API covers AC1 (register/login/token/cart/**logout → me ≥401** + negatives) and AC2 (products/`cart_items`/invoice/**GET detail** + contract negatives).
