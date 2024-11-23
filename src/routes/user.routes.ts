import { Router, Request, Response } from "express";
import { RequestHandler } from "express";
import { updateUser, updatePassword, removeUser } from "../controllers/user.controller";

const router = Router();

router.put('/:userId', updateUser);
router.put('/:userId/password', updatePassword);
router.delete('/:userId', removeUser);

export default router;