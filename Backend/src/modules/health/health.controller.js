export const getHealthStatus = (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Project Dashboard backend is healthy.",
    timestamp: new Date().toISOString(),
  });
};
