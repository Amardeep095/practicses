// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // check if token exists
    if (!authHeader) {
      return res.status(401).json({ msg: "No token, access denied" });
    }

    // extract token
    const token = authHeader.split(" ")[1];

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // attach user to request
    req.user = decoded;

    next(); // move to next function
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};