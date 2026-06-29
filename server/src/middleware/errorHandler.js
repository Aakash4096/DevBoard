const ApiError = require("../utils/ApiError");

const errorHandler = (err, req, res, next) => {
  let error = err;

  error.message = err.message || "Something went wrong";
  error.stack = err.stack;

  console.error("ERROR:", {
    message: err.message,
    name: err.name,
    code: err.code,
  });

  if (err.name === "CastError") {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new ApiError(400, message);
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
    error = new ApiError(400, message);
  }

  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate value for ${field}. This already exists.`;
    error = new ApiError(409, message);
  }

  if (err.name === "JsonWebTokenError") {
    error = new ApiError(401, "Invalid token. Please log in again.");
  }

  if (err.name === "TokenExpiredError") {
    error = new ApiError(401, "Your token has expired. Please log in again.");
  }

  if (!(error instanceof ApiError)) {
    error = new ApiError(500, "Something went wrong", false);
  }

  res.status(error.statusCode || 500).json({
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack }),
  });
};

module.exports = errorHandler;
