# Execution Evidence

**Run date:** 2026-08-05  
**Command:** `cd PrismStructure && npx playwright test`  
**Result:** **13 passed**, 0 failed, 0 flaky (~3.8 min)

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
| UI (`ui-chromium`) | 7 | Passed |
| API (`api`) | 6 | Passed |

UI covers AC1 (register/login/profile + negatives) and AC2 (cart, CoD confirm×2 → My Invoices, confirm×1 quirk, incomplete billing).  
API covers AC1 (register/login/token/cart + negatives) and AC2 (products/cart/invoice + contract negatives).
