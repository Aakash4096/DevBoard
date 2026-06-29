const mongoose = require("mongoose");
const config = require("./index");

const connectDB = async (retries = 3) => {
  // Register event handlers once
  mongoose.connection.on("connected", () => {
    console.log("Mongoose connected to MongoDB");
  });

  mongoose.connection.on("error", (err) => {
    console.error(`Mongoose connection error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose disconnected from MongoDB");
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });

  // Retry logic
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(config.mongoUri);
      console.log("MongoDB connected successfully");
      return;
    } catch (error) {
      console.error(`Attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt === retries) {
        throw new Error(`Failed to connect after ${retries} attempts`);
      }
      await new Promise((resolve) => setTimeout(resolve, attempt * 2000));
    }
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    throw new Error(`Error disconnecting MongoDB: ${error.message}`);
  }
};

module.exports = { connectDB, disconnectDB };
