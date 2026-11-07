# User Journeys

**ID:** DOC-REQ-JOURNEYS-001<br>
**Version:** 1.0<br>
**Status:** Draft based on current API and high-level README statements<br>
**Last reviewed:** 2026-11-07

## Current authentication journey (API-level)

1. User submits email and password to `POST /api/auth/login`.
2. API validates input, locates the account, checks active status and password, and returns a JWT on success.
3. User sends the token as a Bearer token to a protected endpoint.
4. API loads the active user and checks the requested permission.
5. API returns the protected resource or an authorization/error response.

Password reset, enrollment, account creation, token revocation, and recovery journeys are not implemented or specified.

## Candidate academic role journeys

The README describes students viewing their own records, teachers handling assigned academic responsibilities, HODs working at department level, and parents accessing verified-child information. The identity links, data boundaries, decisions, and exceptional flows are unspecified. These journeys remain `NEEDS_OWNER_CONFIRMATION`; no implementation acceptance criteria may be derived from them yet.
