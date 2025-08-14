// models/project.model.js
import mongoose from "mongoose";
const timeLogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  duration: { type: Number, required: true }, // in seconds
  startedAt: { type: Date },
  endedAt: { type: Date },
});
const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    tags: [{ type: String }],
    amount: { type: Number, default: 0 },
    isDone: { type: Boolean, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    timerStart: { type: Date, default: null },
    totalTrackedTime: { type: Number, default: 0 }, // in milliseconds
    timeLogs: [timeLogSchema], // history log
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);
