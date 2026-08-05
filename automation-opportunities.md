# Automation Opportunities Identified

Prioritized list from exploratory + AC analysis. **Core** items were automated; Stretch left intentional.

## Automated in Core (this repo)

| Opportunity | Why automate | Where |
|-------------|--------------|--------|
| Register → login → profile verify | High-value auth smoke; unique data needed each run | UI `@smoke` TC-UI-01/02 |
| Duplicate email / wrong password | Stable negatives; protect auth rules | UI `@regression` |
| Multi-item cart + quantity | Core purchase prep | UI `@smoke` TC-UI-05 |
| CoD checkout confirm×2 + My Invoices | AC2 critical path + known quirk | UI `@smoke` TC-UI-06 |
| Confirm×1 does not invoice | Documents quirk / prevents false confidence | UI `@regression` TC-UI-07 |
| Incomplete billing blocks payment | Invalid transition | UI `@regression` TC-UI-08 |
| API register → login → token → cart | Auth lifecycle contract | API `@smoke` |
| API products → cart items → invoice (fixture body) | Order creation contract | API `@smoke` |
| API missing billing field / invalid cart_id | Contract negatives | API `@regression` |

## Good candidates — not automated (Stretch / ROI)

| Opportunity | Why defer |
|-------------|-----------|
| Product search / filters / categories | Outside AC1/AC2 Core; large selector surface |
| Credit card / BNPL / gift-card payments | Extra payment_details schemas; not in Core AC |
| Admin invoice search | Role setup overhead |
| Visual / accessibility checks | Different toolset |
| Performance of product list | Not in assessment rubric |

## Manual-only (by design)

| Case | Reason |
|------|--------|
| Exploratory language switcher / layout | Better as session notes than brittle scripts |
| One-off UX judgment on confirm×2 copy | Captured in defect/RCA + exploratory notes |

## Principle used

Automate **repeatable Core lifecycle + documented quirks**. Do **not** expand surface area at the expense of prompt history, validation notes, and execution evidence (matches both the participant guide and the SE/SSE launch email).
