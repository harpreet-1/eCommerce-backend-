const express = require("express");
const {
  loginUser,
  registerUser,
  getUsers,
} = require("../controllers/userController");

const usersRouter = express.Router();

usersRouter.post("/login", loginUser);
usersRouter.post("/register", registerUser);
usersRouter.get("/", getUsers);

module.exports = usersRouter;
