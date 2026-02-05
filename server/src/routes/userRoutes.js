import { Router } from "express";
import { updateMe } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.patch("/me", requireAuth, updateMe);

export default router;
