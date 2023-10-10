const jwt = require("jsonwebtoken");
const secretCode = require("../secretCode");

const jwtKey = secretCode;

// Middleware to verify the user's token and populate req.user
function verifyToken(req, res, next) {
  const token = req.cookies.accessToken; // Assuming you store the token in a cookie
  if (!token) {
    return res.status(401).json({ message: "Token is missing" });
  }

  jwt.verify(token, jwtKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // Assuming that your JWT payload structure includes 'user' with 'id' property
    if (!decoded.user || !decoded.user.id) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    req.user = decoded.user;

    // Token is valid, continue processing the request
    next();
  });
}

module.exports = verifyToken;
