import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import connectDB from "./config/db.js"
import authRoutes from "./routes/authRoutes.js";
import battleRoutes from "./routes/battleRoutes.js";

dotenv.config();

const app = express();

// Allows frontend to call backend APIs
app.use(cors());

// Allows backend to read JSON data from requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth",authRoutes);
app.use("/api/battle", battleRoutes);


connectDB();

export default app;