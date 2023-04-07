const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  random: {
    type: String,
    required: true,
  },
  authenticatorSecret: {
    type: String,
    required: true,
  },
  walletAddress: {
    type: String,
  }
});

module.exports = mongoose.model("User", userSchema);
