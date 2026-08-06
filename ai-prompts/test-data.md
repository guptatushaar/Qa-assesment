# AI Prompts – Test Data

Prompts used to design/generate UI + API data, including AI-assisted faker usage.

---

### Entry 1
- **Prompt:** Design `generateUniqueUser()` so API registration never collides and respects UserRequest max lengths / password rules.
- **AI Response Summary:** Timestamped email; password with upper/lower/number/symbol; truncate name/address fields; include `house_number` for address schema.
- **Validation Notes:** Checked against OpenAPI `UserRequest` (last_name max 20, password complexity, nested address).

---

### Entry 2
- **Prompt:** Build invoice POST body matching the participant guide example; inject runtime `cart_id`.
- **AI Response Summary:** Fixture with Zoey Shore / Hesselbury / Florida / TG / 1234AA / cash-on-delivery / empty `payment_details`.
- **Validation Notes:** Kept `billing_country: "TG"` exactly as documented; stored template in `API/testdata/invoicePayload.json`.

---

### Entry 3
- **Prompt:** What static vs dynamic data should manual CSV reference?
- **AI Response Summary:** Manual cases use “unique email” instructions rather than hard-coded emails; automation generates data at runtime.
- **Validation Notes:** CSV steps say “valid unique user” to avoid stale credentials in evidence.

---

### Entry 4
- **Prompt:** Change country to Canada, postal 1432AA, billing_state UttarP, billing_postal 2134AB — keep identity Tushaar/Gupta.
- **AI Response Summary:** Applied fields; suite then failed invoice UI + API (422 / empty My Invoices).
- **Validation Notes (rejected AI “just keep Canada”):** Probed API — `UttarP`/`2134AB` invalid with `TG`; Canada + Dutch postal blocked Proceed. Kept NL + 1432AA for UI; invoice fixture restored to guide example (`Zoey Shore` / Hesselbury / Florida / TG / 1234AA). Centralized data in `utils.js` + JSON so UI/API no longer drift.
