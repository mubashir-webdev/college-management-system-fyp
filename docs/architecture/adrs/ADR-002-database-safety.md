# ADR-002: Protect the Application Database

**Decision ID:** ADR-002<br>
**Status:** Accepted<br>
**Date:** 2026-11-07

## Context

The confirmed application database is `college_management`, with existing data that must be preserved. Current automated tests stub Mongoose models.

## Problem

Development or verification must not accidentally mutate the application database, its records, indexes, roles, or permissions.

## Considered alternatives

- Run integration writes against the application database.
- Use a separately identified isolated test database for integration writes.

## Decision

Use only a separate isolated test database for integration write tests. Verify database identity before any write. Any production/app database index migration, migration, or role/permission change requires explicit approval and documented preflight.

## Consequences

Mocked tests remain useful but do not establish live integration. Database docs must distinguish historical read-only observations from current verified state. No database operations are authorized by this ADR.
