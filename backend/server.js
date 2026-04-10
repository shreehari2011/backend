const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

/* 🔗 Connect MongoDB */
connectDB();

const app = express();

/* 🌐 CORS — allow Vite frontend */
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

/* 🧠 Middleware to read JSON body */
app.use(express.json());

/* 🩺 Health Check Route */
app.get("/", (req, res) => {
  res.status(200).json({
    status: "Backend Running 🚀",
    message: "Lumina API is live",
  });
});

/* ================= ROUTES ================= */

/* Auth Routes */
app.use("/api/auth", require("./routes/authRoutes"));

/* Task Routes */
app.use("/api/tasks", require("./routes/taskRoutes"));

/* AI Routes */
app.use("/api/ai", require("./routes/aiRoutes"));

/* Analytics Routes */
app.use("/api/analytics", require("./routes/analyticsRoutes"));

/* Leaderboard Routes */
app.use("/api/leaderboard", require("./routes/leaderboardRoutes"));

/* ✅ ADD THIS (COMMUNITY / POSTS) */
app.use("/api/posts", require("./routes/postRoutes"));

/* ========================================= */

/* ❌ 404 Handler — if route not found */
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found ❌",
    path: req.originalUrl,
  });
});

/* 💥 Global Error Handler */
app.use((err, req, res, next) => {
  console.error("🔥 SERVER ERROR:", err.message);

  res.status(err.status || 500).json({
    message: "Internal Server Error",
    error: err.message,
  });
});

/* 🚀 Start Server */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});