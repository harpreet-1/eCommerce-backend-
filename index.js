const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const dbConnection = require("./db");
const usersRouter = require("./routes/user.routes");

const categoryRouter = require("./routes/category.routes");
const productRouter = require("./routes/product.routes");
const cartRouter = require("./routes/cart.routes");
const orderRouter = require("./routes/order.routes");

dotenv.config();
const port = process.env.PORT || 8000;

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the triveous-server" });
});

app.use("/user", usersRouter);
app.use("/category", categoryRouter);
app.use("/product", productRouter);
app.use("/cart", cartRouter);
app.use("/order", orderRouter);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Triveous Backend Documentation",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
  },
  apis: ["./routes/*.js"],
};
const swaggerSpec = swaggerJSdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  dbConnection();

  console.log(`Server started on port ${port}`);
});
