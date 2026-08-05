# AI Prompts – Requirements and Planning

Record of iterative prompts used to understand Toolshop flows, risks, and the test plan (Part A + Part B).

---

### Entry 1
- **Prompt:** Extract AC1/AC2 from the QA participant guide for UI and API. List testable objectives, risks, and a smoke vs regression split. Keep Core scope only.
- **AI Response (short summary):** UI AC1 = register/login/profile; UI AC2 = multi-item cart + CoD + confirm×2 + invoice. API AC1 = register/login/token/cart; API AC2 = products → cart items → invoice with fixture payload. Risks: duplicate email, checkout steps, double-confirm quirk, required invoice fields.
- **Validation Notes:** Cross-checked against live SUT URLs and the guide’s invoice JSON example (`billing_country: "TG"`).

---

### Entry 2
- **Prompt:** Draft a requirement and risk analysis table for Toolshop checkout state machine (cart → proceed-1 → proceed-2 → address → payment → finish×2).
- **AI Response (short summary):** Highlighted missing `proceed-2` as a common automation gap; single Confirm as intentional negative/edge; address incompleteness blocks payment.
- **Validation Notes:** Confirmed against UI page objects (`proceed-1`/`proceed-2`/`proceed-3`/`finish`) and assessment note to press Confirm twice.

---

### Entry 3
- **Prompt:** Propose folder structure matching “What Counts as Complete” (FunctionalTestCase, PrismStructure, project-info, readme, ai-prompts, .cursor).
- **AI Response (short summary):** Root artifacts + `PrismStructure/` for Playwright; `ai-prompts/` for history; `.cursor/rules` + skills for reusable workflow.
- **Validation Notes:** Applied structure; kept automation count within 5–8 per tier.
