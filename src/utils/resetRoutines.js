// utils/resetRoutines.js
import cron from "node-cron";
import { UserRoutine } from "../models/routine.model.js";

export function scheduleDailyRoutineReset() {
  cron.schedule("0 0 * * *", async () => {
    const today = new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD'

    try {
      const userRoutines = await UserRoutine.find();

      for (const userRoutine of userRoutines) {
        const oldRoutinesCopy = userRoutine.routines.map((routine) => ({
          ...routine.toObject(),
        }));

        // Push to history
        userRoutine.history.push({
          date: today,
          routines: oldRoutinesCopy,
        });

        // Reset the current routines
        userRoutine.routines.forEach((routine) => {
          routine.remainingSeconds = routine.originalDurationSeconds;
          routine.isRunning = false;
          routine.isFinished = false;
        });

        userRoutine.lastReset = today;
        await userRoutine.save();
      }

      console.log("✅ Daily routine reset and history backup complete.");
    } catch (error) {
      console.error("❌ Error during daily reset:", error);
    }
  });

  console.log("🕒 Routine reset cron scheduled to run at midnight daily.");
}
