import mongoose from "mongoose";



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

export const UserRoutine = mongoose.model("Routine", UserRoutineSchema);
