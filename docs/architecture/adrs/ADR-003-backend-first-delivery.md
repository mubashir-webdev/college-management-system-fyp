# ADR-003: Backend-First Delivery

**Decision ID:** ADR-003<br>
**Status:** Accepted<br>
**Date:** 2026-11-07

## Context

The project owner confirmed frontend development has not started and directed backend completion before frontend work.

## Problem

Premature UI work risks encoding unapproved workflows or unstable API contracts.

## Considered alternatives

- Start frontend work in parallel.
- Complete and verify approved backend scope, then begin frontend integration.

## Decision

Defer frontend implementation until approved backend requirements, endpoint contracts, authorization, isolated DB integration, tests, security review, database/API documentation, limitations, and a completion report are satisfied and owner-approved.

## Consequences

Maintain accurate API contracts and record the absence of frontend source. A working server or passing mocked suite alone does not open the frontend gate.
