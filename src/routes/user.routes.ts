import { Router } from "express";
import { updateUser, updatePassword, removeUser, getUserProfile } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.get('/', authMiddleware, getUserProfile);
router.put('/:userId', updateUser);
router.put('/:userId/password', updatePassword);
router.delete('/:userId', removeUser);

export default router;