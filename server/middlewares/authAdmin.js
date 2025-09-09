// middlewares/authAdmin.js
import jwt from "jsonwebtoken";

const authAdmin = (req, res, next) => {
  const token = req.cookies?.adminToken;
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, please log in." });
  }

  try {
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    if (email !== process.env.ADMIN_EMAIL) {
      return res
        .status(403)
        .json({ success: false, message: "Forbidden: admin access required." });
    }
    next();
  } catch (err) {
    console.error("authAdmin error:", err.message);
    return res
      .status(401)
      .json({ success: false, message: "Invalid or expired token." });
  }
};

export default authAdmin;
