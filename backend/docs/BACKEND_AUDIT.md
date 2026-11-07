# Backend Audit

**Review date:** 28 October 2026
**Scope:** Files under `backend/`; no database records were written and no credential values were printed or reproduced.

## Summary

The backend currently implements an Express API for login, role-based permissions, student records, teacher profiles, and a minimal subject catalog. The project README describes a wider college-management scope; several modules remain absent from `backend/src`. Automated tests use Node's built-in runner and mocked model operations for database-backed endpoints.

The audited code now has explicit startup environment checks, separate liveness/readiness endpoints, controlled 404 and parser errors, stricter student request validation, and an isolated Node test suite. Tests use model stubs and do not establish that a live MongoDB instance, existing permission data, or end-to-end deployment works.

## Module inventory

| Area | Status | Evidence and limits |
|---|---|---|
| Server startup | Implemented; live local smoke check passed | `server.js` loads `backend/.env`, requires `MONGO_URI` and `JWT_SECRET`, waits for MongoDB before listening, and handles SIGINT/SIGTERM. Startup was verified against the configured local database. |
| Database connection | Implemented; local connection verified | `src/config/db.js` connects with Mongoose and no longer exits the process itself. Connection failure is logged without printing the URI and is propagated to startup. |
| Health and request handling | Implemented and tested with the app process | `/health/live` does not depend on MongoDB; `/health/ready` returns 200 only while Mongoose reports a connected state. JSON bodies are capped at 100 KB; malformed JSON and unknown routes return JSON errors. |
| Login and JWT | Implemented; automated coverage for credentials and throttling | `POST /api/auth/login` checks credentials, active status, bcrypt comparison, and issues a seven-day JWT. Password values are not included in the response. Login is limited per client IP with configurable window and attempt count. No registration or password reset was found. |
| Authentication middleware | Implemented and tested for missing/invalid tokens and safe downstream errors | Protected routes load the active user from the verified token identity. Token verification failures return 401; database failures flow to the generic 500 handler. |
| Roles and permissions | Partially implemented; denied access is tested, policy requires confirmation | Role and permission models exist; middleware checks an active permission record for the user's role and explicitly supports `*`. No role/permission administration API or enforcement of the Role model's `status` was found. |
| Student model and CRUD | Partially implemented; core paths tested with in-memory model stubs | Create, list, retrieve-by-`studentId`, and patch are present. Validation covers required fields, semester 1–12, schema status values, duplicate IDs, and unknown fields. Email uniqueness is not defined by the schema. Listing is unpaginated. |
| Student deletion | Not exposed; approval needed | A delete controller helper was already present in the worktree, but no DELETE route mounts it. Permanent deletion is intentionally not exposed until retention and related-record rules are confirmed. |
| Users and account management | Partially implemented | A User model and login exist. No user-management routes were found. The initial Principal setup script requires environment values and an active `principal` Role record. |
| Teachers | Implemented; automated coverage with mocked model operations | Teacher profile CRUD and soft deactivation are mounted at `/api/teachers`. The previously inspected collection had unique `teacherId` and sparse unique `email` indexes. Principal has wildcard access; HOD has `teachers.view` only. |
| Subjects | Implemented; automated coverage with mocked model operations | A minimal subject catalog (`subjectCode`, `name`, active/inactive status) is mounted at `/api/subjects`. The latest read-only check found zero documents and only `_id`; the schema's unique `subjectCode` index is absent from the live collection. Principal has wildcard access; other inspected roles have no Subject grants. No department, semester, teacher, or class relationships are defined. |
| Parents, results, attendance, timetables, leaves, notices, notifications, settings, reports | Missing from the inspected backend source | No corresponding models/controllers/routes were found under `backend/src`; project README/database collection names are not evidence of working API modules. |
| Validators, services, and API error modules | Missing as separate modules | Validation is in the student model/controller; there are no `services`, `validators`, or dedicated error-handler files. |
| CORS and login throttling | Implemented and tested | CORS permits exact configured origins, otherwise only loopback development defaults outside production; a blank production allowlist denies cross-origin browser access. Login throttling uses an in-memory per-process store. |
| Automated tests | Implemented; mocked behavior only | `npm test` uses Node's built-in test runner. The suite exercises health, request errors, CORS allow/deny, rate limiting, login, permission denial, and student CRUD without connecting to a database. |
| API documentation | Added | See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md). |

## Confirmed risks and decisions needed

1. **Environment file is tracked by Git.** The file `backend/.env` is tracked in the repository. Its credential values were not printed or reproduced; the configured URI was used only for the local read-only startup check. Ignoring future environment files does not remove this already-tracked file. Rotate any credentials that have been shared or committed, then approve removing the file from version control and any history cleanup separately.
2. **Authorization is role-level only.** Student endpoints rely on permissions such as `students.view`; there is no model relationship or ownership/department/class scope connecting users to student records. The README describes scoped HOD/teacher/student/parent access, but this backend cannot enforce that scope yet. Confirm the intended access policy and identity links before adding schema or endpoint behavior.
3. **Role status is not checked during authorization.** User status and permission-record status are checked, but the Role model's active/inactive status is not consulted. Decide whether deactivating a Role should immediately disable its users before changing this behavior.
4. **Production CORS origins must be configured.** No production frontend domain was inferred or added. Set `CORS_ORIGINS` to the exact comma-separated origins that should access the API. Browser origins are not an authentication/authorization boundary; protected endpoints still require JWT and permissions.
5. **Rate-limit store is process-local.** Login defaults to 10 attempts per IP per 15 minutes using an in-memory store. Multi-instance deployments need a shared store and carefully configured trusted proxy settings; neither was guessed or enabled.
6. **Tracked environment file.** `.gitignore` matches `backend/.env`, but a tracked file is not removed from Git by an ignore rule. See the remediation plan below.
7. **Limited live verification.** Read-only local checks verified startup, health/readiness, 404 handling, unauthenticated route responses, and generic login errors. Authenticated API behavior and CRUD remain unverified without an approved test account/token and isolated test database. The Subject unique index is absent; the inspection server disabled Mongoose auto-indexing, and no index was created.
8. **Teacher write permissions are not configured.** A read-only check of stored permission records found `teachers.view` for `hod`, but no `teachers.create`, `teachers.update`, or `teachers.delete` grant. The API requires the matching permissions and denies calls without them. No permission record was changed.
9. **Subject schema is intentionally minimal.** The Subject collection was empty and had no application-defined indexes; no existing Subject model, frontend field usage, or detailed field requirements were found. The initial schema defines only `subjectCode`, `name`, status, and timestamps. Academic relationships require confirmed requirements before being added.
10. **Subject index requires a controlled migration.** The owner confirmed `college_management` as the intended application database. The `subjects` collection has no documents and only its `_id` index, but the schema declares a unique `subjectCode` index. Follow [SUBJECT_INDEX_MIGRATION_PLAN.md](./SUBJECT_INDEX_MIGRATION_PLAN.md) only after separate approval; do not rely on Mongoose startup auto-indexing as the migration process.

## Changes made for this audit

- Added required environment-variable checks and stable `.env` loading independent of the current directory.
- Removed process termination from the database connector and added graceful HTTP/Mongoose shutdown.
- Added distinct liveness and database readiness routes, JSON 404 handling, malformed-JSON responses, and a request-size limit.
- Tightened login input type checks and separated invalid-token responses from authentication database failures.
- Rejected unknown student fields and invalid semester values, normalized student IDs before duplicate lookup, and avoided echoing raw validation/database errors.
- Added tests using Node's built-in test runner. This security phase adds `express-rate-limit`; no database writes were introduced.
- Added `.env.example` and ignore rules. Existing tracked `backend/.env` remains tracked pending approval.
- Added exact-origin CORS configuration with local-only development defaults and no invented production hosts.
- Added configurable per-IP login rate limiting with safe 429 responses.
- Added tests for CORS allow/deny, configurable login throttling, missing/invalid JWTs, denied permissions, and generic errors that do not echo private details.
- Preserved all JWT and role-permission checks; no access checks were removed or broadened.
- Updated compatible transitive request-parser dependencies; `npm audit --omit=dev` reports no remaining vulnerabilities.
- Added a Teacher model, controller, and protected routes using the empty existing `teachers` collection. The model defines unique `teacherId` and optional unique email indexes, profile fields, and active/inactive status.
- Implemented DELETE as soft deactivation; permanent deletion and User-account linkage are not implemented.
- Added a minimal Subject catalog model/controller/routes on the existing empty `subjects` collection. Subject code is unique; DELETE soft-deactivates. No Subject records or permission documents were written.

## Tracked environment file remediation plan

The Git index contains `backend/.env`; this remains true even though the path matches the ignore rule. No credential values are reproduced in this report. After confirming the file can remain local and arranging credential rotation if it contains live/shared credentials, approve these separate steps:

1. Remove only `backend/.env` from the Git index while retaining the local file (for example, `git rm --cached backend/.env`).
2. Verify it is ignored and not staged for accidental re-addition; keep `.env.example` tracked.
3. If secrets were committed or pushed, assess exposure and rotate them. History rewriting is separate, coordinated work and is not included in this phase.

No untracking, deletion, rotation, or history rewrite was performed.

## Verification state

`npm test` completed successfully after Subject implementation: 14 tests passed, 0 failed. Tests use mocked Mongoose operations and cover authentication, permission denials, student and teacher flows, Subject create/list/retrieve/update/deactivation, validation, duplicate codes, unknown records, and safe errors. JavaScript syntax checks and `git diff --check` passed; `npm audit` reports no vulnerabilities.

A read-only permission inspection found active Principal wildcard access for Subject and Teacher operations, active HOD `teachers.view` only, and no matching active grants for other inspected roles. Teacher write permissions are absent for HOD. No permission records were changed.

The latest read-only Subject check found zero documents and only the `_id` index; the declared unique `subjectCode` index is not present. The owner confirmed `college_management` as the intended database. The project README and `.env.example` now use that database name; the actual `.env` and live URI were not changed. No records, permissions, indexes, or environment configuration were changed. The smoke-test server had Mongoose auto-indexing disabled and verified `/`, `/health/live`, `/health/ready`, unknown-route 404, and unauthenticated Subject/Teacher GET responses (401). Login with missing fields returned 400; a synthetic nonexistent `.invalid` identity returned 401. No approved account/token was available, so successful login, inactive-user rejection, authenticated permission outcomes, and live CRUD were not verified.

The existing automated suite uses mocked database operations. A separate local test database can be selected by overriding `MONGO_URI` only in the test server's PowerShell process; setup guidance and the index migration preflight are documented in [SUBJECT_INDEX_MIGRATION_PLAN.md](./SUBJECT_INDEX_MIGRATION_PLAN.md). No test database was created.

The required-environment guard was also tested with dotenv loading disabled to simulate missing configuration; startup exited with an explicit message before attempting a database connection. A port-collision cleanup scenario was not verified because the Windows socket probe did not reproduce a listen error.

Manual confirmation remains necessary for environment-file remediation, role/ownership rules, CORS origins, deletion/retention, and production rate limiting.
