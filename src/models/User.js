//User model

// src/models/User.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    personaCount: {
      type: Number,
      default: 3,
    },
    status: {
      type: String,
      default: "trial",
    },
    userType: {
      type: String,
      default: "free",
    },
    availableRequest: {
      type: Number,
      default: 7,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);

export default User;
