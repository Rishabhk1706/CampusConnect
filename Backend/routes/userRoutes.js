import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  getUserById,
  getSeniors,
  getPeers,
  getJuniors,
} from "../controllers/userController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", auth, getMyProfile);
router.patch("/profile", auth, updateMyProfile);
router.get("/seniors", auth, getSeniors);
router.get("/peers", auth, getPeers);
router.get("/juniors", auth, getJuniors);
router.get("/:id", auth, getUserById);

export default router;