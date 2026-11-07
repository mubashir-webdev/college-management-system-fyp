# Open Questions

**ID:** DOC-OPEN-QUESTIONS-001<br>
**Version:** 1.0<br>
**Status:** Awaiting owner decisions<br>
**Last reviewed:** 2026-11-07

These questions are non-blocking for this audit/governance phase but block the affected implementation. No answer is assumed.

| ID | Question | Why it matters | Options / current recommendation |
|---|---|---|---|
| Q-REQ-001 | Which README-listed features are mandatory for the FYP, and what is explicitly excluded? | Defines backend scope, acceptance, and sequencing. | Confirm a prioritized in-scope list; do not treat README examples as commitments. |
| Q-AUTH-001 | Should inactive Role records disable users even when their Permission record is active? | Current authorization ignores Role status. | Yes / no / another policy; recommend explicit deny on inactive role if role status is authoritative, subject to owner approval. |
| Q-AUTH-002 | Is Principal wildcard `*` permitted for all current and future operations? | Wildcard implicitly grants future permissions. | Keep wildcard with limits / enumerate grants / define protected exceptions. |
| Q-AUTH-003 | What data scope applies to HOD, Teacher, Student, CR, and Parent roles? | Current checks are role-level; no department/class/ownership links exist. | Define concrete record visibility and identity relationships per role. |
| Q-AUTH-004 | Which stored role-operation grants are intended, especially teacher/subject writes? | Existing docs report some grants absent; do not mutate them. | Provide approved role-permission matrix. |
| Q-DATA-001 | Are student delete, retention/archive, search/filter/pagination, email uniqueness, and identifier formats required? | Affects data lifecycle, API, indexes, and tests. | Specify each separately; do not assume destructive deletion. |
| Q-ACA-001 | What are the required academic entities and rules for enrollment, subjects, attendance, results/exams, timetables, and leaves? | README has module names but no testable behavior or data relationships. | Prioritize modules and provide grading, calendar, approval, and relationship rules. |
| Q-PARENT-001 | How are guardians verified, linked to children, consented, and revoked? | Necessary to prevent unauthorized access to student data. | Define owner-controlled verification and authorization lifecycle before parent API work. |
| Q-AUTH-005 | Are registration, password reset/change, MFA, logout/revocation, and session management required? | Current login-only API does not define the account lifecycle. | Confirm required flows and password/session policies. |
| Q-DB-001 | Who provisions the isolated integration database and test roles/accounts, and how is its identity verified? | Live write tests must never target `college_management`. | Approve local/test-only environment and explicit pre-write identity check. |
| Q-OPS-001 | What are production origins, hosting/proxy topology, shared rate-limit store, backups, monitoring, and recovery targets? | Needed for production readiness and secure operational defaults. | Supply deployment architecture and measurable SLO/RPO/RTO targets. |
| Q-SEC-001 | Has `backend/.env` ever contained valid/shared credentials in source control or remote history, and who will approve remediation/rotation? | It is tracked; contents were not read or reproduced during this audit. | Coordinate credential review/rotation and separate untracking/history actions; no change made. |
| Q-SEC-002 | What are required privacy, data retention, audit-log, and breach-response policies? | Student and parent data may be sensitive; compliance obligations are unknown. | Obtain institutional policy before production acceptance. |
| Q-SEC-003 | Is it acceptable for the initial Principal bootstrap script to log the account email, and how must operators load its environment configuration? | The script currently prints the email and uses dotenv's current-working-directory lookup; it was not executed. | Define PII logging/retention and a controlled invocation/environment source before approving use. |
