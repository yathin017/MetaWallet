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
  socialRecoveryHelpers: [{"username": String, "index": Number, "secretNumber": String}], // User's helpers
  socialRecovery: [{"username": String, "publicKey": String}], // To whom the user is a helper
});

module.exports = mangooose.model("User", userSchema);
