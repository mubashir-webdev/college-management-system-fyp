# Functional Requirements

**ID:** DOC-REQ-FUNCTIONAL-001<br>
**Version:** 1.0<br>
**Status:** Candidate baseline; requirements marked pending are not implementation approval<br>
**Last reviewed:** 2026-11-07

## Status convention

`OBSERVED` describes current code, not necessarily approved business need. `NEEDS_OWNER_CONFIRMATION` means implementation must wait for a decision. A future requirement can be approved only by an authorized owner.

| ID | Requirement statement | Status | Specification / evidence |
|---|---|---|---|
| FR-PLAT-001 | The API shall expose a liveness endpoint and a database-readiness endpoint. | OBSERVED | [SPEC-PLATFORM-001](../03-feature-specifications/SPEC-PLATFORM-001-platform.md); `backend/src/app.js` |
| FR-AUTH-001 | A user shall be able to submit email and password credentials and receive a JWT only when credentials are valid and the account is active. | OBSERVED; lifecycle scope pending | [SPEC-AUTH-001](../03-feature-specifications/SPEC-AUTH-001-authentication.md) |
| FR-AUTH-002 | Protected endpoints shall reject requests without a valid token and load an active user identity. | OBSERVED | [SPEC-AUTH-001](../03-feature-specifications/SPEC-AUTH-001-authentication.md) |
| FR-IAM-001 | Protected operations shall require the matching active role permission or an active wildcard permission. | OBSERVED; policy pending | [SPEC-IAM-001](../03-feature-specifications/SPEC-IAM-001-authorization.md) |
| FR-STU-001 | Authorized users shall be able to create, list, retrieve by student ID, and update student records using the current API contract. | OBSERVED; approved workflow/scope pending | [SPEC-STU-001](../03-feature-specifications/SPEC-STU-001-students.md) |
| FR-TEA-001 | Authorized users shall be able to create, list, retrieve by teacher ID, update, and deactivate teacher profiles using the current API contract. | OBSERVED; approved workflow/scope pending | [SPEC-TEA-001](../03-feature-specifications/SPEC-TEA-001-teachers.md) |
| FR-SUB-001 | Authorized users shall be able to create, list, retrieve by subject code, rename, and deactivate subject catalog records using the current API contract. | OBSERVED; catalog scope pending | [SPEC-SUB-001](../03-feature-specifications/SPEC-SUB-001-subjects.md) |
| FR-USR-001 | User, role, and permission administration shall be available through approved workflows. | NEEDS_OWNER_CONFIRMATION | No such management API was found; [Q-REQ-001](../12-project-reports/OPEN_QUESTIONS.md) |
| FR-STU-002 | Student deletion, search, filtering, and pagination shall be supported if approved. | NEEDS_OWNER_CONFIRMATION | Not currently exposed |
| FR-ACA-001 | Academic structures, attendance, results, examinations, timetables, and related workflows shall be implemented only if approved with specific rules. | NEEDS_OWNER_CONFIRMATION | README lists some high-level modules; details absent |
| FR-OPS-001 | Parent access, leaves, notices, notifications, fees, settings, and reports shall be implemented only if approved with specific rules. | NEEDS_OWNER_CONFIRMATION | See open questions |

## Traceability

Each requirement maps to a feature specification or an explicit open decision. Acceptance criteria and their evidence are maintained in the [traceability matrix](../07-task-management/TRACEABILITY_MATRIX.md).
