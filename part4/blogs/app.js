const mongoose = require("mongoose");
const express = require("express");
const config = require("./utils/config");
const logger = require("./utils/logger");
const blogsRouter = require("./controllers/blogs");

mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => logger.info("connected"))
  .catch((e) => logger.error(e));

const app = express();
app.use(express.json());
app.use("/api/blogs", blogsRouter);

module.exports = app;
