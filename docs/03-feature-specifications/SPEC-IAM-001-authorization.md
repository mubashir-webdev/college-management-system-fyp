# Authorization Specification

**Specification ID:** SPEC-IAM-001<br>
**Feature name:** Role permission checks<br>
**Version:** 1.0<br>
**Status:** DRAFT; owner policy confirmation required<br>
**Requirement IDs:** FR-IAM-001, NFR-SEC-002<br>
**Related ADRs:** ADR-001, ADR-002<br>
**Last updated:** 2026-11-07

## 1. Specification ID
SPEC-IAM-001.

## 2. Feature name
Role permission checks.

## 3. Version
1.0.

## 4. Status
DRAFT. Current implementation is observable; complete authorization policy is not approved.

## 5. Purpose
Record current authorization behavior and make its limits explicit.

## 6. Scope
Active permission-document checks on protected routes. User/role/permission administration is not exposed.

## 7. Actors and roles
Authenticated users whose role name is associated with a permission record.

## 8. Preconditions
Valid JWT, active user, route-specific permission record.

## 9. Postconditions
The request proceeds only when permission matches or the permission list contains `*`; otherwise it is denied.

## 10. Functional requirements
Middleware looks up an active permission record for the user's role and checks the required permission. `GET /api/test/protected` is a protected diagnostic route requiring `own_profile.view`.

## 11. Business rules
Wildcard policy, inactive-role handling, grants, and resource visibility require owner decisions. Current code does not consult the Role model's status.

## 12. Data requirements
Permission records contain a role name, string permission array, active/inactive status, and timestamps. Role records independently contain a status.

## 13. Field definitions
Current access attributes are `user.role`, `permission.role`, `permission.permissions[]`, and `permission.status`.

## 14. Validation rules
Permission identifiers are string comparisons in middleware. A missing permission record or missing required permission denies access.

## 15. API requirements
Every protected route declares a specific permission. Routes and mappings are documented in [API_DOCUMENTATION.md](../../backend/docs/API_DOCUMENTATION.md).

## 16. Authorization requirements
Preserve JWT and permission checks and least privilege. No ownership, department, class, student, teacher-assignment, or parent-child scoping is implemented. Do not imply role-level permission is sufficient for sensitive data.

## 17. Error handling
Missing authentication is 401; missing/insufficient permission is 403; middleware lookup errors return 500.

## 18. Edge cases
Inactive user, inactive/missing permission record, inactive Role, empty permission array, wildcard, unknown role, and resource outside a user's organizational scope.

## 19. Security requirements
Do not bypass checks, grant permissions to satisfy tests, or broaden access without approval. Define resource-level authorization before adding sensitive endpoints.

## 20. Audit and logging requirements
Current middleware logs permission check failures by error name. Audit-log coverage, sensitive-event retention, and denied-request telemetry are not specified.

## 21. Dependencies
Approved role catalogue and permission matrix; stable identity/resource relationships; isolated test users and data.

## 22. Acceptance criteria
Each protected operation denies unauthenticated and insufficiently authorized users and allows only approved grants. Full role-operation and resource-scope matrix is not yet available.

## 23. Test scenarios
Current tests cover representative missing/invalid token, allowed/denied permission, and middleware error paths using stubs. A full live role matrix is outstanding.

## 24. Open questions
See [open questions](../12-project-reports/OPEN_QUESTIONS.md): inactive Role behavior, wildcard policy, role-operation grants, and data scoping.

## 25. Change history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-07 | Recorded implementation behavior and unresolved authorization policy. |
