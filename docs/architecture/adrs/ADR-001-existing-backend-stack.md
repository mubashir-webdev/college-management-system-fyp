# ADR-001: Preserve the Existing Backend Stack

**Decision ID:** ADR-001<br>
**Status:** Accepted as current-state constraint<br>
**Date:** 2026-11-07

## Context

The existing backend uses Node.js, CommonJS, Express, Mongoose, MongoDB, JWT, and bcryptjs. Existing source and tests provide working patterns.

## Problem

Governance must prevent a documentation phase from becoming an unapproved rebuild or introducing unnecessary dependencies.

## Considered alternatives

- Preserve the existing stack and evolve only through approved tasks.
- Replace or redesign the backend stack.

## Decision

Preserve the current stack and module boundaries unless an approved ADR justifies a necessary change.

## Consequences

Reuse established route/controller/model and Node test-runner patterns. Evaluate dependencies only within an approved task. This decision does not certify production readiness or imply every existing behavior is a confirmed business requirement.
