const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const dbConnection = require("./db");

dotenv.config();
const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the triveous-server" });
});

app.listen(port, () => {
  dbConnection();

  console.log(`Server started on port ${port}`);
});
