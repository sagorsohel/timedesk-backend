import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { scheduleDailyRoutineReset } from "./src/utils/resetRoutines.js";
dotenv.config();

// import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// 🕒 Start the reset cron job
scheduleDailyRoutineReset();

// Connect DB and start server
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
