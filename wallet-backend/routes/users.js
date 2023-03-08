const express = require("express");
const crypto = require("crypto");
const BigInteger = require("bigi");
const ecurve = require("ecurve");
const ecparams = ecurve.getCurveByName("secp256k1"); //ecurve library constructor
const router = express.Router();
const speakeasy = require("speakeasy");
const User = require("../models/user");

// Functions
function random256() {
  return crypto.randomBytes(32).toString("hex");
}

function ecModExponent(sp, exp) {
  const exponent = BigInteger(String(exp));
  const startPoint = BigInteger(String(sp));
  const ecPoint = ecparams.pointFromX(true, startPoint);
  const resultPoint = ecPoint.multiply(exponent);
  return [String(resultPoint.affineX), String(resultPoint.affineY)];
}

function generateAuthenticatorSecret() {
  const authSecret = speakeasy.generateSecret({
    name: "MetaWallet",
  });
  return authSecret;
}

function verifyAuthSecret(secret, token) {
  const verify = speakeasy.totp.verify({
    secret: secret,
    encoding: "ascii",
    token: token,
  });
  return verify;
}

async function getUser(req, res, next) {
  const { username, token } = req.body;
  // Validate the request body
  if (!username || !token) {
    return res.status(400).json({ message: "Missing parameters" });
  }
  try {
    // Find the user with the specified username
    const user = await User.findOne({ username });
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
    // Pass the user object to the next middleware
    res.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

// Middleware for verifying the authenticity of the token
function verifyToken(req, res, next) {
  const user = res.user;
  const token = req.body.token;
  if (!verifyAuthSecret(user.authenticatorSecret, token)) {
    return res.status(401).json({ message: "Invalid token" });
  }
  next();
}

// Routes
// Get user
router.get("/:username", getUser, verifyToken, (req, res) => {
  res.json(res.user);
});

// Create user
router.post("/create", async (req, res) => {
  const username = req.body.username;
  try {
    // Check if a record with the same username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    // If no existing record with the same username is found, create a new record
    const randomValue = random256();
    const beta = ecModExponent(req.body.alpha, randomValue);
    const authSecret = generateAuthenticatorSecret();
    const authSecretBase32 = authSecret.base32;
    const user = new User({
      username,
      random: randomValue,
      authenticatorSecret: authSecret.ascii,
    });
    await user.save();
    return res
      .status(201)
      .json({ beta: { beta }, authenticatorSecret: { authSecretBase32 } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Update user
router.patch("/:username", getUser, verifyToken, async (req, res) => {
  const { socialRecoveryHelpers } = req.body;
  if (socialRecoveryHelpers != null && Array.isArray(socialRecoveryHelpers)) {
    // Push each object in the socialRecoveryHelpers array to the user's socialRecoveryHelpers array
    socialRecoveryHelpers.forEach((helper) => {
      res.user.socialRecoveryHelpers.push(helper);
    });
  }
  try {
    const updatedUser = await res.user.save();
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user
router.delete("/:username", getUser, verifyToken, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted user" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
