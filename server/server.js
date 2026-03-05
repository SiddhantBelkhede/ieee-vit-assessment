import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/database.js";

import candidateRoutes from "./routes/candidateRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config();

const app = express();

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/api/candidate", candidateRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("Assessment Protocol API is running...");
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[SERVER] System online on port ${PORT}`);
});
