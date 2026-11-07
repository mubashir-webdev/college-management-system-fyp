# Student Records Specification

**Specification ID:** SPEC-STU-001<br>
**Feature name:** Student profile API<br>
**Version:** 1.0<br>
**Status:** DRAFT; current contract observed, workflow approval pending<br>
**Requirement IDs:** FR-STU-001, FR-STU-002<br>
**Related ADRs:** ADR-001, ADR-002<br>
**Last updated:** 2026-11-07

## 1. Specification ID
SPEC-STU-001.

## 2. Feature name
Student profile API.

## 3. Version
1.0.

## 4. Status
DRAFT. This records current API behavior, not an approved complete student workflow.

## 5. Purpose
Describe the existing student profile endpoints and their limitations.

## 6. Scope
Create, list, retrieve by application `studentId`, and patch student records. No delete route is mounted.

## 7. Actors and roles
Authenticated users with route-specific `students.*` permissions.

## 8. Preconditions
Valid token, active user, matching active permission record.

## 9. Postconditions
Successful requests return or update a student profile; updates preserve `studentId`.

## 10. Functional requirements
List is newest-first and unpaginated. Create, list, retrieve, and update are implemented in source.

## 11. Business rules
Current semester range is 1–12; student status values are active, inactive, or graduated. Deletion, retention, graduation, and ownership rules require confirmation.

## 12. Data requirements
Student schema declares required unique `studentId`, name, department, semester; optional email and phone; status; timestamps.

## 13. Field definitions
Fields: `studentId`, `name`, optional `email`, optional `phone`, `department`, `semester`, optional `status`. Email is not unique in the current schema.

## 14. Validation rules
Create/update reject unknown fields. IDs and required strings must be non-empty; semester must be an integer 1–12; optional email gets basic format validation.

## 15. API requirements
`GET /api/students`, `GET /api/students/:studentId`, `POST /api/students`, and `PATCH /api/students/:studentId`; full contract in [API_DOCUMENTATION.md](../../backend/docs/API_DOCUMENTATION.md).

## 16. Authorization requirements
GET operations require `students.view`; POST requires `students.create`; PATCH requires `students.update`. Department/class/student ownership scope is not implemented.

## 17. Error handling
Invalid input receives 400, unauthenticated 401, denied permission 403, missing record 404, duplicate ID 409, unexpected failure 500.

## 18. Edge cases
Duplicate ID, invalid semester, missing fields, empty update, unknown fields, missing record, and attempts to change identifier.

## 19. Security requirements
Keep authentication and permission middleware. Define record-level access and sensitive-field policy before exposure to student/parent roles.

## 20. Audit and logging requirements
Controller logs errors; no student-data audit trail was found. Audit requirements and retention need owner confirmation.

## 21. Dependencies
MongoDB student collection, approved permission records, and future identity/academic relations if scope requires them.

## 22. Acceptance criteria
Current API contract and validation are captured here and in API docs. Full business workflow acceptance remains pending.

## 23. Test scenarios
Current mocked test covers validation and create/list/read/update flows. Live DB, full permission matrix, and data-scope tests remain outstanding.

## 24. Open questions
Confirm delete/retention, search/filter/pagination, identity links, email uniqueness, ID format, semester meaning, and allowed visibility.

## 25. Change history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-07 | Documented existing contract; no extra requirements inferred. |
