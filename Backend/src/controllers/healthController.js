export const getHealthStatus = (_request, response) => {
  response.status(200).json({
    success: true,
    message: "Smart Kanban backend is healthy.",
    timestamp: new Date().toISOString(),
  });
};
