import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import {
  getMeController,
  getUsersDirectoryController,
  updateMeController,
} from "./users.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/", getUsersDirectoryController);
router.get("/me", getMeController);
router.patch("/me", updateMeController);

export default router;
