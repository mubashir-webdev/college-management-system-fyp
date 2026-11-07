# Use Cases

**ID:** DOC-REQ-UC-001<br>
**Version:** 1.0<br>
**Status:** Observed API use cases; business workflow confirmation pending<br>
**Last reviewed:** 2026-11-07

| ID | Actor | Use case | Preconditions / outcome | Status |
|---|---|---|---|---|
| UC-AUTH-001 | User | Log in | Active account and valid credentials; receives JWT, otherwise safe error | Current API; see SPEC-AUTH-001 |
| UC-IAM-001 | Authenticated user | Request protected operation | Valid JWT and active permission required; denied otherwise | Current API; full matrix pending |
| UC-STU-001 | Authorized operator | Manage student profile | Permission required; create/list/read/update only | Current API; identity scope pending |
| UC-TEA-001 | Authorized operator | Manage teacher profile | Permission required; create/list/read/update/deactivate | Current API; identity scope pending |
| UC-SUB-001 | Authorized operator | Manage subject catalog | Permission required; create/list/read/rename/deactivate | Current API; academic relationships pending |
| UC-PLAT-001 | Monitor / operator | Check API liveness/readiness | No token required; readiness depends on DB connection | Current API |
| UC-PARENT-001 | Parent / guardian | View verified child's information | Relationship and verification rules are undefined | NEEDS_OWNER_CONFIRMATION |
| UC-ACA-001 | Academic role | Record attendance/results/timetable data | Scope and business rules undefined | NEEDS_OWNER_CONFIRMATION |

This is not a full workflow catalogue. Do not create implied enrollment, grading, approval, or notification behavior from these titles.
