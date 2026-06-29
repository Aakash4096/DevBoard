const config = require("./config");
const { connectDB } = require("./config/database");
const errorHandler = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const ApiError = require("./utils/ApiError");

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

//route
app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});
app.use("/api/auth", authRoutes);

//  404 handler — for any route not matched above
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
