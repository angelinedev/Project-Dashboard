export const errorHandler = (error, _request, response, _next) => {
  const statusCode =
    error.statusCode || (response.statusCode >= 400 ? response.statusCode : 500);

  response.status(statusCode).json({
    success: false,
    message: error.message || "An unexpected server error occurred.",
    stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
  });
};
