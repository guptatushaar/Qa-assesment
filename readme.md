# QA AI Learning & Skills Assessment — Toolshop

Public submission for the **SE/SSE GenAI Learning & Skills Assessment**.

> **What this is scored on:** how you collaborate with AI (context, prompts, refinement, validation, documentation) — **not** how much AI content you generate or pure testing theory depth. Qualifying bar: **70%** on the AI evaluation rubric.

## System under test

- UI: https://practicesoftwaretesting.com/
- API docs: https://api.practicesoftwaretesting.com/api/documentation

## Email checklist → repository map

| Required deliverable | Location |
|----------------------|----------|
| README with project overview | `readme.md` (this file) |
| Manual test cases | `FunctionalTestCase.csv` |
| API test scenarios | `api-test-scenarios.md` + `PrismStructure/tests/API Test/` |
| Automation opportunities identified | `automation-opportunities.md` |
| One simple UI/API automation flow | `PrismStructure/` (Playwright Prism — UI AC1/AC2 + API AC1/AC2) |
| Exploratory testing notes | `exploratory-testing-notes.md` |
| Defect Report / RCA | `defect-report-rca.md` |
| AI prompts used | `ai-prompts/` |
| AI workflow documentation | `tool-workflow.md` (+ Part A detail in `project-info.md`) |
| Execution evidence | `PrismStructure/execution-reports/` |
| Cursor rules / skills | `.cursor/rules/`, `.cursor/skills/` |

## Repository structure

```text
qa-ai-practical-assessment/
├── readme.md
├── tool-workflow.md
├── project-info.md
├── FunctionalTestCase.csv
├── api-test-scenarios.md
├── automation-opportunities.md
├── exploratory-testing-notes.md
├── defect-report-rca.md
├── ai-prompts/
│   ├── requirements-and-planning.md
│   ├── test-design.md
│   ├── test-data.md
│   ├── automation-and-debugging.md
│   └── documentation-and-summary.md
├── .cursor/
│   ├── rules/
│   └── skills/
└── PrismStructure/          # Playwright UI + API automation + reports
    ├── API/ UI/ commonUtils/ tests/
    ├── playwright.config.js
    ├── package.json
    └── execution-reports/
```

## Run automation

From the **repo root** (recommended):

```bash
npm install              # also installs PrismStructure deps
cd PrismStructure && npx playwright install chromium && cd ..
npm test                 # full UI + API
npm run test -- --headed # headed browser
npm run test:headed      # same as above
npm run test:smoke
npm run test:regression
npm run test:ui
npm run test:api
npm run report
```

Or from `PrismStructure/` directly:

```bash
cd PrismStructure
npm install
npx playwright install chromium
npm test
npm run test -- --headed
```

Reports: `PrismStructure/execution-reports/html-report/index.html`  
JSON: `PrismStructure/execution-reports/results.json`

**Known SUT behavior:** press **Confirm twice** on Cash on Delivery to generate an invoice.

## Core scope (kept small on purpose)

- UI: register/login/profile, cart quantity, CoD confirm×2 + My Invoices, negatives (duplicate email, bad password, confirm×1, incomplete billing)
- API: register/login/token/cart, products → cart_items → invoice with guide payload, contract negatives
- Limit: **5–8** cases per manual / UI / API tier including smoke + regression

## Evaluation alignment (how to read this repo)

1. **Prompt quality / iteration** → `ai-prompts/*`, `tool-workflow.md`  
2. **Context to AI** → AC-focused prompts, paths, error snapshots cited in prompt history  
3. **Validation of AI output** → `defect-report-rca.md`, debugging prompt notes, rejected wrong selectors/payloads  
4. **Responsible AI** → synthetic users only; no secrets; Core over Stretch  
5. **Engineering approach** → small commits recommended; structure matches both participant guide and launch email  

## Tip for submission

Use **small, meaningful commits** (planning → manual CSV → API scenarios → UI fix → evidence) instead of one large dump — that history is part of the signal evaluators want.
