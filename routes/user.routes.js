const express = require("express");
const {
  loginUser,
  registerUser,
  getUsers,
} = require("../controllers/userController");

const usersRouter = express.Router();

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Login user
 *     description: Login a user with their credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Error logging in
 */
usersRouter.post("/login", loginUser);

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Register user
 *     description: Register a new user with their information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Registration failed
 *       500:
 *         description: Error registering user
 */
usersRouter.post("/register", registerUser);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get users
 *     description: Retrieve a list of users.
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Error retrieving users
 */
usersRouter.get("/", getUsers);

module.exports = usersRouter;
