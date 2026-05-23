import cors from "cors";
import express from "express";

import apiRoutes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFound } from "./middleware/notFound.js";
import { requestLogger } from "./middleware/requestLogger.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL ?? "*",
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/api", apiRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
