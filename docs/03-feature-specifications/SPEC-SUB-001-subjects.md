# Subject Catalog Specification

**Specification ID:** SPEC-SUB-001<br>
**Feature name:** Subject catalog API<br>
**Version:** 1.0<br>
**Status:** DRAFT; minimal current contract, academic model pending<br>
**Requirement IDs:** FR-SUB-001<br>
**Related ADRs:** ADR-001, ADR-002<br>
**Last updated:** 2026-11-07

## 1. Specification ID
SPEC-SUB-001.

## 2. Feature name
Subject catalog API.

## 3. Version
1.0.

## 4. Status
DRAFT; business scope and academic relationships require confirmation.

## 5. Purpose
Record the minimal existing subject catalog contract.

## 6. Scope
Create, list, retrieve by code, rename, and soft-deactivate catalog entries.

## 7. Actors and roles
Authenticated users with route-specific `subjects.*` permissions.

## 8. Preconditions
Valid token, active user, and matching active permission.

## 9. Postconditions
Successful write returns the created/updated record; deactivation retains it and sets inactive status.

## 10. Functional requirements
GET collection/item, POST create, PATCH name, and DELETE soft-deactivate are mounted.

## 11. Business rules
Subject code is immutable; status is API-controlled. Department, program, semester, credits, and teacher/class relationships are not defined.

## 12. Data requirements
Model declares required unique `subjectCode`, required `name`, active/inactive status, and timestamps.

## 13. Field definitions
Create: `subjectCode`, `name`. Update: `name`. Status is set by the API.

## 14. Validation rules
Code and name are trimmed non-empty strings. Unknown fields are rejected. Duplicate codes return conflict.

## 15. API requirements
`GET /api/subjects`, `GET /api/subjects/:subjectCode`, `POST /api/subjects`, `PATCH /api/subjects/:subjectCode`, `DELETE /api/subjects/:subjectCode`. See [API_DOCUMENTATION.md](../../backend/docs/API_DOCUMENTATION.md).

## 16. Authorization requirements
Operations require `subjects.view`, `.create`, `.update`, or `.delete`. No non-Principal grants were confirmed by current audit.

## 17. Error handling
Invalid input 400; missing/invalid auth 401; denied permission 403; missing subject 404; duplicate code 409; unexpected failure 500.

## 18. Edge cases
Duplicate code, empty fields, unknown fields, missing record, immutable identifier, repeated deactivation.

## 19. Security requirements
Maintain route authentication and permission checks. Do not change grants or database indexes without explicit approval.

## 20. Audit and logging requirements
Controller logs error identifiers; subject change/deactivation audit retention is not specified.

## 21. Dependencies
MongoDB subjects collection and approved permission configuration. Schema uniqueness does not prove a live index exists.

## 22. Acceptance criteria
Minimal API contract is documented. Live index state and CRUD behavior are not verified in this audit.

## 23. Test scenarios
Current model-stub tests cover create/list/read/update/deactivation, validation, duplicates, and representative permission checks. Live MongoDB tests remain outstanding.

## 24. Open questions
Confirm subject identifier format, relationships to academic terms/departments/classes/teachers, lifecycle, and role grants. Index changes require the separate approved procedure in [migration plan](../../backend/docs/SUBJECT_INDEX_MIGRATION_PLAN.md).

## 25. Change history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-07 | Documented minimal current contract and index caveat. |
