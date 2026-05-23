import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import {
  createTeamController,
  getMyTeamsController,
  getTeamMembersController,
  updateTeamLeaderController,
} from "./teams.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", getMyTeamsController);
router.post("/", createTeamController);
router.get("/:teamId/members", getTeamMembersController);
router.patch("/:teamId/leader", updateTeamLeaderController);

export default router;
