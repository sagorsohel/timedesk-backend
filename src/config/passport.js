import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/user.model.js";
import { UserRoutine } from "../models/routine.model.js";
import getDefaultRoutines from "../utils/defaultRoutines.js";

import dotenv from "dotenv";
dotenv.config({ path: "./.env" }); // ✅ load first


passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: `${process.env.API_BASE_URL}/api/v1/auth/github/callback`,
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email)
          return done(new Error("GitHub account has no public email"));

        let user = await User.findOne({ email });

        if (!user) {
          // Create user
          user = await User.create({
            name: profile.displayName || profile.username,
            email,
            password: null, // No password for OAuth
          });

          // Create default routines
          await UserRoutine.create({
            userId: user._id,
            routines: getDefaultRoutines(),
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

export default passport;
