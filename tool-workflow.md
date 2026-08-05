# tool-workflow.md — AI-Assisted Engineering Workflow

> Purpose of this assessment (from the launch note): show **how** you collaborate with AI — context, prompts, refinement, validation, and documentation — **not** how much content AI can generate or how deep your testing theory is.

## Primary tools

| Tool | Role in this exercise |
|------|------------------------|
| **Cursor** | Main IDE + agent for planning docs, Prism Playwright code, debugging |
| Model strategy | Auto / lighter model for requirements, CSV, ai-prompts, README; coding model only for page objects, specs, hard failures |
| Live SUT | https://practicesoftwaretesting.com + API docs |
| Evidence | Playwright HTML/JSON under `PrismStructure/execution-reports/` |

## How I provide context to AI

1. Paste **only the relevant slice** of the participant guide (AC1/AC2, invoice payload, structure rules) — not the entire PDF every time.
2. Point at concrete paths (`PrismStructure/UI/pageobjects/...`, OpenAPI invoice schema, failing `error-context.md`).
3. State constraints up front: Core only, 5–8 cases/tier, `@smoke`/`@regression`, confirm×2 quirk, public synthetic data only.
4. Prefer **one task per chat** (planning ≠ coding ≠ debugging) to keep prompts reusable for `ai-prompts/`.

## How I write / refine prompts

| Iteration | What changed | Why |
|-----------|--------------|-----|
| 1 | “Generate all Toolshop tests” | Too broad → noisy, Stretch creep |
| 2 | “Extract AC1/AC2 only; smoke vs regression; Core limit 5–8” | Matched guide + email focus on judgment |
| 3 | “Fix register: country label is `Netherlands (the)`; use postcode lookup order” | Grounded in Playwright snapshot, not guessed DOM |
| 4 | “Assert `cart_items` not `cart_products`; keep invoice `billing_country: TG`” | Validated against OpenAPI + assessment fixture |
| 5 | “Fail-closed Confirm×2; TC-UI-07 empty My Invoices; no cart field fallbacks” | Closed false-pass gaps found in code review + live re-run |

Pattern used: **Goal → Constraints → Inputs (files/URLs/errors) → Definition of done → Ask AI to list assumptions**.

## How I validate AI output (mandatory gate)

Before accepting any AI change I check:

- [ ] Maps to an AC or documented risk
- [ ] Does not invent Stretch coverage
- [ ] Selectors / payloads match live SUT or OpenAPI
- [ ] Negative paths do not wait for success URLs
- [ ] Secrets / real PII absent
- [ ] I can explain the change in one sentence in `ai-prompts/`

Reject examples from this exercise: wrong cart field names, missing `WebUtils.goto`, skip of checkout `proceed-2`, `selectOption('Netherlands')` without checking the real option label.

## Workflow loop (reusable)

```text
Context (AC + SUT + constraint)
    → Prompt (single task)
    → AI draft
    → Human validation (run / read DOM / OpenAPI)
    → Refine prompt or patch code
    → Record in ai-prompts/*
    → Small git commit
```

## Mapping to evaluation criteria

| Criterion | Where it shows in this repo |
|-----------|-----------------------------|
| Prompt quality & refinement | `ai-prompts/*`, this file’s iteration table |
| Context to AI | `project-info.md`, prompts that cite ACs/paths/errors |
| Validation of AI outputs | `ai-prompts/automation-and-debugging.md`, defect/RCA notes |
| Responsible AI use | No secrets; Core scope; synthetic users only |
| Documentation & engineering approach | `readme.md`, `tool-workflow.md`, iterative structure |
| Execution evidence | `PrismStructure/execution-reports/` |

## What “good” looks like for *this* submission

A smaller Core with **visible prompt iteration + validation notes** beats a large auto-generated suite. Automation is proof that AI-assisted delivery works — not the main score driver.
