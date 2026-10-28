
const getProtectedData = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Protected API accessed successfully",
    user: {
      id: req.user._id,
      name: req.user.name,
      role: req.user.role,
    },
  });
};

module.exports = { getProtectedData };
