const logger = require("./logger");

const tokenExtractor = (request, response, next) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.startsWith("Bearer ")) {
    request.token = authorization.replace("Bearer ", "");
  } else {
    request.token = null;
  }
  next();
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);
  if (error.name === "ValidationError") {
    res.status(400).json({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "token invalid (middleware)" });
  }

  next();
};

module.exports = { errorHandler, tokenExtractor };
