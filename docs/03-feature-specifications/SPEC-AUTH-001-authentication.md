# Authentication Specification

**Specification ID:** SPEC-AUTH-001<br>
**Feature name:** Login and token authentication<br>
**Version:** 1.0<br>
**Status:** DRAFT; observed API contract, lifecycle needs owner confirmation<br>
**Requirement IDs:** FR-AUTH-001, FR-AUTH-002, NFR-SEC-001<br>
**Related ADRs:** ADR-001, ADR-002<br>
**Last updated:** 2026-11-07

## 1. Specification ID
SPEC-AUTH-001.

## 2. Feature name
Login and token authentication.

## 3. Version
1.0.

## 4. Status
DRAFT. This records observed behavior; account lifecycle policy is unconfirmed.

## 5. Purpose
Describe current authentication behavior without implying account lifecycle features that are absent.

## 6. Scope
Email/password login and Bearer-token authentication for protected API requests. Registration, recovery, MFA, logout, and token revocation are not specified.

## 7. Actors and roles
An existing user account holder; no special role is required to attempt public login.

## 8. Preconditions
API has required configuration; the user account exists.

## 9. Postconditions
Successful login returns a JWT and basic non-password user fields. Failure issues no token.

## 10. Functional requirements
`POST /api/auth/login` accepts email and password. Login checks active account status and bcrypt password comparison. Protected requests verify a JWT and load an active user. Current token lifetime is seven days.

## 11. Business rules
Inactive users cannot log in. Password policy, account recovery, revocation, and session rules require owner approval.

## 12. Data requirements
User model stores name, unique email, password hash, role name, status, and timestamps.

## 13. Field definitions
Request fields: `email` string and `password` string. Success response contains token and user ID, name, email, and role; it excludes password.

## 14. Validation rules
Both credential fields must be non-empty strings. Email lookup is trimmed and lowercased. Login is rate-limited per client IP with configurable defaults.

## 15. API requirements
Public `POST /api/auth/login`; protected endpoints use `Authorization: Bearer <JWT>`. Exact response details are in [API_DOCUMENTATION.md](../../backend/docs/API_DOCUMENTATION.md).

## 16. Authorization requirements
Authentication middleware requires valid token and active user. Each protected operation also requires its configured permission as defined in SPEC-IAM-001.

## 17. Error handling
Missing/invalid credentials receive 400/401; inactive login receives 403; rate limit receives 429. Unexpected failures return generic errors.

## 18. Edge cases
Missing account, wrong password, inactive account, malformed token, expired token, invalid JSON, and rate-limited requests.

## 19. Security requirements
Never return or log passwords, tokens, or connection strings. Keep `JWT_SECRET` private. Do not weaken token or permission verification.

## 20. Audit and logging requirements
Current handlers log error identifiers/names, not credential values. Security event retention and audit logging requirements need owner confirmation.

## 21. Dependencies
MongoDB user collection, bcryptjs, JWT secret, and permission middleware on protected routes.

## 22. Acceptance criteria
Current implementation returns a token only for valid active credentials and never includes password in the response. This observed contract is not full backend completion.

## 23. Test scenarios
Current mock-based suite covers missing fields, wrong password, successful mock login without password disclosure, and generic unexpected error. Live authentication is not verified.

## 24. Open questions
Confirm password policy, registration, password reset/change, MFA, logout/revocation, session management, and login rate-limit production strategy.

## 25. Change history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-07 | Recorded observed login contract and lifecycle boundaries. |
