# Project Agent Guidelines

**Version:** 1.0<br>
**Status:** Active<br>
**Owner:** Project owner<br>
**Scope:** Entire repository

## Required workflow

1. Read this file, the relevant requirement, approved feature specification, and linked task before implementation.
2. Inspect the existing implementation and worktree before editing. Preserve unrelated and pre-existing changes.
3. Implement only scope supported by an approved requirement, specification, and task. Record uncertainty as an owner question; do not turn README aspirations into approved behavior.
4. Add or update tests, run the smallest relevant checks, review the diff, update documentation and traceability, and report evidence and limitations.
5. Do not start frontend implementation until the backend completion criteria in the governance report are met and documented.

## Project-specific constraints

- The application is an existing Node.js, Express, Mongoose, and MongoDB project. Preserve the current architecture unless an approved ADR changes it.
- Use clear CommonJS modules and the existing route/controller/model boundaries. Keep functions focused, validate request bodies and parameters, use appropriate HTTP status codes, and do not silently swallow errors.
- The confirmed application database is `college_management`. Never run write tests against it; use a separately verified isolated test database.
- Do not alter database records, indexes, roles, permissions, production configuration, or the real `.env` without the explicit approval required by the governance policy.
- Never print, copy, or commit credentials or connection strings. `backend/.env` is tracked; treat its contents as sensitive and follow the approved remediation process rather than removing or rewriting it autonomously.
- Keep authentication and authorization checks in place. Do not broaden grants or infer role-level data scope.
- Avoid duplicate implementations and unnecessary dependencies. Record architectural changes in an ADR before implementation.
- Do not add a dependency unless the approved task justifies it.

## Existing patterns and checks

- Backend modules use CommonJS, Express routes/controllers, Mongoose models, and Node's built-in test runner.
- Run backend tests from `backend/` with `npm test`. Current tests stub database model methods; they do not prove live database behavior.
- Keep API contracts in [backend API documentation](./backend/docs/API_DOCUMENTATION.md) and update it when approved API behavior changes.
- Write professional English documentation and use the unique requirement, specification, ADR, and task IDs in the governance documents.
- Detailed workflow, status meanings, and source-of-truth links are in the [development governance report](./docs/12-project-reports/DEVELOPMENT_GOVERNANCE_REPORT.md).

## Completion

A task is complete only when its approved acceptance criteria pass, tests and checks are recorded, documentation and traceability are updated, security and database impacts are reviewed, and limitations are stated. Never claim verification without direct evidence.
