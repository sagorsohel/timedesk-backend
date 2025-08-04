import dotenv from "dotenv";
import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
dotenv.config();

// import { connectDB } from "./config/db.js";

const PORT = process.env.PORT || 5000;

// Connect DB and start server
connectDB();
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
