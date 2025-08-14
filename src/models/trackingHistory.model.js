import mongoose from "mongoose";

const trackingHistorySchema = new mongoose.Schema({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  duration: { type: Number, required: true }, // in seconds
  date: { type: String, required: true }, // YYYY-MM-DD
}, { timestamps: true });

export default mongoose.model("TrackingHistory", trackingHistorySchema);
