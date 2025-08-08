import express from "express";

import { computeStats, buildBadgeSVG, buildContributionSVG } from "../utils/stats.js";
import {UserRoutine} from "../models/routine.model.js";


const badgeRouter = express.Router();

// GET /api/badge/:userId
badgeRouter.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const userRoutine = await UserRoutine.findOne({ userId });
    if (!userRoutine) return res.status(404).send("Not found");

    const stats = computeStats(userRoutine);
    const svg = buildBadgeSVG(stats);

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.send(svg);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

// GET /api/graph/:userId  -> contribution style
badgeRouter.get("/graph/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const days = parseInt(req.query.days || "365", 10);
    const userRoutine = await UserRoutine.findOne({ userId });
    if (!userRoutine) return res.status(404).send("Not found");

    const stats = computeStats(userRoutine);
    const svg = buildContributionSVG(stats.dailyMap, days);

    res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
    res.send(svg);
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});

export default badgeRouter;
