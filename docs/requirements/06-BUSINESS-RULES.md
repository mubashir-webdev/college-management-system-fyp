# Business Rules

**ID:** DOC-REQ-BR-001<br>
**Version:** 1.0<br>
**Status:** Draft; distinguish observed behavior from approved policy<br>
**Last reviewed:** 2026-11-07

## Observed rules (not automatically approved business policy)

| ID | Current code behavior | Source |
|---|---|---|
| BR-OBS-001 | Login rejects inactive user accounts. | `backend/src/controllers/authController.js` |
| BR-OBS-002 | Authorization checks an active permission record for the user's role and accepts the requested permission or `*`. | `backend/src/middleware/permissionMiddleware.js` |
| BR-OBS-003 | Student semester is constrained to integer values 1 through 12; student status is active, inactive, or graduated. | Student controller/model |
| BR-OBS-004 | Teacher and subject DELETE routes set status to inactive rather than removing records. | Teacher and subject controllers |
| BR-OBS-005 | Teacher and subject identifiers are immutable through their update routes. | Teacher and subject controllers |
| BR-OBS-006 | The login token is configured to expire after seven days. | `backend/src/utils/generateToken.js` |

## Policies requiring owner decisions

- Whether an inactive Role document must disable its users.
- Whether a wildcard Principal permission is acceptable for every future operation.
- Whether student, teacher, subject, and parent access is department/class/ownership scoped.
- Identifier formats, uniqueness normalization, retention, archival, and deletion rules.
- Academic calendar, enrollment, grading, attendance, leave, fee, timetable, and notification policies.
- Password lifecycle, account recovery, MFA, session revocation, and audit-log retention.

Do not treat values currently encoded in schemas as confirmed institutional policy without owner review.
