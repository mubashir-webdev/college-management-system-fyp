const rateLimit = require("express-rate-limit");

const localDevelopmentOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
];

const parseCorsOrigins = (
  value = process.env.CORS_ORIGINS,
  nodeEnvironment = process.env.NODE_ENV
) => {
  if (value === undefined || value.trim() === "") {
    return nodeEnvironment === "production" ? [] : [...localDevelopmentOrigins];
  }

  return value.split(",").map((entry) => {
    const origin = entry.trim();

    if (!origin) {
      throw new Error("CORS_ORIGINS must not contain empty entries");
    }

    let parsedOrigin;
    try {
      parsedOrigin = new URL(origin);
    } catch {
      throw new Error("CORS_ORIGINS must contain valid HTTP(S) origins");
    }

    if (
      !["http:", "https:"].includes(parsedOrigin.protocol) ||
      parsedOrigin.origin !== origin ||
      parsedOrigin.username ||
      parsedOrigin.password
    ) {
      throw new Error("CORS_ORIGINS must contain valid HTTP(S) origins");
    }

    return parsedOrigin.origin;
  });
};

const readPositiveInteger = (name, defaultValue) => {
  const configuredValue = process.env[name];
  if (configuredValue === undefined || configuredValue.trim() === "") {
    return defaultValue;
  }

  const parsedValue = Number(configuredValue);
  if (!Number.isSafeInteger(parsedValue) || parsedValue < 1) {
    throw new Error(`${name} must be a positive integer`);
  }

  return parsedValue;
};

const createLoginRateLimiter = (overrides = {}) => {
  const windowMs = readPositiveInteger(
    "LOGIN_RATE_LIMIT_WINDOW_MS",
    15 * 60 * 1000
  );
  const limit = readPositiveInteger("LOGIN_RATE_LIMIT_MAX", 10);

  return rateLimit({
    windowMs,
    limit,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) =>
      res.status(429).json({
        success: false,
        message: "Too many login attempts. Please try again later.",
      }),
    ...overrides,
  });
};

module.exports = {
  createLoginRateLimiter,
  parseCorsOrigins,
};
