import mongoose from "mongoose";

const RoutineItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  duration: String,
  originalDurationSeconds: Number,
  remainingSeconds: Number,
  isRunning: Boolean,
  isFinished: Boolean,
}, { _id: true });

const RoutineHistorySchema = new mongoose.Schema({
  date: {
    type: String, // Format: "YYYY-MM-DD"
    required: true,
  },
  routines: [RoutineItemSchema],
}, { _id: false });

const UserRoutineSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    routines: [RoutineItemSchema],

    // 🆕 Daily history backup
    history: [RoutineHistorySchema],

    // 🆕 Last date when reset was performed (format: "YYYY-MM-DD")
    lastReset: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const UserRoutine = mongoose.model("Routine", UserRoutineSchema);
