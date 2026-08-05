# AI Prompts – Test Design

Prompts used to generate and refine UI + API scenarios (manual CSV + automation titles).

---

### Entry 1
- **Prompt:** Generate ≤8 manual test cases covering UI AC1/AC2 and API AC1/AC2 with @smoke and @regression tags. Include double-confirm and single-confirm behaviors.
- **AI Response Summary:** Eight CSV rows: register, profile verify, CoD invoice×2, duplicate email, bad password, single confirm, API auth+cart, API invoice.
- **Validation Notes:** Trimmed to guide limit (5–8). Mapped each row to automation IDs in `FunctionalTestCase.csv`.

---

### Entry 2
- **Prompt:** Align Playwright spec titles to AC wording and keep smoke/regression grep tags on titles.
- **AI Response Summary:** Specs named TC-UI-01..08 and API-AC1/AC2 with `@smoke` / `@regression` in titles for `npm run test:smoke|regression`.
- **Validation Notes:** Verified `package.json` scripts use `--grep @smoke` / `@regression`.

---

### Entry 3
- **Prompt:** Which negatives are Core vs Stretch for this assessment?
- **AI Response Summary:** Core negatives = duplicate email, wrong password, incomplete billing, missing invoice field, invalid cart_id, single Confirm. Stretch would be search/filters/admin — out of scope.
- **Validation Notes:** Did not expand into Stretch; Core evidence prioritized.
