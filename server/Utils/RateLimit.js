const rateLimit = require("express-rate-limit");

const getLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 300, // limit each IP to 300 requests per windowMs
});

const postLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
});

module.exports = { getLimiter, postLimiter };
