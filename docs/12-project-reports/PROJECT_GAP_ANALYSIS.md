# Project Gap Analysis

**ID:** DOC-AUDIT-GAP-001<br>
**Version:** 1.0<br>
**Status:** Baseline; scope decisions pending<br>
**Review date:** 2026-11-07

| Priority | Capability / gap | Existing evidence | Missing capability / risk | Dependency | Recommended resolution |
|---|---|---|---|---|---|
| P0 | Approved requirement scope | README describes broad modules | No testable owner-approved requirement baseline | Owner scope decision | Resolve Q-REQ-001; approve only needed modules |
| P0 | Tracked environment file | `backend/.env` tracked | Unknown credential exposure; ignore rule does not untrack it | Owner security decision; credential custody | Coordinate confirmation/rotation and separate untracking/history approval |
| P0 | Authorization policy | JWT and role permission middleware exist | No row-level scope; Role status ignored; wildcard policy unclear | Owner role/access decisions | Define role-operation matrix and data boundaries; test each |
| P0 | Isolated DB integration | Mock-based API tests pass | No evidence of live CRUD/schema/index behavior | Isolated MongoDB and approved test identity | Provision target, verify identity before writes, add integration tests |
| P1 | Auth lifecycle | Login/JWT only | Registration/recovery/revocation/MFA scope unknown | Q-AUTH-005 | Confirm needed flows and security requirements |
| P1 | User/role/permission administration | Models and initial Principal script exist | No management APIs; current grants not rechecked | Approved admin policy and test data | Specify administration before coding or changing grants |
| P1 | Student/teacher record boundaries | CRUD/profile APIs exist | No ownership, department, class, or Teacher-to-User relationships | Q-AUTH-003, Q-DATA-001 | Approve domain relationships, then spec and integration-test |
| P1 | Academic domain | README lists subjects, attendance, results, timetables | No sufficient rules, relations, or APIs for most workflows | Q-ACA-001 | Prioritize and specify each selected module |
| P2 | Parent/guardian access | README mentions verified children | No verification, consent, or linking mechanism | Q-PARENT-001 | Define safeguarding and authorization policy first |
| P2 | Operational readiness | CORS/rate limit/startup checks present | Production origins/topology/monitoring/backups/SLOs unknown | Q-OPS-001 | Document target environment and test operational criteria |
| P2 | API/DB docs | Current endpoint docs and index plan exist | No full approved schema/role matrix or live verification | Scope decisions and isolated DB | Maintain contracts and mark evidence level precisely |
| P2 | Frontend | README proposes React | No frontend files; backend-first instruction | Backend completion criteria | Keep deferred until backend completion is accepted |

## Existing capabilities

Express server and readiness/liveness endpoints; login and JWT middleware; active permission lookup with wildcard support; student, teacher, and subject endpoint code; model schemas; basic request validation, CORS controls, login throttling, and 14 passing mocked tests.

## Risks

Sensitive `.env` is tracked; tests are not live integrations; role checks do not enforce resource scope; hidden business assumptions could create unsafe access; declared indexes may not match database state; README scope exceeds verified implementation.

## Dependency-aware sequence

The next task is the owner-blocked requirement and authorization baseline (TASK-001). Only after that can isolated integration setup, policy tests, and approved feature tasks be sized accurately. Do not start every README module or frontend work automatically.
