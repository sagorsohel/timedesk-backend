import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
// app.use("/api/users", userRoutes);

// Global Error Handler
// app.use(globalErrorHandler);

export default app;
