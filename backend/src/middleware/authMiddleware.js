
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken =
    typeof authHeader === "string"
      ? /^Bearer\s+(\S+)$/i.exec(authHeader)
      : null;

  if (!bearerToken) {
    return res.status(401).json({
      success: false,
      message: "Authentication token is required",
    });
  }

  let decoded;
  try {
    decoded = jwt.verify(bearerToken[1], process.env.JWT_SECRET);
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired authentication token",
      });
    }

    return next(error);
  }

  try {
    const user = await User.findById(decoded.id).select("-password");

    if (!user || user.status !== "active") {
      return res.status(401).json({
        success: false,
        message: "User not found or account is inactive",
      });
    }

    req.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authMiddleware;
