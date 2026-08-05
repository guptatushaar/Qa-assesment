# PrismStructure setup (see also root readme.md)

```bash
cd PrismStructure
npm install
npx playwright install chromium
npm run test:smoke
npm run test:regression
npm run test:ui
npm run test:api
npm test
npm run report
```

Reports: `execution-reports/html-report/index.html` and `execution-reports/results.json`.

## Known SUT note
Press **Confirm twice** on Cash on Delivery to generate an invoice. Selectors use `data-test` attributes; refine against live DOM if the app markup changes.
