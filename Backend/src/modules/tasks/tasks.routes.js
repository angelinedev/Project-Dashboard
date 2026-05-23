import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import {
  createTaskController,
  getTasksController,
  updateTaskStatusController,
} from "./tasks.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", getTasksController);
router.post("/", createTaskController);
router.patch("/:taskId/status", updateTaskStatusController);

export default router;
