# Backend API

## Local setup

From `backend/`:

1. Copy `.env.example` to `.env` and set `MONGO_URI` and a private, strong `JWT_SECRET`.
2. Set `CORS_ORIGINS` to comma-separated exact browser origins for your deployment. Do not add a production host until it is known and controlled.
3. Install the dependencies with `npm install` if they are not already installed.
4. Start the API with `npm start`, or use `npm run dev` during development.
5. Run automated tests with `npm test`. Tests use stubbed model methods and do not require a database.

The server loads `backend/.env` regardless of the shell's working directory. Startup fails with a clear message if `MONGO_URI` or `JWT_SECRET` is missing. The intended application database is `college_management`. Do not commit `.env` or use real credentials in tests. `.env.example` documents setting names and safe local defaults only.

The automated `npm test` suite uses mocked model operations and does not connect to MongoDB. For a future manual integration run, use a separate development MongoDB database such as `college_management_test`; see [SUBJECT_INDEX_MIGRATION_PLAN.md](./SUBJECT_INDEX_MIGRATION_PLAN.md) for a process-scoped PowerShell example. Do not run write tests against `college_management`.

## CORS and login throttling

CORS allows exact origins listed in `CORS_ORIGINS` (comma-separated, including scheme and port). When the setting is blank or absent, the backend allows only `http://localhost:3000`, `http://127.0.0.1:3000`, `http://localhost:5173`, and `http://127.0.0.1:5173` outside production. In production, a blank setting allows no cross-origin browser origins. Requests without an `Origin` header are not blocked by CORS; CORS is not a substitute for authentication or authorization.

`POST /api/auth/login` is limited per client IP. Defaults are 10 attempts per 15 minutes. Configure `LOGIN_RATE_LIMIT_WINDOW_MS` (milliseconds) and `LOGIN_RATE_LIMIT_MAX` (positive integers) to tune the policy. Exceeded limits receive HTTP 429 with a generic message and standard rate-limit headers. The current store is in-memory and per process. Multi-instance deployments need a shared store; proxy trust should be configured only for known infrastructure.

## Base URL

By default, the API listens on `http://localhost:5000`. Set `PORT` to use another port.

## Health

| Method | Path | Authentication | Description |
|---|---|---|---|
| GET | `/` | None | Existing API-running response; does not itself report database readiness. |
| GET | `/health/live` | None | Returns 200 when the HTTP process is serving requests. |
| GET | `/health/ready` | None | Returns 200 when Mongoose is connected, otherwise 503. |

## Authentication

### `POST /api/auth/login`

Public endpoint. Send JSON:

```json
{
  "email": "user@example.test",
  "password": "your-password"
}
```

Successful response (200) contains a seven-day JWT and basic user details. The password is not returned. Missing or non-string credentials receive 400; invalid credentials receive 401; inactive accounts receive 403.

For protected routes, provide the JWT returned by login in the `Authorization` request header using the standard Bearer scheme. The token is verified using `JWT_SECRET`; the active user is then loaded from the database. Protected routes also require an active permission record for the user's role.

## Protected test endpoint

| Method | Path | Required permission |
|---|---|---|
| GET | `/api/test/protected` | `own_profile.view` |

This endpoint returns basic authenticated-user information for testing middleware.

## Student endpoints

All student routes require an authenticated request and the indicated permission. Access is currently role-permission based; department, class, student ownership, or parent-child scoping is not implemented.

| Method | Path | Required permission | Description |
|---|---|---|---|
| GET | `/api/students` | `students.view` | List students, newest first. The list is currently unpaginated. |
| GET | `/api/students/:studentId` | `students.view` | Retrieve by the application `studentId`, not MongoDB `_id`. |
| POST | `/api/students` | `students.create` | Create a student. |
| PATCH | `/api/students/:studentId` | `students.update` | Update allowed student fields. |

Create request example:

```json
{
  "studentId": "STU-1001",
  "name": "Example Student",
  "email": "student@example.test",
  "phone": "555-0100",
  "department": "Science",
  "semester": 1,
  "status": "active"
}
```

`studentId`, `name`, `department`, and integer `semester` (1–12) are required. `status` may be `active`, `inactive`, or `graduated`; if omitted it defaults to `active`. Unknown fields are rejected. Email is optional, basic-format checked when non-empty, and not unique under the current schema.

Updates accept one or more of `name`, `email`, `phone`, `department`, `semester`, and `status`. `semester` must be an integer from 1 to 12. `status` must be `active`, `inactive`, or `graduated`. `studentId` cannot be changed through this endpoint. Empty bodies and unknown fields receive 400.

No DELETE route is registered. Permanent deletion awaits confirmation of retention rules and related records.

## Teacher endpoints

All teacher routes require a valid Bearer JWT and the operation permission below. Teacher records are addressed by `teacherId`, not MongoDB `_id`.

| Method | Path | Required permission | Description |
|---|---|---|---|
| GET | `/api/teachers` | `teachers.view` | List active and inactive teachers, newest first. |
| GET | `/api/teachers/:teacherId` | `teachers.view` | Retrieve one teacher by teacher ID. |
| POST | `/api/teachers` | `teachers.create` | Create a teacher profile. |
| PATCH | `/api/teachers/:teacherId` | `teachers.update` | Update profile/contact fields. |
| DELETE | `/api/teachers/:teacherId` | `teachers.delete` | Deactivate the teacher (`status: inactive`); does not delete the record. |

Create request example:

```json
{
  "teacherId": "TCH-1001",
  "name": "Example Teacher",
  "email": "teacher@example.test",
  "phone": "555-0101",
  "department": "Science"
}
```

`teacherId`, `name`, and `department` are required non-empty strings. Email is optional; when provided it must have a basic valid email format and is normalized to lowercase. Teacher IDs and non-empty emails must be unique. Phone is optional and must be a string. `status` is assigned by the API and starts as `active`. Client-supplied `status`, `role`, `userId`, and all other unknown fields are rejected.

Successful creation returns HTTP 201:

```json
{
  "success": true,
  "message": "Teacher created successfully",
  "teacher": {
    "teacherId": "TCH-1001",
    "name": "Example Teacher",
    "email": "teacher@example.test",
    "phone": "555-0101",
    "department": "Science",
    "status": "active"
  }
}
```

Updates accept one or more of `name`, `email`, `phone`, and `department`; fields must meet the same validation rules. `teacherId` cannot be changed. Setting email to an empty string or null clears it. Empty updates and unknown fields receive 400.

Deactivation is a soft delete so future teacher leave/academic records can retain the profile reference. It requires `teachers.delete`; it does not remove a linked User account because no Teacher-to-User relationship exists in the current backend.

Deactivation returns HTTP 200 with the teacher's status set to `inactive`; requesting an unknown teacher returns 404.

Example PowerShell requests (run from PowerShell after starting the API):

```powershell
$baseUrl = "http://localhost:5000"
$token = "<JWT returned by POST /api/auth/login>"
$headers = @{ Authorization = "Bearer $token" }

$teacher = @{
  teacherId = "TCH-1001"
  name = "Example Teacher"
  email = "teacher@example.test"
  phone = "555-0101"
  department = "Science"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "$baseUrl/api/teachers" -Headers $headers -ContentType "application/json" -Body $teacher
Invoke-RestMethod -Method Get -Uri "$baseUrl/api/teachers" -Headers $headers
Invoke-RestMethod -Method Get -Uri "$baseUrl/api/teachers/TCH-1001" -Headers $headers
Invoke-RestMethod -Method Patch -Uri "$baseUrl/api/teachers/TCH-1001" -Headers $headers -ContentType "application/json" -Body (@{ phone = "555-0102" } | ConvertTo-Json)
Invoke-RestMethod -Method Delete -Uri "$baseUrl/api/teachers/TCH-1001" -Headers $headers
```

The configured database currently contains `teachers.view` for the `hod` role only. No `teachers.create`, `teachers.update`, or `teachers.delete` permission was found in the inspected permission records. Do not expect write/deactivation operations to succeed until an administrator approves and configures those permissions. No permissions were changed in this phase.

## Subject endpoints

Subject records use `subjectCode` as their stable identifier. Every endpoint requires a valid Bearer JWT and the matching permission:

| Method | Path | Required permission | Description |
|---|---|---|---|
| GET | `/api/subjects` | `subjects.view` | List subjects, newest first. |
| GET | `/api/subjects/:subjectCode` | `subjects.view` | Retrieve by subject code. |
| POST | `/api/subjects` | `subjects.create` | Create a subject. |
| PATCH | `/api/subjects/:subjectCode` | `subjects.update` | Update the subject name. |
| DELETE | `/api/subjects/:subjectCode` | `subjects.delete` | Soft-deactivate the subject; the record remains stored. |

The current subject profile is intentionally minimal because the inspected collection was empty and no prior Subject model or field requirements existed. `subjectCode` and `name` are required, trimmed non-empty strings. Subject code is immutable after creation and unique. Status is controlled by the API (`active` on create; `inactive` after DELETE); clients cannot assign status. Unknown fields are rejected. Department, semester, credits, and teacher/class relationships are not part of this initial schema.

Create request:

```json
{
  "subjectCode": "BIO-101",
  "name": "Biology"
}
```

Successful create response (201):

```json
{
  "success": true,
  "message": "Subject created successfully",
  "subject": {
    "subjectCode": "BIO-101",
    "name": "Biology",
    "status": "active"
  }
}
```

PowerShell examples (start the backend first and provide a JWT from an approved test account):

```powershell
$baseUrl = "http://localhost:5000"
$token = "<JWT returned by login>"
$headers = @{ Authorization = "Bearer $token" }

$subject = @{
  subjectCode = "BIO-101"
  name = "Biology"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "$baseUrl/api/subjects" -Headers $headers -ContentType "application/json" -Body $subject
Invoke-RestMethod -Method Get -Uri "$baseUrl/api/subjects" -Headers $headers
Invoke-RestMethod -Method Get -Uri "$baseUrl/api/subjects/BIO-101" -Headers $headers
Invoke-RestMethod -Method Patch -Uri "$baseUrl/api/subjects/BIO-101" -Headers $headers -ContentType "application/json" -Body (@{ name = "General Biology" } | ConvertTo-Json)
Invoke-RestMethod -Method Delete -Uri "$baseUrl/api/subjects/BIO-101" -Headers $headers
```

The inspected permission records grant the Principal role all operations through its active `*` permission. No Subject-specific permissions were found for other roles. Apply any additional grants only through the approved administration process.

### Latest live verification status

The read-only local smoke check verified `GET /`, `/health/live`, and `/health/ready` (200), an unknown route (404), and unauthenticated `GET /api/subjects`, `/api/subjects/`, `/api/teachers`, and `/api/teachers/` (401). Login with missing fields returned 400; a synthetic nonexistent `.invalid` identity returned 401. These checks did not use an authorized account or token.

Authenticated Subject or Teacher requests, successful login, inactive-account rejection, permission-denied responses for a real role, and live CRUD have not been verified. No dedicated test database or approved test token was available. The owner confirmed `college_management` as the intended database; README and `.env.example` now align with this. The Subject collection currently has zero documents and only the `_id` index; its declared unique `subjectCode` index is not present. The smoke-test server disabled Mongoose auto-indexing, and no records or indexes were created or changed. See [SUBJECT_INDEX_MIGRATION_PLAN.md](./SUBJECT_INDEX_MIGRATION_PLAN.md) for the non-executed migration plan.

## Error responses

Responses use JSON with `success: false` and a message. Expected statuses include:

- 400: missing/invalid request data or malformed JSON.
- 401: missing, invalid, or expired token; invalid login.
- 403: inactive account or missing operation permission.
- 404: unknown route or missing student, teacher, or subject.
- 409: duplicate student or teacher identifier/email, or duplicate subject code.
- 429: login rate limit exceeded.
- 413: request body exceeds 100 KB.
- 500: unexpected server error; internal stacks and secret values are not returned.
- 503: database readiness check is not ready.

## Environment variables

| Name | Required | Purpose |
|---|---|---|
| `PORT` | No | HTTP port; defaults to `5000`. |
| `MONGO_URI` | Yes | MongoDB connection string. |
| `JWT_SECRET` | Yes | Secret used to sign and verify JWTs. Keep it private and use a strong random value. |
| `CORS_ORIGINS` | No | Comma-separated exact allowed origins; blank uses safe local development origins outside production and no cross-origin browser origins in production. |
| `LOGIN_RATE_LIMIT_WINDOW_MS` | No | Login rate-limit window in milliseconds; defaults to `900000` (15 minutes). |
| `LOGIN_RATE_LIMIT_MAX` | No | Login attempts allowed per IP per window; defaults to `10`. |
| `INITIAL_ADMIN_NAME` | Only for setup script | Initial Principal display name. |
| `INITIAL_ADMIN_EMAIL` | Only for setup script | Initial Principal email. |
| `INITIAL_ADMIN_PASSWORD` | Only for setup script | Initial Principal password; the script requires at least 12 characters. |

The setup script is `node scripts/createInitialPrincipal.js`. It requires an active `principal` role to already exist and does not create permissions or roles.

## Current limitations

The backend does not currently expose APIs for parents, attendance, results, timetables, leave requests, notices, notifications, system settings, or reports. The initial Subject API is a basic catalog and does not model department, semester, credits, or teacher/class relationships. The backend does not enforce per-user/department/class ownership scopes. The login limiter uses an in-memory per-process store. See [BACKEND_AUDIT.md](./BACKEND_AUDIT.md) before deployment or expanding authorization behavior.
