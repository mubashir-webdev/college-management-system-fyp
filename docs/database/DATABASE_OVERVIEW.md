# Database Overview

**ID:** DOC-DB-001<br>
**Version:** 1.0<br>
**Status:** Current source inventory; no live database verification in this audit<br>
**Last reviewed:** 2026-11-07

## Safety and identity

The confirmed application database is `college_management`. Preserve its data. Write tests require a separately verified isolated database, for example a provisioned test-only database; do not assume one exists. No database connection, write, migration, or index operation was performed during this governance audit.

## Model inventory from source

| Model | Explicit collection | Source-level data |
|---|---|---|
| User | `users` | name, unique email, password, role name, active/inactive status, timestamps |
| Role | `roles` | unique role name, description, active/inactive status, timestamps |
| Permission | `permissions` | unique role name, permission strings, active/inactive status, timestamps |
| Student | `students` | unique studentId, name, optional email/phone, department, semester 1–12, status, timestamps |
| Teacher | `teachers` | unique teacherId, name, optional sparse unique email/phone, department, status, timestamps |
| Subject | `subjects` | unique subjectCode, name, status, timestamps |

Schema declarations do not prove that corresponding indexes exist in MongoDB. In particular, see the non-executed [Subject index migration plan](../../backend/docs/SUBJECT_INDEX_MIGRATION_PLAN.md). Do not run automatic index creation or `syncIndexes()` against the application database without approval.

## README-planned collections

The README also names parents, results, student/teacher leaves, notices, notifications, timetables, timetable changes, and system settings. These are not models found in the inspected backend source; their existence in a live database has not been established by this audit.

## Relationships and unknowns

No explicit Mongoose relations or model-level links were found to scope user access to departments, classes, student ownership, teacher assignments, or verified parent-child relationships. Retention, archival, backup, recovery, and privacy rules require owner decisions. Do not store credentials or connection strings in this document.
