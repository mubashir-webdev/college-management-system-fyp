# Platform and Health Specification

**Specification ID:** SPEC-PLATFORM-001<br>
**Feature name:** API startup and health checks<br>
**Version:** 1.0<br>
**Status:** DRAFT; observed behavior, deployment policies pending<br>
**Requirement IDs:** FR-PLAT-001, NFR-REL-001<br>
**Related ADRs:** ADR-001, ADR-002<br>
**Last updated:** 2026-11-07

## 1. Specification ID
SPEC-PLATFORM-001.

## 2. Feature name
API startup and health checks.

## 3. Version
1.0.

## 4. Status
DRAFT; current behavior is described without production deployment assumptions.

## 5. Purpose
Describe startup gating, health endpoints, and generic request errors.

## 6. Scope
Required environment configuration, MongoDB connection-before-listen startup, root response, health checks, bounded JSON parsing, 404/errors, and graceful shutdown.

## 7. Actors and roles
Operators and health probes; health endpoints are public.

## 8. Preconditions
`MONGO_URI` and `JWT_SECRET` are configured; MongoDB connection succeeds before server listen.

## 9. Postconditions
`/health/live` responds while HTTP is serving; `/health/ready` reports ready only while Mongoose connection state is connected.

## 10. Functional requirements
`GET /` reports API-running. Liveness and readiness are separate. JSON body limit is 100 KB. Unknown routes and parser errors return JSON.

## 11. Business rules
Readiness is not equivalent to application-wide correctness or production availability.

## 12. Data requirements
No domain data is read or changed by health endpoints. Readiness observes Mongoose connection state.

## 13. Field definitions
Responses contain `success`, status, and readiness database state as documented in [API_DOCUMENTATION.md](../../backend/docs/API_DOCUMENTATION.md).

## 14. Validation rules
Startup requires non-empty `MONGO_URI` and `JWT_SECRET`; malformed JSON and oversized bodies produce controlled errors.

## 15. API requirements
Public `GET /`, `GET /health/live`, and `GET /health/ready`.

## 16. Authorization requirements
Health endpoints are public; all domain endpoints retain their authentication/permission middleware.

## 17. Error handling
Unknown path 404; malformed JSON 400; oversized request 413; generic unexpected error 500; not-ready 503.

## 18. Edge cases
Missing env settings, failed DB connection, DB disconnect after startup, invalid body, oversized body, shutdown while serving.

## 19. Security requirements
Never expose URI, secrets, or internal stack traces in responses/logs. Do not enable automatic index creation against the application database without approval.

## 20. Audit and logging requirements
Startup and failure paths log coarse errors; production logging, monitoring, and retention are not specified.

## 21. Dependencies
Node.js runtime, dotenv, Express, Mongoose, MongoDB, and approved operational configuration.

## 22. Acceptance criteria
Current implementation and tests cover API liveness/readiness response handling, but no production environment or live DB integration was verified here.

## 23. Test scenarios
Existing suite tests live endpoint response and errors with an in-process server; it does not establish a live MongoDB deployment.

## 24. Open questions
Confirm production host/origins, proxy and rate-limit topology, monitoring, backups, recovery targets, and index policy.

## 25. Change history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-07 | Recorded current behavior and operational unknowns. |
