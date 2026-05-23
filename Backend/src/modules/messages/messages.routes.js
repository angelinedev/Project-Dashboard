import { Router } from "express";

import { requireAuth } from "../../middleware/requireAuth.js";
import { getMessagesController, sendMessageController } from "./messages.controller.js";

const router = Router();

router.use(requireAuth);
router.get("/:teamId", getMessagesController);
router.post("/:teamId", sendMessageController);

export default router;
