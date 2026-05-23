import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import {
  createTeamController,
  getMyTeamsController,
  getTeamMembersController,
} from "./teams.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", getMyTeamsController);
router.post("/", createTeamController);
router.get("/:teamId/members", getTeamMembersController);

export default router;
