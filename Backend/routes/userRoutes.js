import express from "express";
import {
  getMyProfile,
  updateMyProfile,
  getUserById,
  getSeniors,
  getPeers,
  getJuniors,
  getDirectoryOptions,
} from "../controllers/userController.js";
import { auth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/profile", auth, getMyProfile);
router.patch("/profile", auth, updateMyProfile);
router.get("/directory-options", auth, getDirectoryOptions);
router.get("/directory/branches", auth, async (req, res, next) => {
  try {
    const { default: User } = await import("../models/User.js");
    const { default: Branch } = await import("../models/Branch.js");
    const current = await User.findById(req.user.id).select("college course");
    if (!current) return res.status(404).json({ error: "User not found" });
    const ids = await User.find({ college: current.college, course: current.course, isVerified: true }).distinct("branch");
    return res.json({ branches: await Branch.find({ _id: { $in: ids } }).select("_id name code").sort({ name: 1 }).lean() });
  } catch (error) { return next(error); }
});
router.get("/seniors", auth, getSeniors);
router.get("/peers", auth, getPeers);
router.get("/juniors", auth, getJuniors);
router.get("/:id", auth, getUserById);

export default router;
