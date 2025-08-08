import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import { scheduleDailyRoutineReset } from "./src/utils/resetRoutines.js";
dotenv.config({ path: "./.env" }); // ✅ load first
import session from "express-session";
import passport from './src/config/passport.js'

// import { connectDB } from "./config/db.js";
// Session middleware (needed for passport)
// ✅ Add session middleware BEFORE passport
app.use(
    session({
      secret: process.env.JWT_SECRET,
      resave: false,
      saveUninitialized: false,
    })
  );
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

const PORT = process.env.PORT || 5000;

// 🕒 Start the reset cron job
scheduleDailyRoutineReset();

// Connect DB and start server
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
