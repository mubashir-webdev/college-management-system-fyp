# Subject Index Migration and Isolated Test Plan

## Scope and current state

The confirmed application database is `college_management`. The live `subjects`
collection was read-only inspected: it had zero documents and only the default
`_id` index. The Mongoose Subject schema declares a unique `subjectCode` index,
but that index is not present in the collection.

This document is a plan only. No database, collection, document, or index is
created by following the inspection steps below. The migration requires separate
owner approval before an operator runs any index-creation command.

## Isolated local integration database

The existing `npm test` suite uses mocked model operations and does not require
MongoDB. For future manual integration testing, use a dedicated local database
named `college_management_test`, not `college_management`.

In a dedicated PowerShell window, configure the process environment before
starting the backend:

```powershell
Set-Location "E:\DEVELOPING\college-management-system fyp\backend"
$env:MONGO_URI = "mongodb://127.0.0.1:27017/college_management_test"
npm start
```

The process environment value takes precedence over the value loaded from
`backend/.env`. Before sending any write request, verify the server's MongoDB
connection targets `college_management_test`; do not display or copy the real
connection string. If the local MongoDB installation requires authentication,
use a separately provisioned test-only connection value without placing it in
this document or in shell history.

Stop the server after testing and clear the process-scoped override:

```powershell
Remove-Item Env:\MONGO_URI
```

No test database is created during this phase. MongoDB may create it on the
first write, so do not issue write requests until the isolated target is
verified. The current mock-based automated tests should continue to run with
`npm test` and do not exercise live CRUD.

## Subject unique-index migration procedure

**Separate approval is required before index creation.** Do not run this
migration against any database other than the confirmed `college_management`.
Do not use `syncIndexes()`, drop indexes, or alter/delete/merge subject
documents.

1. Schedule a controlled maintenance window and ensure no application startup
   can create the index implicitly. Mongoose `autoIndex` is not explicitly
   disabled in the current connection configuration; the model's `unique`
   declaration alone is not proof that the database index exists. The
   migration connection must set auto-indexing off and create only the named
   index below.
2. Connect using the operator's protected environment configuration without
   printing the connection string. Before reading or changing the collection,
   assert from the driver's selected database name that it is exactly
   `college_management`. Abort on any mismatch.
3. Perform read-only validation before creating the index:
   - Count documents with `subjectCode` missing or `null`.
   - Count documents with a non-string or blank/whitespace-only `subjectCode`.
   - Group string `subjectCode` values and count exact duplicate groups and
     affected documents. Also report duplicates after trimming whitespace so
     legacy values cannot conceal logical duplicates.
   - Abort without creating an index if any invalid/missing/null value or
     duplicate group exists. Any cleanup must be separately reviewed and
     approved; this migration never changes documents.
4. Require the operator to provide an explicit `--apply` confirmation flag.
   Without the flag, the migration must finish after reporting the preflight
   and must not call `createIndex`.
5. After a separate approval, and only if all preflight counts are zero, create
   exactly this index:

   ```javascript
   db.collection("subjects").createIndex(
     { subjectCode: 1 },
     { unique: true, name: "subjectCode_1" }
   )
   ```

6. Read back the index list and confirm the named index has key
   `{ subjectCode: 1 }` and `unique: true`. Report success only after that
   verification. Do not drop or recreate any existing index.

No migration script is included or executed in this phase. The code review and
preflight remain a prerequisite before preparing an executable script.
