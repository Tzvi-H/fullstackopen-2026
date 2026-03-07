const logger = require("./logger");

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === "ValidationError") {
    res.status(400).json({ error: error.message });
  }

  next();
};

module.exports = { errorHandler };
