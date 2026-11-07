# Task: Approve Backend Requirements and Authorization Policy Baseline

**Task ID:** TASK-001<br>
**Status:** BLOCKED<br>
**Priority:** P0<br>
**Owner:** Project owner<br>
**Related requirement IDs:** FR-AUTH-001, FR-IAM-001, FR-STU-001, FR-TEA-001, FR-SUB-001<br>
**Related specification IDs:** SPEC-AUTH-001, SPEC-IAM-001, SPEC-STU-001, SPEC-TEA-001, SPEC-SUB-001<br>
**Related architecture decisions:** ADR-001, ADR-002<br>
**Created:** 2026-11-07<br>
**Updated:** 2026-11-07

## 1. Objective

Approve or correct the existing backend requirement baseline and define authorization policy before implementation or live integration work is scheduled.

## 2. Scope

- Decide which current APIs and README-listed modules are in approved FYP scope.
- Confirm role/operation grants, wildcard policy, inactive-role handling, and record-level access boundaries.
- Confirm whether account lifecycle, student deletion/search/pagination, and academic relationships are required.
- Approve criteria for provisioning an isolated database and test identities for integration verification.

## 3. Out-of-scope items

No code changes, data/permission/index writes, live database use, production configuration changes, frontend work, or commits.

## 4. Dependencies

Owner answers to Q-REQ-001, Q-AUTH-001 through Q-AUTH-004, and relevant Q-DATA/Q-OPS questions in [OPEN_QUESTIONS.md](../../12-project-reports/OPEN_QUESTIONS.md).

## 5. Existing files to inspect

`README.md`; `backend/docs/API_DOCUMENTATION.md`; `backend/docs/BACKEND_AUDIT.md`; `docs/requirements/`; `docs/03-feature-specifications/`.

## 6. Files expected to change

Approved requirement/specification documents, task index, traceability matrix, and this task's status/evidence only.

## 7. Detailed implementation steps

1. Record owner decisions and version the approved requirement baseline.
2. Update affected specifications and acceptance criteria.
3. Split approved implementation work into dependency-aware tasks.
4. Obtain approved isolated-database configuration and test-account approach before live integration testing.

## 8. Validation rules

Each approved requirement must have one specification, testable acceptance criteria, test scenarios, and a traceability entry.

## 9. Security requirements

Do not weaken authentication/authorization. Record approved data visibility by role; do not broaden grants during this task.

## 10. Database impact

None. No database connection, record, index, role, or permission operation is in scope.

## 11. API impact

Documentation/specification only. No endpoint changes are authorized.

## 12. Test scenarios

Verify traceability completeness and that unapproved features remain excluded or explicitly `NEEDS_OWNER_CONFIRMATION`. No live database test.

## 13. Acceptance criteria

- Owner decisions required to define the first stabilization task are recorded with date and authority.
- Every approved requirement maps through specification/task to tests in the traceability matrix.
- Unapproved features remain excluded or explicitly `NEEDS_OWNER_CONFIRMATION`.
- No production/application database mutation occurs.

## 14. Documentation updates

Update requirements, specifications, task index, traceability matrix, and open questions.

## 15. Rollback considerations

Use versioned documentation corrections and preserve prior decision history; no runtime rollback applies.

## 16. Completion evidence

Owner decision record, updated traceability, and reviewed task breakdown. This task remains BLOCKED until owner input is received.

## 17. Review notes

No implementation began during the governance phase.
