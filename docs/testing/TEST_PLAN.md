# Test Plan

**ID:** DOC-QA-TESTPLAN-001<br>
**Version:** 1.0<br>
**Status:** Baseline; integration matrix pending approved environment<br>
**Last reviewed:** 2026-11-07

## Existing automated tests

Run from `backend/`:

```powershell
npm test
```

The Node built-in test suite starts an ephemeral local HTTP server and stubs Mongoose model operations. On 2026-11-07 it passed 14 tests. Coverage includes health/errors, login validation, token and permission checks, CORS, rate limiting, student flows, teacher flows, subject flows, and generic error handling.

These are API-level tests with mocked data operations. They do not prove live MongoDB connectivity, schema/index behavior against the actual database, populated role configuration, or database-backed CRUD.

## Required future test layers

- Unit tests for validation, controller edge cases, and middleware decisions.
- API tests for every endpoint, role, expected status, malformed input, and unauthorized access.
- Isolated MongoDB integration tests after verifying the selected database identity before writes.
- Regression tests for every approved requirement and recorded defect.
- Security tests for authentication, least privilege, resource scoping, secret exposure, and rate-limit/proxy behavior.

## Safety controls

- Never use `college_management` for write tests.
- Do not print or store real connection strings.
- Confirm isolated database target before any write; do not infer safety from a database name in docs alone.
- Do not run migration/index tests against the application DB.
- No approved credentials/token or isolated database was supplied during this audit; no live integration test was attempted.
