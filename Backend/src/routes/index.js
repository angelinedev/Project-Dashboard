import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes.js";
import healthRoutes from "../modules/health/health.routes.js";
import messagesRoutes from "../modules/messages/messages.routes.js";
import tasksRoutes from "../modules/tasks/tasks.routes.js";
import teamsRoutes from "../modules/teams/teams.routes.js";
import usersRoutes from "../modules/users/users.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/health", healthRoutes);
router.use("/messages", messagesRoutes);
router.use("/tasks", tasksRoutes);
router.use("/teams", teamsRoutes);
router.use("/users", usersRoutes);

export default router;
