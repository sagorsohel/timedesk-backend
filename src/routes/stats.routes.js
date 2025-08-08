import express from "express";
import { computeStats, buildBadgeSVG } from "../utils/stats.js";
import { UserRoutine } from "../models/routine.model.js";

const badgeRouter = express.Router();

badgeRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userRoutine = await UserRoutine.findOne({ userId });
    if (!userRoutine) return res.status(404).send("Not found");

    const stats = computeStats(userRoutine);

    const svg = buildBadgeSVG(stats);

    res.setHeader("Content-Type", "image/svg+xml");
    // Disable caching or set appropriate cache-control headers to force fresh fetch
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    res.send(svg);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default badgeRouter;
