const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    minlength: 2,
    maxlength: 50
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please use valid email"]
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },

  // 🎮 GAMIFICATION FIELDS
  totalXP: {
    type: Number,
    default: 0
  },

  level: {
    type: Number,
    default: 1
  },

  streak: {
    type: Number,
    default: 1
  },

  lastActiveDate: {
    type: Date,
    default: Date.now
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);