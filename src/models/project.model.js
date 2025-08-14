
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    tags: [String],
    amount: Number,
    isDone: Boolean,
    timerStart: Date,
    totalTrackedTime: { type: Number, default: 0 }, // ✅ initialize
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  }, { timestamps: true });
  
  export default mongoose.model("Project", projectSchema);
  