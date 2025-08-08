import express from "express";
import UserRoutine from "../models/UserRoutine.js";
import { computeStats } from "../utils/stats.js";

const router = express.Router();

// GET /api/stats/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userRoutine = await UserRoutine.findOne({ userId });
    if (!userRoutine) return res.status(404).json({ error: "Not found" });

    const stats = computeStats(userRoutine);
    res.json(stats);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
