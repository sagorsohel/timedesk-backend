// models/project.model.js
import mongoose from "mongoose";

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
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Project", projectSchema);
