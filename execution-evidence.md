# Execution Evidence

**Run date:** 2026-08-06  
**Command:** `cd PrismStructure && npm test` (`npx playwright test`)  
**Result:** **16 passed**, 0 failed, 0 flaky (~3.1 min)

## Reports

| Artifact | Path |
|----------|------|
| HTML report | `PrismStructure/execution-reports/html-report/index.html` |
| JSON results | `PrismStructure/execution-reports/results.json` |

Open HTML report:

```bash
cd PrismStructure
npm run report
```

## Suite breakdown

| Project | Cases | Status |
|---------|-------|--------|
| UI (`ui-chromium`) | 8 | Passed |
| API (`api`) | 8 | Passed |

UI covers AC1 (register/login/profile + negatives including empty password) and AC2 (cart totals, CoD confirm×2 → My Invoices, confirm×1 with empty My Invoices, incomplete billing).  
API covers AC1 (register/login/token/cart + negatives) and AC2 (products/`cart_items`/invoice + contract negatives).
