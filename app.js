require("dotenv").config();
const express = require("express");
const cors = require("cors");
const YAML = require("yamljs");
const CustomError = require("./utils/customError");
const errorHandler = require("./utils/errorhandler");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = YAML.load("docs/swagger.yaml");

const app = express();

// setup middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

//setup app routes
app.get("/", (req, res) => res.send("Hello world"));

app.use(
  ["/docs", "/api/v1/docs"],
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
);

// Invalid route error handler
app.use("*", (req, res, next) => {
  const error = new CustomError(
    404,
    `Oops. The route ${req.method} ${req.originalUrl} is not recognised`
  );
  next(error);
});

// error handler
app.use((err, req, res, next) => {
  errorHandler(err, req, res, next);
});

module.exports = app;
