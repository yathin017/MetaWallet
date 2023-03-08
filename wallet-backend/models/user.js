const mangooose = require("mongoose");

const userSchema = new mangooose.Schema({
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
  publicKey: {
    type: String,
  },
  socialRecoveryHelpers: [{"username": String, "secretShare": String}]
});

module.exports = mangooose.model("User", userSchema);
