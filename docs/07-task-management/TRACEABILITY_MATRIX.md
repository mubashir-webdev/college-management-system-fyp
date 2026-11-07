# Traceability Matrix

**ID:** DOC-TRACE-001<br>
**Version:** 1.0<br>
**Status:** Active baseline; approval and broader tests pending<br>
**Last reviewed:** 2026-11-07

| Requirement | Specification | Task | Code evidence | Test evidence | Status |
|---|---|---|---|---|---|
| FR-PLAT-001 | SPEC-PLATFORM-001 | — | `backend/src/app.js` | `backend/test/backend.test.js`: health/error test (mocked process) | Observed; live DB not proven |
| FR-AUTH-001, FR-AUTH-002 | SPEC-AUTH-001 | TASK-001 | `authController.js`, `authMiddleware.js`, `generateToken.js` | login and protected-route tests (model stubs) | Partial; lifecycle and live auth pending |
| FR-IAM-001 | SPEC-IAM-001 | TASK-001 | `permissionMiddleware.js`, protected route declarations | representative allow/deny tests (stubs) | Partial; role matrix/scope pending |
| FR-STU-001 | SPEC-STU-001 | TASK-001 | Student model/controller/routes | student API flow test (stubbed model) | Observed; live behavior/scope pending |
| FR-TEA-001 | SPEC-TEA-001 | TASK-001 | Teacher model/controller/routes | teacher API flow and permission tests (stubbed) | Observed; live behavior/grants pending |
| FR-SUB-001 | SPEC-SUB-001 | TASK-001 | Subject model/controller/routes | subject API flow and permission tests (stubbed) | Observed; index/live behavior pending |
| FR-USR-001 | SPEC-BOOTSTRAP-001 (bootstrap utility only) | Not created | `scripts/createInitialPrincipal.js`; no user/role/permission admin API | No bootstrap integration test | Needs owner scope |
| FR-STU-002, FR-ACA-001, FR-OPS-001 | TBD | Not created | No corresponding complete APIs found | No acceptance tests | Needs owner scope |
| NFR-SEC-001..004, NFR-REL-001..002, NFR-API-001, NFR-OPS-001, NFR-PERF-001 | Relevant specifications / open questions | Future tasks after approval | Mixed; see current-state report | 14 tests pass; coverage is partial and mocked | Partial / pending |

## Acceptance-to-test mapping

| Acceptance criteria | Evidence |
|---|---|
| AC-GOV-001 | This governance baseline, task index, and spec links; owner approval outstanding |
| AC-BE-001 | No project completion evidence; baseline requirements remain unapproved |
| AC-BE-002 | Representative mocked authentication/permission tests only; full role matrix absent |
| AC-BE-003 | Current API tests include several invalid inputs/errors; complete boundary matrix absent |
| AC-DB-001 | No isolated live-database run; not met |
| AC-DOC-001 | Current API docs and database overview; additional behavior/deployment decisions remain |
| AC-SEC-001 | Risks recorded, not fully reviewed/remediated; not met |
| AC-FE-001 | No frontend code found; gate remains closed |

Update this matrix whenever requirements, specs, tasks, code, tests, or docs change. An observed implementation is not proof of an approved requirement.
