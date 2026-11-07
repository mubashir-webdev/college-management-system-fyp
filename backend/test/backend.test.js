const assert = require("node:assert/strict");
const http = require("node:http");
const {
  after,
  afterEach,
  before,
  test,
} = require("node:test");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = require("../src/app");
const { parseCorsOrigins } = require("../src/config/security");
const Permission = require("../src/models/permission");
const Student = require("../src/models/Student");
const Subject = require("../src/models/Subject");
const Teacher = require("../src/models/Teacher");
const User = require("../src/models/user");

const originalJwtSecret = process.env.JWT_SECRET;
const restoredMethods = [];
let server;
let baseUrl;
let passwordHash;

const startServer = async (targetApp) => {
  const testServer = http.createServer(targetApp);
  await new Promise((resolve) =>
    testServer.listen(0, "127.0.0.1", resolve)
  );
  return {
    server: testServer,
    baseUrl: `http://127.0.0.1:${testServer.address().port}`,
  };
};

const stopServer = async (testServer) =>
  new Promise((resolve, reject) => {
    testServer.close((error) => (error ? reject(error) : resolve()));
  });

const stub = (object, method, implementation) => {
  restoredMethods.push([object, method, object[method]]);
  object[method] = implementation;
};

const restoreMethods = () => {
  for (const [object, method, original] of restoredMethods.reverse()) {
    object[method] = original;
  }
  restoredMethods.length = 0;
};

const requestAt = async (
  url,
  path,
  { method = "GET", body, token, headers: extraHeaders = {} } = {}
) => {
  const headers = { ...extraHeaders };
  const options = { method, headers };

  if (body !== undefined) {
    headers["content-type"] = "application/json";
    options.body = JSON.stringify(body);
  }
  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${url}${path}`, options);
  const responseBody = await response.json();
  return { response, body: responseBody };
};

const request = (path, options) => requestAt(baseUrl, path, options);

const authorizeAsPrincipal = () => {
  stub(User, "findById", () => ({
    select: async () => ({
      _id: "test-principal",
      role: "principal",
      status: "active",
    }),
  }));
  stub(Permission, "findOne", async () => ({
    permissions: ["*"],
  }));

  return jwt.sign({ id: "test-principal" }, process.env.JWT_SECRET);
};

const authorizeWithPermissions = (permissions) => {
  stub(User, "findById", () => ({
    select: async () => ({
      _id: "test-user",
      role: "hod",
      status: "active",
    }),
  }));
  stub(Permission, "findOne", async () => ({ permissions }));

  return jwt.sign({ id: "test-user" }, process.env.JWT_SECRET);
};

const stubTeacherCollection = () => {
  const teachers = new Map();

  stub(Teacher, "findOne", async (query) => {
    if (query.$or) {
      return (
        Array.from(teachers.values()).find((teacher) =>
          query.$or.some((condition) =>
            Object.entries(condition).every(
              ([field, value]) => teacher[field] === value
            )
          )
        ) || null
      );
    }

    if (query.email !== undefined) {
      return (
        Array.from(teachers.values()).find(
          (teacher) =>
            teacher.email === query.email &&
            teacher.teacherId !== query.teacherId.$ne
        ) || null
      );
    }

    return teachers.get(query.teacherId) || null;
  });
  stub(Teacher, "create", async (values) => {
    const teacher = new Teacher(values);
    await teacher.validate();
    teachers.set(teacher.teacherId, teacher);
    return teacher;
  });
  stub(Teacher, "find", () => ({
    sort: async () => Array.from(teachers.values()),
  }));
  stub(Teacher, "findOneAndUpdate", async ({ teacherId }, update) => {
    const teacher = teachers.get(teacherId);
    if (!teacher) {
      return null;
    }
    if (update.$set) {
      teacher.set(update.$set);
    }
    if (update.$unset) {
      for (const field of Object.keys(update.$unset)) {
        teacher.set(field, undefined);
      }
    }
    await teacher.validate();
    return teacher;
  });

  return teachers;
};

const stubSubjectCollection = () => {
  const subjects = new Map();

  stub(Subject, "findOne", async ({ subjectCode }) =>
    subjects.get(subjectCode) || null
  );
  stub(Subject, "create", async (values) => {
    const subject = new Subject(values);
    await subject.validate();
    subjects.set(subject.subjectCode, subject);
    return subject;
  });
  stub(Subject, "find", () => ({
    sort: async () => Array.from(subjects.values()),
  }));
  stub(Subject, "findOneAndUpdate", async ({ subjectCode }, update) => {
    const subject = subjects.get(subjectCode);
    if (!subject) {
      return null;
    }

    subject.set(update.$set);
    await subject.validate();
    return subject;
  });

  return subjects;
};

before(async () => {
  process.env.JWT_SECRET = "test-only-signing-secret";
  passwordHash = await bcrypt.hash("correct-password", 4);
  server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  restoreMethods();
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });

  if (originalJwtSecret === undefined) {
    delete process.env.JWT_SECRET;
  } else {
    process.env.JWT_SECRET = originalJwtSecret;
  }
});

afterEach(() => {
  restoreMethods();
});

test("health, readiness, malformed JSON, and unknown routes are controlled", async () => {
  const live = await request("/health/live");
  assert.equal(live.response.status, 200);
  assert.equal(live.body.status, "live");

  const ready = await request("/health/ready");
  assert.equal(ready.response.status, 503);
  assert.equal(ready.body.database, "disconnected");

  const unknown = await request("/not-a-route");
  assert.equal(unknown.response.status, 404);
  assert.equal(unknown.body.message, "Route not found");

  const malformed = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: '{"email":',
  });
  assert.equal(malformed.status, 400);
  assert.equal((await malformed.json()).message, "Invalid JSON request body");

  const oversized = await fetch(`${baseUrl}/api/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ value: "x".repeat(102 * 1024) }),
  });
  assert.equal(oversized.status, 413);
  assert.equal((await oversized.json()).message, "Request body is too large");
});

test("login validates input, rejects bad passwords, and omits password data", async () => {
  const nullBody = await request("/api/auth/login", {
    method: "POST",
    body: null,
  });
  assert.equal(nullBody.response.status, 400);

  const missingFields = await request("/api/auth/login", {
    method: "POST",
    body: { email: "student@example.test" },
  });
  assert.equal(missingFields.response.status, 400);

  stub(User, "findOne", async () => ({
    _id: "test-user",
    name: "Test User",
    email: "student@example.test",
    password: passwordHash,
    role: "student",
    status: "active",
  }));

  const invalidPassword = await request("/api/auth/login", {
    method: "POST",
    body: {
      email: "student@example.test",
      password: "incorrect-password",
    },
  });
  assert.equal(invalidPassword.response.status, 401);

  const successfulLogin = await request("/api/auth/login", {
    method: "POST",
    body: {
      email: "student@example.test",
      password: "correct-password",
    },
  });
  assert.equal(successfulLogin.response.status, 200);
  assert.equal(
    jwt.verify(successfulLogin.body.token, process.env.JWT_SECRET).id,
    "test-user"
  );
  assert.equal("password" in successfulLogin.body.user, false);
});

test("protected routes reject absent and invalid tokens and enforce permissions", async () => {
  const missingToken = await request("/api/test/protected");
  assert.equal(missingToken.response.status, 401);

  const invalidToken = await request("/api/test/protected", {
    token: "not-a-valid-token",
  });
  assert.equal(invalidToken.response.status, 401);

  const token = jwt.sign({ id: "test-user" }, process.env.JWT_SECRET);
  stub(User, "findById", () => ({
    select: async () => ({
      _id: "test-user",
      name: "Test User",
      role: "student",
      status: "active",
    }),
  }));
  stub(Permission, "findOne", async () => ({ permissions: [] }));

  const denied = await request("/api/test/protected", { token });
  assert.equal(denied.response.status, 403);
});

test("CORS allows configured origins and rejects unlisted origins", async () => {
  const allowedOrigin = "https://frontend.example.test";
  const originalCorsOrigins = process.env.CORS_ORIGINS;
  process.env.CORS_ORIGINS = allowedOrigin;
  const testApp = app.createApp();
  const testServer = await startServer(testApp);

  try {
    const allowed = await requestAt(testServer.baseUrl, "/health/live", {
      headers: { origin: allowedOrigin },
    });
    assert.equal(
      allowed.response.headers.get("access-control-allow-origin"),
      allowedOrigin
    );

    const denied = await requestAt(testServer.baseUrl, "/health/live", {
      headers: { origin: "https://unlisted.example.test" },
    });
    assert.equal(denied.response.status, 200);
    assert.equal(
      denied.response.headers.get("access-control-allow-origin"),
      null
    );

    const allowedPreflight = await fetch(
      `${testServer.baseUrl}/api/auth/login`,
      {
        method: "OPTIONS",
        headers: {
          origin: allowedOrigin,
          "access-control-request-method": "POST",
        },
      }
    );
    assert.equal(allowedPreflight.status, 204);
    assert.equal(
      allowedPreflight.headers.get("access-control-allow-origin"),
      allowedOrigin
    );

    const deniedPreflight = await fetch(
      `${testServer.baseUrl}/api/auth/login`,
      {
        method: "OPTIONS",
        headers: {
          origin: "https://unlisted.example.test",
          "access-control-request-method": "POST",
        },
      }
    );
    assert.equal(
      deniedPreflight.headers.get("access-control-allow-origin"),
      null
    );
  } finally {
    await stopServer(testServer.server);
    if (originalCorsOrigins === undefined) {
      delete process.env.CORS_ORIGINS;
    } else {
      process.env.CORS_ORIGINS = originalCorsOrigins;
    }
  }
});

test("CORS configuration uses local defaults only outside production", () => {
  assert.deepEqual(parseCorsOrigins("", "production"), []);
  assert.deepEqual(parseCorsOrigins("", "development"), [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ]);
  assert.deepEqual(
    parseCorsOrigins("https://one.example.test, https://two.example.test"),
    ["https://one.example.test", "https://two.example.test"]
  );
  assert.throws(() => parseCorsOrigins("https://one.example.test/path"));
});

test("login rate limiter returns a safe 429 after the configured limit", async () => {
  stub(User, "findOne", async () => null);
  const originalWindow = process.env.LOGIN_RATE_LIMIT_WINDOW_MS;
  const originalLimit = process.env.LOGIN_RATE_LIMIT_MAX;
  process.env.LOGIN_RATE_LIMIT_WINDOW_MS = "60000";
  process.env.LOGIN_RATE_LIMIT_MAX = "2";
  const testApp = app.createApp({
    allowedOrigins: [],
  });
  const testServer = await startServer(testApp);
  const loginBody = {
    email: "student@example.test",
    password: "wrong-password",
  };

  try {
    const first = await requestAt(testServer.baseUrl, "/api/auth/login", {
      method: "POST",
      body: loginBody,
    });
    const second = await requestAt(testServer.baseUrl, "/api/auth/login", {
      method: "POST",
      body: loginBody,
    });
    const limited = await requestAt(testServer.baseUrl, "/api/auth/login", {
      method: "POST",
      body: loginBody,
    });

    assert.equal(first.response.status, 401);
    assert.equal(second.response.status, 401);
    assert.equal(limited.response.status, 429);
    assert.equal(
      limited.body.message,
      "Too many login attempts. Please try again later."
    );
    assert.equal(JSON.stringify(limited.body).includes(loginBody.password), false);
  } finally {
    await stopServer(testServer.server);
    if (originalWindow === undefined) {
      delete process.env.LOGIN_RATE_LIMIT_WINDOW_MS;
    } else {
      process.env.LOGIN_RATE_LIMIT_WINDOW_MS = originalWindow;
    }
    if (originalLimit === undefined) {
      delete process.env.LOGIN_RATE_LIMIT_MAX;
    } else {
      process.env.LOGIN_RATE_LIMIT_MAX = originalLimit;
    }
  }
});

test("unexpected authentication errors return a generic response", async () => {
  const privateErrorText = "private database connection detail";
  const token = jwt.sign({ id: "test-user" }, process.env.JWT_SECRET);
  stub(User, "findById", () => ({
    select: async () => {
      throw new Error(privateErrorText);
    },
  }));

  const result = await request("/api/test/protected", { token });

  assert.equal(result.response.status, 500);
  assert.equal(result.body.message, "Internal server error");
  assert.equal(JSON.stringify(result.body).includes(privateErrorText), false);
  assert.equal(JSON.stringify(result.body).includes(token), false);
});

test("student endpoints validate, create, list, retrieve, and update records", async () => {
  const token = authorizeAsPrincipal();
  const students = new Map();

  stub(Student, "findOne", async ({ studentId }) => students.get(studentId) || null);
  stub(Student, "create", async (values) => {
    const student = new Student(values);
    await student.validate();
    students.set(student.studentId, student);
    return student;
  });
  stub(Student, "find", () => ({
    sort: async () => Array.from(students.values()),
  }));
  stub(Student, "findOneAndUpdate", async ({ studentId }, update) => {
    const student = students.get(studentId);
    if (!student) {
      return null;
    }
    student.set(update.$set);
    await student.validate();
    return student;
  });

  const invalidSemester = await request("/api/students", {
    method: "POST",
    token,
    body: {
      studentId: "S-101",
      name: "Student One",
      department: "Science",
      semester: 13,
    },
  });
  assert.equal(invalidSemester.response.status, 400);

  const invalidStatus = await request("/api/students", {
    method: "POST",
    token,
    body: {
      studentId: "S-101",
      name: "Student One",
      department: "Science",
      semester: 1,
      status: null,
    },
  });
  assert.equal(invalidStatus.response.status, 400);

  const invalidEmail = await request("/api/students", {
    method: "POST",
    token,
    body: {
      studentId: "S-101",
      name: "Student One",
      email: "not-an-email",
      department: "Science",
      semester: 1,
    },
  });
  assert.equal(invalidEmail.response.status, 400);

  const unknownField = await request("/api/students", {
    method: "POST",
    token,
    body: {
      studentId: "S-101",
      name: "Student One",
      department: "Science",
      semester: 1,
      role: "principal",
    },
  });
  assert.equal(unknownField.response.status, 400);

  const created = await request("/api/students", {
    method: "POST",
    token,
    body: {
      studentId: " S-101 ",
      name: "Student One",
      department: "Science",
      semester: 1,
    },
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.student.studentId, "S-101");

  const duplicate = await request("/api/students", {
    method: "POST",
    token,
    body: {
      studentId: "S-101",
      name: "Another Student",
      department: "Science",
      semester: 2,
    },
  });
  assert.equal(duplicate.response.status, 409);

  const listed = await request("/api/students", { token });
  assert.equal(listed.response.status, 200);
  assert.equal(listed.body.count, 1);

  const retrieved = await request("/api/students/S-101", { token });
  assert.equal(retrieved.response.status, 200);

  const rejectedUpdate = await request("/api/students/S-101", {
    method: "PATCH",
    token,
    body: { studentId: "S-202", name: "Changed ID" },
  });
  assert.equal(rejectedUpdate.response.status, 400);

  const updated = await request("/api/students/S-101", {
    method: "PATCH",
    token,
    body: { name: "Updated Student" },
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.student.name, "Updated Student");

  const invalidUpdate = await request("/api/students/S-101", {
    method: "PATCH",
    token,
    body: { semester: 4.5 },
  });
  assert.equal(invalidUpdate.response.status, 400);

  const missing = await request("/api/students/does-not-exist", { token });
  assert.equal(missing.response.status, 404);
});

test("teacher endpoints validate, prevent duplicates, and support profile CRUD with deactivation", async () => {
  const token = authorizeAsPrincipal();
  const teachers = stubTeacherCollection();
  const validTeacher = {
    teacherId: " T-101 ",
    name: " Teacher One ",
    email: " TEACHER@example.test ",
    phone: "555-0101",
    department: " Science ",
  };

  const missingRequired = await request("/api/teachers", {
    method: "POST",
    token,
    body: { teacherId: "T-101", name: "Teacher One" },
  });
  assert.equal(missingRequired.response.status, 400);

  const invalidEmail = await request("/api/teachers", {
    method: "POST",
    token,
    body: { ...validTeacher, email: "not-an-email" },
  });
  assert.equal(invalidEmail.response.status, 400);

  const forbiddenFields = await request("/api/teachers", {
    method: "POST",
    token,
    body: { ...validTeacher, role: "principal", userId: "privileged-user" },
  });
  assert.equal(forbiddenFields.response.status, 400);

  const created = await request("/api/teachers", {
    method: "POST",
    token,
    body: validTeacher,
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.teacher.teacherId, "T-101");
  assert.equal(created.body.teacher.name, "Teacher One");
  assert.equal(created.body.teacher.email, "teacher@example.test");
  assert.equal(created.body.teacher.status, "active");

  const duplicateIdentifier = await request("/api/teachers", {
    method: "POST",
    token,
    body: { ...validTeacher, teacherId: "T-101", email: "other@example.test" },
  });
  assert.equal(duplicateIdentifier.response.status, 409);

  const duplicateEmail = await request("/api/teachers", {
    method: "POST",
    token,
    body: { ...validTeacher, teacherId: "T-102" },
  });
  assert.equal(duplicateEmail.response.status, 409);

  const secondTeacher = await request("/api/teachers", {
    method: "POST",
    token,
    body: {
      teacherId: "T-102",
      name: "Teacher Two",
      email: "teacher.two@example.test",
      department: "Mathematics",
    },
  });
  assert.equal(secondTeacher.response.status, 201);

  const listed = await request("/api/teachers", { token });
  assert.equal(listed.response.status, 200);
  assert.equal(listed.body.count, 2);

  const retrieved = await request("/api/teachers/T-101", { token });
  assert.equal(retrieved.response.status, 200);

  const unknownTeacher = await request("/api/teachers/no-such-teacher", {
    token,
  });
  assert.equal(unknownTeacher.response.status, 404);

  const invalidUpdate = await request("/api/teachers/T-101", {
    method: "PATCH",
    token,
    body: { name: " " },
  });
  assert.equal(invalidUpdate.response.status, 400);

  const privilegedUpdate = await request("/api/teachers/T-101", {
    method: "PATCH",
    token,
    body: { role: "principal" },
  });
  assert.equal(privilegedUpdate.response.status, 400);

  const invalidEmailUpdate = await request("/api/teachers/T-101", {
    method: "PATCH",
    token,
    body: { email: "not-an-email" },
  });
  assert.equal(invalidEmailUpdate.response.status, 400);

  const duplicateEmailUpdate = await request("/api/teachers/T-101", {
    method: "PATCH",
    token,
    body: { email: "teacher.two@example.test" },
  });
  assert.equal(duplicateEmailUpdate.response.status, 409);

  const updated = await request("/api/teachers/T-101", {
    method: "PATCH",
    token,
    body: { name: "Updated Teacher", email: "updated@example.test" },
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.teacher.name, "Updated Teacher");
  assert.equal(updated.body.teacher.email, "updated@example.test");

  const deactivated = await request("/api/teachers/T-101", {
    method: "DELETE",
    token,
  });
  assert.equal(deactivated.response.status, 200);
  assert.equal(deactivated.body.teacher.status, "inactive");
  assert.equal(teachers.has("T-101"), true);

  const missingDeactivation = await request("/api/teachers/no-such-teacher", {
    method: "DELETE",
    token,
  });
  assert.equal(missingDeactivation.response.status, 404);
});

test("teacher routes enforce authentication and operation-specific permissions", async () => {
  const missingToken = await request("/api/teachers");
  assert.equal(missingToken.response.status, 401);

  const invalidToken = await request("/api/teachers", {
    token: "invalid-token",
  });
  assert.equal(invalidToken.response.status, 401);

  const token = authorizeWithPermissions(["teachers.view"]);
  stub(Teacher, "find", () => ({
    sort: async () => [],
  }));

  const allowedView = await request("/api/teachers", { token });
  assert.equal(allowedView.response.status, 200);

  const deniedCreate = await request("/api/teachers", {
    method: "POST",
    token,
    body: {
      teacherId: "T-201",
      name: "Teacher Two",
      department: "Science",
    },
  });
  assert.equal(deniedCreate.response.status, 403);

  const deniedUpdate = await request("/api/teachers/T-201", {
    method: "PATCH",
    token,
    body: { name: "Updated" },
  });
  assert.equal(deniedUpdate.response.status, 403);

  const deniedDelete = await request("/api/teachers/T-201", {
    method: "DELETE",
    token,
  });
  assert.equal(deniedDelete.response.status, 403);
});

test("unexpected teacher database errors do not leak private details", async () => {
  const token = authorizeAsPrincipal();
  const privateErrorText = "private teacher database connection detail";
  stub(Teacher, "find", () => ({
    sort: async () => {
      throw new Error(privateErrorText);
    },
  }));

  const result = await request("/api/teachers", { token });

  assert.equal(result.response.status, 500);
  assert.equal(result.body.message, "Server error while fetching teachers");
  assert.equal(JSON.stringify(result.body).includes(privateErrorText), false);
  assert.equal(JSON.stringify(result.body).includes(token), false);
});

test("subject endpoints validate, prevent duplicates, and support CRUD with deactivation", async () => {
  const token = authorizeAsPrincipal();
  const subjects = stubSubjectCollection();

  const missingFields = await request("/api/subjects", {
    method: "POST",
    token,
    body: { subjectCode: "BIO-101" },
  });
  assert.equal(missingFields.response.status, 400);

  const invalidFields = await request("/api/subjects", {
    method: "POST",
    token,
    body: { subjectCode: "BIO-101", name: "  " },
  });
  assert.equal(invalidFields.response.status, 400);

  const unknownFields = await request("/api/subjects", {
    method: "POST",
    token,
    body: {
      subjectCode: "BIO-101",
      name: "Biology",
      role: "principal",
    },
  });
  assert.equal(unknownFields.response.status, 400);

  const created = await request("/api/subjects", {
    method: "POST",
    token,
    body: { subjectCode: " BIO-101 ", name: " Biology " },
  });
  assert.equal(created.response.status, 201);
  assert.equal(created.body.subject.subjectCode, "BIO-101");
  assert.equal(created.body.subject.name, "Biology");
  assert.equal(created.body.subject.status, "active");

  const duplicate = await request("/api/subjects", {
    method: "POST",
    token,
    body: { subjectCode: "BIO-101", name: "Another Biology" },
  });
  assert.equal(duplicate.response.status, 409);

  const listed = await request("/api/subjects", { token });
  assert.equal(listed.response.status, 200);
  assert.equal(listed.body.count, 1);

  const retrieved = await request("/api/subjects/BIO-101", { token });
  assert.equal(retrieved.response.status, 200);

  const missing = await request("/api/subjects/NO-SUBJECT", { token });
  assert.equal(missing.response.status, 404);

  const invalidUpdate = await request("/api/subjects/BIO-101", {
    method: "PATCH",
    token,
    body: { name: "" },
  });
  assert.equal(invalidUpdate.response.status, 400);

  const rejectedCodeChange = await request("/api/subjects/BIO-101", {
    method: "PATCH",
    token,
    body: { subjectCode: "BIO-102", name: "Changed Code" },
  });
  assert.equal(rejectedCodeChange.response.status, 400);

  const updated = await request("/api/subjects/BIO-101", {
    method: "PATCH",
    token,
    body: { name: "General Biology" },
  });
  assert.equal(updated.response.status, 200);
  assert.equal(updated.body.subject.name, "General Biology");

  const deactivated = await request("/api/subjects/BIO-101", {
    method: "DELETE",
    token,
  });
  assert.equal(deactivated.response.status, 200);
  assert.equal(deactivated.body.subject.status, "inactive");
  assert.equal(subjects.has("BIO-101"), true);

  const missingDeactivation = await request("/api/subjects/NO-SUBJECT", {
    method: "DELETE",
    token,
  });
  assert.equal(missingDeactivation.response.status, 404);
});

test("subject routes enforce authentication and operation permissions", async () => {
  const missingToken = await request("/api/subjects");
  assert.equal(missingToken.response.status, 401);

  const invalidToken = await request("/api/subjects", {
    token: "invalid-token",
  });
  assert.equal(invalidToken.response.status, 401);

  const token = authorizeWithPermissions(["subjects.view"]);
  stub(Subject, "find", () => ({
    sort: async () => [],
  }));

  const allowedView = await request("/api/subjects", { token });
  assert.equal(allowedView.response.status, 200);

  const deniedCreate = await request("/api/subjects", {
    method: "POST",
    token,
    body: { subjectCode: "BIO-201", name: "Cell Biology" },
  });
  assert.equal(deniedCreate.response.status, 403);

  const deniedUpdate = await request("/api/subjects/BIO-201", {
    method: "PATCH",
    token,
    body: { name: "Updated" },
  });
  assert.equal(deniedUpdate.response.status, 403);

  const deniedDelete = await request("/api/subjects/BIO-201", {
    method: "DELETE",
    token,
  });
  assert.equal(deniedDelete.response.status, 403);
});

test("unexpected subject database errors do not leak private details", async () => {
  const token = authorizeAsPrincipal();
  const privateErrorText = "private subject database connection detail";
  stub(Subject, "find", () => ({
    sort: async () => {
      throw new Error(privateErrorText);
    },
  }));

  const result = await request("/api/subjects", { token });

  assert.equal(result.response.status, 500);
  assert.equal(result.body.message, "Server error while fetching subjects");
  assert.equal(JSON.stringify(result.body).includes(privateErrorText), false);
  assert.equal(JSON.stringify(result.body).includes(token), false);
});
