const config = require("./config");
const { connectDB } = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const ApiError = require("./utils/ApiError");
const protect = require("./middleware/auth");
const orgRoutes = require("./routes/orgRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const taskDetailRoutes = require("./routes/taskDetailRoutes");
const commentTaskRoutes = require("./routes/commentTaskRoutes");
const activityTaskRoutes = require("./routes/activityTaskRoutes");

const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

// Protected test route
app.get("/api/me", protect, (req, res) => {
  res.json({ user: req.user });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orgs", orgRoutes);
app.use("/api/orgs/:orgId/projects", projectRoutes);
app.use("/api/projects/:projectId/tasks", taskRoutes);
app.use("/api/tasks/:taskId/comments", commentTaskRoutes);
app.use("/api/tasks/:taskId/activity", activityTaskRoutes);
app.use("/api/tasks", taskDetailRoutes);

// 404 handler
app.use((req, res, next) => {
  next(new ApiError(404, `Route ${req.originalUrl} not found`));
});

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(
        `Server running on port ${config.port} in ${config.nodeEnv} mode`,
      );
    });
  } catch (err) {
    console.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

startServer();
