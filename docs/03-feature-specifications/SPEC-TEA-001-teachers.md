# Teacher Records Specification

**Specification ID:** SPEC-TEA-001<br>
**Feature name:** Teacher profile API<br>
**Version:** 1.0<br>
**Status:** DRAFT; current contract observed, workflow approval pending<br>
**Requirement IDs:** FR-TEA-001<br>
**Related ADRs:** ADR-001, ADR-002<br>
**Last updated:** 2026-11-07

## 1. Specification ID
SPEC-TEA-001.

## 2. Feature name
Teacher profile API.

## 3. Version
1.0.

## 4. Status
DRAFT. Current API behavior is documented; account and academic workflows are not approved.

## 5. Purpose
Describe existing teacher profile API behavior and known boundaries.

## 6. Scope
Create, list, retrieve by `teacherId`, update, and deactivate profiles. Deactivation is soft; no User relation is present.

## 7. Actors and roles
Authenticated users with route-specific `teachers.*` permissions.

## 8. Preconditions
Valid token, active user, and matching active permission.

## 9. Postconditions
Successful create/update returns profile data; deactivation sets status inactive without removing the record.

## 10. Functional requirements
GET list/item, POST create, PATCH update, DELETE soft deactivate are mounted.

## 11. Business rules
Identifier is immutable. Deactivation retains records. Deactivation effects on linked accounts or academic data are not defined.

## 12. Data requirements
Schema declares required unique `teacherId`, required name/department, optional email/phone, active/inactive status, and timestamps.

## 13. Field definitions
Create fields: `teacherId`, `name`, `department`, optional `email`, `phone`. Update fields: name, department, email, phone.

## 14. Validation rules
Required strings must be non-empty; optional email is format-checked and lowercased; non-empty email is unique; unknown fields are rejected.

## 15. API requirements
`GET /api/teachers`, `GET /api/teachers/:teacherId`, `POST /api/teachers`, `PATCH /api/teachers/:teacherId`, `DELETE /api/teachers/:teacherId`. See [API_DOCUMENTATION.md](../../backend/docs/API_DOCUMENTATION.md).

## 16. Authorization requirements
Operations require `teachers.view`, `.create`, `.update`, or `.delete`. No Teacher-to-User, department, or assignment scope is implemented.

## 17. Error handling
Invalid input 400; missing/invalid auth 401; denied permission 403; missing teacher 404; duplicate identifier/email 409; unexpected failure 500.

## 18. Edge cases
Duplicate teacher ID/email, empty email removal, unknown fields, missing record, invalid data, repeated deactivation.

## 19. Security requirements
Do not weaken route checks or alter grants to satisfy tests. Ensure profile visibility and future teacher assignment scope are approved.

## 20. Audit and logging requirements
Controller logs error identifiers; profile-change/deactivation audit policy is not defined.

## 21. Dependencies
MongoDB teacher collection and approved role permissions. The historical audit reported HOD write grants absent at inspection; current grants were not queried here.

## 22. Acceptance criteria
Current API contract is documented; live behavior, grants, and account/academic relationships are not acceptance-verified.

## 23. Test scenarios
Current model-stub tests cover CRUD-like flows, duplicates, validation, and representative permission outcomes. Live database remains unverified.

## 24. Open questions
Confirm User linkage, role grants, organizational scoping, deactivation effects, profile retention, and email policy.

## 25. Change history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-07 | Documented current contract and unresolved policy. |
