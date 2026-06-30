const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["created", "updated", "deleted", "commented"],
      required: true,
    },
    details: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

activitySchema.index({ task: 1, createdAt: -1 });

module.exports = mongoose.model("Activity", activitySchema);
