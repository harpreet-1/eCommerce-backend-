const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const UserModel = require("../Models/User");

const getUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    return res.status(200).json(users);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const isValidEmail = (email) => {
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return pattern.test(email);
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!email || !password || !username) {
      return res.status(400).json({
        status: "error",
        message: `Registration failed. Please provide ${
          !email ? "email" : !password ? "password" : "username"
        }`,
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        status: "error",
        message: "Registration failed! Please provide a valid email address.",
      });
    }

    const existingUser = await UserModel.findOne({ email: email });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User already exists. Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 5);

    const newUser = await UserModel.create({
      email,
      username,
      password: hashedPassword,
    });

    const responseData = {
      status: "success",
      message: "Congratulations! You have successfully registered.",
      user: { username, email, userId: newUser._id },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error from user register------->", error);

    return res.status(500).json({
      status: "error",
      message: "Server error",
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }
    const userData = {
      id: user._id,
      username: user.username,
      email,
    };

    const token = jwt.sign(
      userData,

      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "3d",
      }
    );

    const responseData = {
      success: true,
      message: "Login Successful",
      user: userData,
      token: token,
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error("Error from user login", error);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

module.exports = {
  loginUser,
  registerUser,
  getUsers,
};
