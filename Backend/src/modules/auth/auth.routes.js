import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { joinTeam, login, register } from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/join-team", requireAuth, joinTeam);

export default router;
