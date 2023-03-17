const express = require("express");
const crypto = require("crypto");
const BigInteger = require("bigi");
const ecurve = require("ecurve");
const ecparams = ecurve.getCurveByName("secp256k1"); //ecurve library constructor
const router = express.Router();
const speakeasy = require("speakeasy");
const PushAPI = require("@pushprotocol/restapi");
const ethers = require("ethers");
const User = require("../models/user");
require("dotenv").config();

// Import Redis client library
const redis = require("redis");

const redisClient = redis.createClient({
  password: process.env.REDIS_PASSWORD,
  host: "redis-16977.c1.asia-northeast1-1.gce.cloud.redislabs.com",
  port: 16977,
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

// Log any Redis connection errors
redisClient.on("error", (error) => {
  console.error(error);
});

// Functions
function random256() {
  return crypto.randomBytes(32).toString("hex");
}

function ecModExponent(sp, exp) {
  const exponent = BigInteger(String(exp));
  const startPoint = BigInteger(String(sp));
  const ecPoint = ecparams.pointFromX(true, startPoint);
  const resultPoint = ecPoint.multiply(exponent);
  return String(resultPoint.affineX);
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

// Middleware for checking if the user is cached in Redis
const isCached = (req, res, next) => {
  const { username } = req.params;
  //First check in Redis
  redisClient.get(username, (err, user) => {
    if (err) {
      console.log(err);
    }
    if (user) {
      const reponse = JSON.parse(user);
      return res.status(200).json(reponse);
    }
    next();
  });
};

// PUSH API
const PK = process.env.CHANNEL_PRIVATE_KEY; // channel private key
const Pkey = `0x${PK}`;
const _signer = new ethers.Wallet(Pkey);

const sendNotification = async (nBody, pTitle, pBody, receiver) => {
  try {
    const apiResponse = await PushAPI.payloads.sendNotification({
      signer: _signer,
      type: 3, // broadcast
      identityType: 2, // direct payload
      notification: {
        title: "MetaWallet",
        body: nBody,
      },
      payload: {
        title: pTitle,
        body: pBody,
        cta: "",
        img: "",
      },
      recipients: `eip155:5:${receiver}`,
      channel: "eip155:5:0xE6707721ad79f4519f80D95ef4D961b60893CD76", // your channel address
      env: "staging",
    });
  } catch (err) {
    console.error("Error: ", err);
  }
};

function currentDate(){
  const date = new Date();
  return date;
}


// Routes

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
    // Save to redis for caching
    redisClient.set(username, JSON.stringify(user));
    return res
      .status(201)
      .json({ beta: { beta }, authenticatorSecret: { authSecretBase32 } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Get user
router.get("/:username", isCached, getUser, verifyToken, (req, res) => {
  res.json(res.user);
});

// Update user for social recovery
router.patch("/:username", getUser, verifyToken, async (req, res) => {
  const { username, publicAddress, socialRecoveryHelpers } = req.body;
  if (
    publicAddress != null &&
    socialRecoveryHelpers != null &&
    Array.isArray(socialRecoveryHelpers)
  ) {
    res.user.publicAddress = publicAddress;
    res.user.socialRecoveryHelpers = socialRecoveryHelpers;
  }
  try {
    if (res.user.publicAddress == null) {
      const updatedUser = await res.user.save();
      // Save to redis for caching
      redisClient.set(username, JSON.stringify(updatedUser));
      res.json(updatedUser);
      sendNotification("New MetaWallet Created", "MetaWallet Created", `Your MetaWallet has been created on ${currentDate()}. Your username is ${res.user.username} and publicAddress is ${res.user.publicAddress}. Please dont forget your MetaWallet passwords, incase you do you can recover your MetaWallet using your social recovery helpers.`, res.user.publicAddress);
    }
    const updatedUser = await res.user.save();
    // Save to redis for caching
    redisClient.set(username, JSON.stringify(updatedUser));
    res.json(updatedUser);
    sendNotification("Your MetaWallet Changed", "MetaWallet Changed", `Your MetaWallet has been rekeyed on ${currentDate()}. Your username is ${res.user.username} and publicAddress is ${res.user.publicAddress}. Please dont forget your MetaWallet passwords, incase you do you can recover your MetaWallet using your social recovery helpers.`, res.user.publicAddress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Rekey beta
router.patch("/rekey/:username", getUser, verifyToken, async (req, res) => {
  const randomValue = random256();
  const beta = ecModExponent(req.body.alpha, randomValue);
  res.user.random = randomValue;
  try {
    const updatedUser = await res.user.save();
    // Save to redis for caching
    redisClient.set(username, JSON.stringify(updatedUser));
    res.json({ beta: { beta } });
    sendNotification("Your MetaWallet Rekeyed", "MetaWallet Rekeyed", `Your MetaWallet has been rekeyed on ${currentDate()}. Your username is ${res.user.username} and new publicAddress is ${res.user.publicAddress}. Please dont forget your MetaWallet passwords, incase you do you can recover your MetaWallet using your social recovery helpers.`, res.user.publicAddress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user
router.delete("/:username", getUser, verifyToken, async (req, res) => {
  try {
    await res.user.remove();
    res.json({ message: "Deleted user" });
    sendNotification("Your MetaWallet Deleted", "MetaWallet Deleted", `Your MetaWallet has been deleted from our database on ${currentDate()}. Please dont forget your MetaWallet passwords, we cant recover your MetaWallet for you.`);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
