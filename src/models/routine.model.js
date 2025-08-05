import mongoose from "mongoose";

// models/UserRoutine.js
const mongoose = require("mongoose");

const RoutineItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  duration: String,
  originalDurationSeconds: Number,
  remainingSeconds: Number,
  isRunning: Boolean,
  isFinished: Boolean,
});

const UserRoutineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ✅ reference the User model
      required: true,
      unique: true,
    },
    routines: [RoutineItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("UserRoutine", UserRoutineSchema);
