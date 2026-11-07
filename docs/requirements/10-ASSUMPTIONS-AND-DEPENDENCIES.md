# Assumptions and Dependencies

**ID:** DOC-REQ-ASSUMPTIONS-001<br>
**Version:** 1.0<br>
**Status:** Draft; assumptions are not approvals<br>
**Last reviewed:** 2026-11-07

| ID | Item | Basis | Action |
|---|---|---|---|
| AS-001 | README module lists express intended direction, not complete approved scope. | Governance directive prohibits speculative requirements. | Owner confirms in-scope modules and workflow. |
| AS-002 | The local backend test suite can run without MongoDB. | Test implementation stubs model methods. | Keep test evidence labelled mocked. |
| AS-003 | A separate MongoDB database can be provisioned for live integration testing. | Governance policy requires isolation; no such run occurred in this audit. | Provision and verify target before writes. |
| DP-001 | Existing local MongoDB and stored role/permission data may be necessary for end-to-end verification. | Existing architecture and audit notes. | Obtain approved test identity and isolated environment. |
| DP-002 | Parent, student, teacher, and department scoping requires stable identity/relationship data. | Current backend lacks those relations. | Confirm domain model before schema/API work. |
| DP-003 | Production CORS, proxy, rate limiting, backup, monitoring, and deployment depend on target infrastructure. | No deployment topology found. | Define deployment environment before production readiness. |

No item in this document authorizes database or production changes.
