// src/app.js
import express from "express";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import authRoutes from "./routes/auth.js";
import personaRoutes from "./routes/persona.js";
import protectedRoutes from "./routes/protected.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/personas", personaRoutes);
app.use("/api", protectedRoutes);

export default app;
