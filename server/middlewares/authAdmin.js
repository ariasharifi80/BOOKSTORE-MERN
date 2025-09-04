import jwt, { decode } from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  const { adminToken } = req.cookies;

  if (!adminToken) {
    return res.json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const decoded = jwt.verify(adminToken, process.env.JWT_SECRET);
    if (decoded.email === process.env.ADMIN_EMAIL) {
      next();
    } else {
      return res.json({
        success: false,
        message: "Not Authorized Please Login",
      });
    }
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
