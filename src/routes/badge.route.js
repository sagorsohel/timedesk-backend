import express from "express";

import {
  computeStats,
  buildBadgeSVG,
  buildContributionSVG,
} from "../utils/stats.js";
import { UserRoutine } from "../models/routine.model.js";

const badgeRouter = express.Router();

// GET /api/badge/:userId
badgeRouter.get("/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const userRoutine = await UserRoutine.findOne({ userId });
  
      if (!userRoutine) {
        return res.status(404).send("User not found");
      }
  
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
      let todayCompletedSeconds = 0;
      let totalCompletedSeconds = 0;
      let longestDaySeconds = 0;
      let longestDayDate = null;
  
      // Track daily totals from history + current routines
      const dailyTotals = {};
  
      // 1️⃣ Current routines (today only)
      for (const routine of userRoutine.routines || []) {
        const completed = Number(routine.originalDurationSeconds) - Number(routine.remainingSeconds);
        if (completed > 0) {
          todayCompletedSeconds += completed;
          totalCompletedSeconds += completed;
          dailyTotals[today] = (dailyTotals[today] || 0) + completed;
        }
      }
  
      // 2️⃣ History
      for (const hist of userRoutine.history || []) {
        const histDate = new Date(hist.date).toISOString().split("T")[0];
        // Each hist contains routines array; sum their completed times
        for (const routine of hist.routines || []) {
          const completed = Number(routine.originalDurationSeconds) - Number(routine.remainingSeconds);
          if (completed > 0) {
            totalCompletedSeconds += completed;
            dailyTotals[histDate] = (dailyTotals[histDate] || 0) + completed;
            if (histDate === today) {
              todayCompletedSeconds += completed;
            }
          }
        }
      }
  
      // 3️⃣ Find longest day and date
      for (const [date, seconds] of Object.entries(dailyTotals)) {
        if (seconds > longestDaySeconds) {
          longestDaySeconds = seconds;
          longestDayDate = date;
        }
      }
  
      // 4️⃣ Determine dynamic start and end dates for date range
      let startDate;
      if (userRoutine.history.length > 0) {
        startDate = new Date(userRoutine.history[0].date);
      } else {
        startDate = new Date(today);
      }
      const endDate = new Date(today);
  
      const formatDate = (date) => date.toISOString().split("T")[0];
      const secToHours = (seconds) => (seconds / 3600).toFixed(1);
  
      // 5️⃣ Build date range array with daily completed hours
      const dateRangeHours = [];
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateKey = formatDate(d);
        const hours = secToHours(dailyTotals[dateKey] || 0);
        dateRangeHours.push({ date: dateKey, hours });
  
        // // Log for debugging
        // console.log(`Date: ${dateKey}, Hours: ${hours}`);
      }
  
      // 6️⃣ Build stats object with date strings formatted for badge display
      const stats = {
        totalHours: secToHours(totalCompletedSeconds),
        todayHours: secToHours(todayCompletedSeconds),
        longestDayHours: secToHours(longestDaySeconds),
        totalDate: `${startDate.toLocaleString("default", { month: "short" })} ${startDate.getFullYear()}`,
        todayDate: new Date(today).toLocaleDateString("default", { month: "short", day: "numeric" }),
        longestDayDate: longestDayDate
          ? new Date(longestDayDate).toLocaleDateString("default", { month: "short", day: "numeric" })
          : "-",
        dateRangeHours, // Include for client use if needed
      };
  
      // 7️⃣ Generate badge SVG with your existing function
      const svg = buildBadgeSVG(stats);
  
      // 8️⃣ Send response headers and SVG
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      res.send(svg);
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
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
