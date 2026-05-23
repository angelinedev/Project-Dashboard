import app from "./app.js";
import { env } from "./config/env.js";
import { connectDatabase, disconnectDatabase } from "./db/index.js";

const PORT = env.port;

const startServer = async () => {
  try {
    await connectDatabase();

    const server = app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`${signal} received. Closing backend server.`);
      server.close(async () => {
        await disconnectDatabase();
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("Failed to start the backend server.", error);
    process.exit(1);
  }
};

startServer();
