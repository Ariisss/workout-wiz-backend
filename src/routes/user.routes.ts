import { Router } from "express";
import { updateUser, updatePassword, removeUser, getUserProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get('/', authMiddleware, getUserProfile);
router.put('/:userId', authMiddleware, updateUser);
router.put('/:userId/password', authMiddleware, updatePassword);
router.delete('/:userId', authMiddleware, removeUser);

export default router;