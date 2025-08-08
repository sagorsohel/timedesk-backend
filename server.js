import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import session from "express-session";
import passport from "./src/config/passport.js";
import app from "./src/app.js";
import { startServerWithDailyReset } from "./src/utils/dailyReset.js";

// Session middleware BEFORE passport
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Start server with daily reset job
startServerWithDailyReset();
