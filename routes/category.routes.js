const express = require("express");

const {
  getCategories,
  addCategory,
} = require("../controllers/categoryController");

const categoryRouter = express.Router();

categoryRouter.route("/").get(getCategories).post(addCategory);

module.exports = categoryRouter;
