import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js";
import battleRoutes from "./routes/battleRoutes.js";
import leaderboardRoutes from "./routes/leaderRoutes.js"
import executeRoutes from "./routes/executeRoutes.js"
import cookieParser from 'cookie-parser'
dotenv.config();

const app = express();

// Allows frontend to call backend APIs
app.use(cors({ origin: ["http://localhost:5173","http://localhost:5176"], credentials: true }));
app.use(cookieParser());

// Allows backend to read JSON data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/test", (req, res) => {
  res.send("API working");
});

app.use("/api/auth",authRoutes);
app.use("/api/battle", battleRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.use("/api", executeRoutes);
connectDB();

export default app;