# Non-Functional Requirements

**ID:** DOC-REQ-NFR-001<br>
**Version:** 1.0<br>
**Status:** Candidate baseline; owner confirmation required for targets<br>
**Last reviewed:** 2026-11-07

| ID | Requirement | Status / verification |
|---|---|---|
| NFR-SEC-001 | Passwords shall not be returned in API responses and shall be stored using an approved password-hashing scheme. | The README names bcryptjs; login response test covers omission. Strength and migration policy need owner/security approval. |
| NFR-SEC-002 | Protected requests shall require valid authentication and operation authorization. | Current implementation and mock-based tests cover representative paths; full role matrix and data scoping are not verified. |
| NFR-SEC-003 | Secrets and database connection strings shall not be exposed in source-control documentation, logs, or reports. | Required policy; tracked `backend/.env` is an unresolved exposure risk. |
| NFR-SEC-004 | Request inputs shall be validated and unexpected errors shall not disclose private internals. | Current APIs have validation and generic error responses; test coverage is mocked and module-specific. |
| NFR-REL-001 | Startup shall not report service readiness until database connection succeeds. | Current startup waits for connect; readiness endpoint checks connection state. |
| NFR-REL-002 | Tests that write data shall use an isolated test database and never the application database. | Confirmed governance constraint; no live integration test evidence exists in this audit. |
| NFR-API-001 | API errors shall use consistent JSON envelopes and appropriate HTTP status codes. | Current implementation partially follows this; standardization remains a tracked quality gap. |
| NFR-OPS-001 | Production origins, proxy trust, rate-limit storage, logging, backups, and monitoring shall be documented and approved before deployment. | No production deployment configuration was verified. |
| NFR-PERF-001 | Response-time, concurrency, availability, retention, recovery-point, and recovery-time targets shall be agreed before performance or production acceptance. | `NEEDS_OWNER_CONFIRMATION`; no numeric target is assumed. |

No quantitative service-level objective or privacy/legal policy is inferred from the repository.
