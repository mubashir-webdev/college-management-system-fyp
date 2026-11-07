# User Roles

**ID:** DOC-REQ-ROLES-001<br>
**Version:** 1.0<br>
**Status:** Draft; permissions require owner confirmation<br>
**Last reviewed:** 2026-11-07

## Role catalogue

The README names Principal, HOD, Teacher, CR, Student, and Parent/Guardian. User documents and models store a role name on a user; a permission document stores permissions for a role name. The backend currently checks an active permission document and supports `*`.

The README's listed permissions are requirements candidates only. They are not verified grants and must not be written to the database without explicit approval.

| Role | README-described intent | Policy questions |
|---|---|---|
| Principal | Full system access | Is wildcard access permitted for all operations, including sensitive data and account administration? |
| HOD | Department-level activities | How is department membership linked and enforced? |
| Teacher | Assigned academic responsibilities | How are assigned classes/subjects linked and scoped? |
| CR | Limited class-level responsibilities | Who appoints a CR and what actions require review? |
| Student | Own profile and academic information | What identity link establishes ownership? |
| Parent / Guardian | Information about a verified child | What verification, consent, and revocation rules apply? |

## Authorization baseline

No ownership, department, class, or parent-child data scope is implemented in the inspected backend. Do not infer that role permission checks provide row-level authorization. See [SPEC-IAM-001](../03-feature-specifications/SPEC-IAM-001-authorization.md) and [open questions](../12-project-reports/OPEN_QUESTIONS.md).
