import cron from "node-cron";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import { UserRoutine } from "../models/routine.model.js";
import { connectDB } from "../config/db.js";
import app from "../app.js";

dayjs.extend(utc);

const PORT = process.env.PORT || 5000;
const HISTORY_KEEP_DAYS = 30; // adjust as needed

async function performDailyReset() {
  console.log("Running daily reset:", new Date().toISOString());
  const today = dayjs().utc().format("YYYY-MM-DD");

  const cursor = UserRoutine.find().cursor();
  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    try {
      if (doc.lastReset === today) continue;

      const routinesSnapshot = (doc.routines || []).map(r => {
        const completed = Math.max(
          0,
          (r.originalDurationSeconds || 0) - (r.remainingSeconds || 0)
        );
        return {
          id: r.id,
          name: r.name,
          originalDurationSeconds: r.originalDurationSeconds || 0,
          remainingSeconds: r.remainingSeconds || 0,
          completedSeconds: completed,
          isFinished: r.isFinished || false
        };
      });

      doc.history = doc.history || [];
      doc.history.push({
        date: today,
        routines: routinesSnapshot
      });

      if (doc.history.length > HISTORY_KEEP_DAYS) {
        doc.history = doc.history.slice(doc.history.length - HISTORY_KEEP_DAYS);
      }

      doc.routines = (doc.routines || []).map(r => ({
        ...r.toObject ? r.toObject() : r,
        remainingSeconds: r.originalDurationSeconds || 0,
        isRunning: false,
        isFinished: false
      }));

      doc.lastReset = today;
      await doc.save();
    } catch (err) {
      console.error("Error resetting user:", doc._id, err);
    }
  }
  console.log("Daily reset done.");
}

export async function startServerWithDailyReset() {
  await connectDB();

  cron.schedule(
    "5 0 * * *",
    () => {
      performDailyReset().catch(console.error);
    },
    { scheduled: true, timezone: "UTC" }
  );

  await performDailyReset();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}
