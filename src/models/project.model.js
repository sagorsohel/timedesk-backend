
import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name: String,
    description: String,
    tags: [String],
    amount: Number,
    isDone: Boolean,
    timerStart: Date,
    totalTrackedTime: Number,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  }, { timestamps: true });
  
  export default mongoose.model("Project", projectSchema);
  