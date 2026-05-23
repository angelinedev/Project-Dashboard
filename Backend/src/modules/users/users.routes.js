import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { getMeController } from "./users.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/me", getMeController);

export default router;
