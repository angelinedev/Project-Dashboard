import dotenv from "dotenv";

import app from "./app.js";
import { connectDatabase } from "./config/db.js";

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`Backend server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start the backend server.", error);
    process.exit(1);
  }
};

startServer();
