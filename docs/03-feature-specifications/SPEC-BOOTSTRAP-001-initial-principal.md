# Initial Principal Bootstrap Specification

**Specification ID:** SPEC-BOOTSTRAP-001<br>
**Feature name:** Initial Principal account setup script<br>
**Version:** 1.0<br>
**Status:** DRAFT; operational policy requires owner confirmation<br>
**Requirement IDs:** FR-USR-001, NFR-SEC-001<br>
**Related ADRs:** ADR-001, ADR-002<br>
**Last updated:** 2026-11-07

## 1. Specification ID
SPEC-BOOTSTRAP-001.

## 2. Feature name
Initial Principal account setup.

## 3. Version
1.0.

## 4. Status
DRAFT; the script was inspected but not executed.

## 5. Purpose
Record the existing one-time operational bootstrap utility without authorizing its execution.

## 6. Scope
`backend/scripts/createInitialPrincipal.js` reads initial-admin environment settings and creates an account if one does not already exist. It expects an active `principal` Role document and does not create role or permission records. It uses dotenv's default current-working-directory lookup, unlike the server's backend-relative dotenv path, and logs the Principal email after creation.

## 7. Actors and roles
An authorized system operator provisioning an initial Principal account.

## 8. Preconditions
Approved database target, required protected environment settings, and active principal role exist. The operator must verify both the environment source and selected database; neither may be assumed safe from the current directory or a database name alone.

## 9. Postconditions
If run successfully, a Principal user account may be written. No permissions are created by the script.

## 10. Functional requirements
The script validates a minimum password length of 12 characters, hashes the password, and avoids creating a duplicate account according to its current logic.

## 11. Business rules
Provisioning policy, uniqueness, recovery, rotation, and whether the script may be rerun require owner approval.

## 12. Data requirements
Writes to the `users` collection and depends on a role in `roles`.

## 13. Field definitions
Inputs: initial admin name, email, and password via environment variables. Values are sensitive and are not documented here.

## 14. Validation rules
The script requires its configured inputs and enforces password length. Exact behavior must be re-reviewed before a future approved task.

## 15. API requirements
No HTTP endpoint. This is a command-line setup script.

## 16. Authorization requirements
Execution requires an operator with explicit authority to target a designated database. This document grants no such authority.

## 17. Error handling
Inspect script behavior and record failures before any approved run; no execution evidence exists for this audit.

## 18. Edge cases
Missing role, duplicate user, missing/invalid environment inputs, wrong database, and repeated execution.

## 19. Security requirements
Never put credentials in command history, logs, source control, or reports. The current script logs the Principal email, which is personal data; confirm approved logging and retention before use. Do not run against production/application data without explicit approval.

## 20. Audit and logging requirements
No run was performed. Define operator/audit evidence before approving use.

## 21. Dependencies
User and Role models, MongoDB, bcryptjs, and protected environment configuration.

## 22. Acceptance criteria
No acceptance claim is made until the script has an approved use case and has been tested against a verified isolated target.

## 23. Test scenarios
Future tests should cover missing role, duplicate identity, password hashing, safe errors, and isolated-target enforcement without exposing secrets.

## 24. Open questions
Confirm whether this bootstrap process is required, who may run it, what environment protects secrets, how the first role/permissions are provisioned, and whether its email logging and dotenv path behavior are acceptable.

## 25. Change history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-07 | Documented existing utility without executing it. |
