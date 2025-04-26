import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    // 1️⃣ Check if token exists in cookies
    const token = req.cookies?.jwt;

    if (!token) {
      console.error("❌ ERROR: No token found in cookies");
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // 2️⃣ Verify JWT Token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Decoded Token:", decoded);
    } catch (error) {
      console.error("❌ ERROR: Token verification failed:", error.message);
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // 3️⃣ Extract userId and check if it's valid
    const userId = decoded?.userId;
    console.log("🔍 Extracted userId:", userId);

    if (!userId) {
      console.error("❌ ERROR: userId is undefined in decoded token!");
      return res.status(401).json({ message: "Unauthorized - Missing user ID in Token" });
    }

    // 4️⃣ Fetch User from DB
    const user = await User.findById(userId).select("-password");
    if (!user) {
      console.error("❌ ERROR: User not found in DB:", userId);
      return res.status(404).json({ message: "User not found" });
    }

    // 5️⃣ Attach user to request and move to next middleware
    req.user = user;
    console.log("✅ User authenticated:", user.fullName);
    next();
  } catch (error) {
    console.error("❌ ERROR in protectRoute middleware:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
