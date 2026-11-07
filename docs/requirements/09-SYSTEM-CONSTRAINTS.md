# System Constraints

**ID:** DOC-REQ-CONSTRAINTS-001<br>
**Version:** 1.0<br>
**Status:** Active constraints with pending deployment decisions<br>
**Last reviewed:** 2026-11-07

## Confirmed constraints

- Preserve the existing repository and uncommitted changes; this is not a greenfield rebuild.
- Backend-first delivery. Frontend development is not started and is prohibited until backend completion is documented.
- The application database is `college_management`; preserve its data.
- Integration write tests must use an isolated test database.
- No production migrations, index changes, role/permission changes, real `.env` changes, destructive actions, or live deployment without explicit owner approval.
- Project documentation is professional English.
- No feature may be implemented without approved requirement, specification, and task.

## Observed technical constraints

- Backend package is CommonJS JavaScript with Express 5, Mongoose, MongoDB, JWT, bcryptjs, dotenv, CORS, and express-rate-limit.
- Tests use Node's built-in runner and currently stub Mongoose model methods.
- `backend/.env` is tracked and contains sensitive configuration by design; do not read into reports, remove, or rewrite without approved remediation.
- No frontend directory content or frontend package manifest was present during this audit.

## Decisions pending

Production hosting, frontend origin, proxy topology, shared rate-limit store, supported browser/client, privacy obligations, retention, backup/recovery targets, and performance targets remain unknown.
