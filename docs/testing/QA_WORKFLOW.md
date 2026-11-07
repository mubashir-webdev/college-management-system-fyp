# QA and Review Workflow

**ID:** DOC-QA-WORKFLOW-001<br>
**Version:** 1.0<br>
**Status:** Active<br>
**Last reviewed:** 2026-11-07

## Required task workflow

1. Read project [AGENTS.md](../../AGENTS.md), linked approved requirement/specification, task, and ADR.
2. Inspect current code, relevant docs, and Git worktree; preserve unrelated changes.
3. Confirm scope, dependencies, security/data risks, and acceptance criteria.
4. Make a bounded implementation plan and change only approved scope.
5. Add or update positive, negative, validation, authorization, and edge-case tests as relevant.
6. Run targeted tests, syntax/lint/build checks available in the repository.
7. Review changed files and diff; check for secrets, authorization weakening, database writes, and regressions.
8. Update API/database docs, task status, and traceability.
9. Record exact commands, results, limitations, and review notes.

## Quality gates

| Gate | Exit condition |
|---|---|
| Requirements | Requirement IDs and owner-approved scope exist; unknowns are explicit. |
| Specification | Relevant spec is approved and testable. |
| Design | Architecture fit is shown; ADR exists for an approved consequential change. |
| Implementation | Only task scope changed; input, error, and access handling follow policy. |
| Testing | Acceptance criteria have test evidence; mocks and live DB evidence are distinguished. |
| Security | Authentication, authorization, data exposure, secrets, and abuse cases reviewed. |
| Documentation | API/database/operational docs and traceability are current. |
| Final review | Diff reviewed, limitations recorded, task evidence complete. |

A skipped gate requires a documented reason and must not be represented as passed. No feature task is complete solely because code was generated.
