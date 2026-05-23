export const errorHandler = (error, _request, response, _next) => {
  let normalizedError = error;

  if (error?.name === "ValidationError") {
    normalizedError = {
      statusCode: 400,
      message: Object.values(error.errors)
        .map((value) => value.message)
        .join(", "),
      stack: error.stack,
    };
  } else if (error?.name === "CastError") {
    normalizedError = {
      statusCode: 400,
      message: `Invalid identifier for field "${error.path}".`,
      stack: error.stack,
    };
  } else if (error?.code === 11000) {
    normalizedError = {
      statusCode: 409,
      message: "A record with this value already exists.",
      stack: error.stack,
    };
  }

  const statusCode =
    normalizedError.statusCode ||
    (response.statusCode >= 400 ? response.statusCode : 500);

  response.status(statusCode).json({
    success: false,
    message: normalizedError.message || "An unexpected server error occurred.",
    stack:
      process.env.NODE_ENV === "production" ? undefined : normalizedError.stack,
  });
};
