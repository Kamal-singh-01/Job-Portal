import jwt from "jsonwebtoken";
import Company from "../models/company.js";

export const protectCompany = async (req, res, next) => {
  let token;

  // ✅ check for token in headers (Authorization: Bearer <token>)
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } 
  // OR if you want token directly in headers.token
  else if (req.headers.token) {
    token = req.headers.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not Authorized, Login Again" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.company = await Company.findById(decoded.id).select("-password");
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Token invalid" });
  }
};
