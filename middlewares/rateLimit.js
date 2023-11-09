const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minutes
  max: 10, // limit each IP to 10 requests per minute
});

module.exports = limiter;
