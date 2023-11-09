const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../Models/User");

const authorization = (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Please provide token" });
    }
    const token = req.headers.authorization.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      const user = await UserModel.findById(decoded.id);

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      }

      req.user = decoded;

      next();
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "internal server error." });
  }
};

module.exports = authorization;
