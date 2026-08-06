# QA Prism Workflow Skill

Use for this assessment when designing or fixing Toolshop UI/API tests.

## Workflow

1. One task per chat (requirements OR design OR automation OR debug).
2. Map work to AC1/AC2 (UI and API) before coding.
3. After a focused session, append Prompt → Summary → Validation to the matching `ai-prompts/*.md` file.
4. Run from `PrismStructure/`: `npm run test:smoke` then `npm test`.
5. Prefer Core evidence over expanding coverage.

## Known SUT quirks

- Checkout steps: `proceed-1` → `proceed-2` → address → `proceed-3` → payment → `finish` ×2.
- Cart JSON field for line items: `cart_items`.
- Invoice detail field for lines: `invoicelines` (not `line_items`); number format `INV-<year><seq>`.
- Logout API is **`GET /users/logout`** (POST → 405); prove token death via `GET /users/me` ≥401.
- UI logout: `nav-menu` → `nav-sign-out`.
- Negative register/login must pass `{ expectSuccess: false }`.
