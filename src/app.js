// src/app.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import authRoutes from "./routes/auth.js";
import personaRoutes from "./routes/persona.js";
import aiRoutes from "./routes/ai.js";
import cors from "cors";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api", aiRoutes);

export default app;
