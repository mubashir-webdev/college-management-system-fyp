# Project Vision and Scope

**ID:** DOC-REQ-VISION-001<br>
**Version:** 1.0<br>
**Status:** Baseline draft; owner confirmation required<br>
**Last reviewed:** 2026-11-07

## Vision

Provide a centralized College Management System to support the academic and administrative operations described in the project README, while keeping access appropriate to a user's role and protecting institutional and personal information.

## Scope recorded from repository evidence

The README describes student and teacher management, academic information, subjects, attendance, results, timetables, notices, leaves, notifications, parent access, roles, permissions, and system settings. This is a statement of intended project direction, not confirmation that every listed capability is approved or required.

The current backend has an Express API with login, permission-checked student, teacher, and subject endpoints, a protected middleware test endpoint, and health endpoints. No frontend source files were present during the 2026-11-07 repository audit.

## Delivery boundary

- Backend-first. No frontend implementation until the backend completion criteria are met and recorded.
- Existing application architecture and data must be preserved.
- The confirmed application database name is `college_management`.
- New business behavior requires a confirmed requirement, an approved feature specification, and a linked task.

## Scope decisions still required

The owner must confirm which README modules and workflows are in FYP scope, required detail for each, and data access boundaries. See [open questions](../12-project-reports/OPEN_QUESTIONS.md).

## Change history

| Version | Date | Change |
|---|---|---|
| 1.0 | 2026-11-07 | Established evidence-based scope baseline without treating README plans as approved requirements. |
