
const Permission = require("../models/permission");

const requirePermission = (requiredPermission) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Authentication required",
        });
      }

      const permissionData = await Permission.findOne({
        role: req.user.role,
        status: "active",
      });

      if (!permissionData) {
        return res.status(403).json({
          success: false,
          message: "No active permissions found for this role",
        });
      }

      const userPermissions = permissionData.permissions;

      if (
        userPermissions.includes("*") ||
        userPermissions.includes(requiredPermission)
      ) {
        return next();
      }

      return res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action",
      });
    } catch (error) {
      console.error("Permission check error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Server error while checking permissions",
      });
    }
  };
};

module.exports = requirePermission;
