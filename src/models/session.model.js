const mongoose = require("mongoose");

const Session = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "users",
      required: [true, "User is required"],
    },
    refreshTokenHash: {
      type: "string",
      required: [true, "refreshToken is required"],
    },
    ip: {
      type: "string",
      required: [true, "Ip is required"],
    },
    userAgent: {
      type: "string",
      required: [true, "User Agent is required"],
    },
    revoke: {
      type: "boolean",
      default:false
    },
  },
  {
    timestamps: true,
  },
);
const sessionSchema = mongoose.model("sessions",Session)

module.exports = sessionSchema