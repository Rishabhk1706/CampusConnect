import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  getUserById,
} from "../controllers/userController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", auth, getMyProfile);
router.patch("/profile", auth, updateMyProfile);
router.get("/:id", auth, getUserById);

export default router;