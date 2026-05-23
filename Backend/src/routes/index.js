import { Router } from "express";

import healthRoutes from "./healthRoutes.js";
import taskRoutes from "./taskRoutes.js";

const router = Router();

router.use("/health", healthRoutes);
router.use("/tasks", taskRoutes);

export default router;
