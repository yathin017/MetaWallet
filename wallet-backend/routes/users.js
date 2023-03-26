const express = require("express");
const https = require('https');
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
async function fetchRandomBytes() {
  return new Promise((resolve, reject) => {
    https.get('https://www.random.org/cgi-bin/randbyte?nbytes=32&format=h', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        resolve(data.trim());
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function random32() {
  const response = await fetchRandomBytes();
  return response;
}

function ecPointExponentiation(sp, exp) {
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

// Middleware for checking if the user is cached in Redis
const isCached = (req, res, next) => {
  const { username } = req.body;
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

async function getUser(req, res, next) {
  const { username } = req.params;
  // Validate the request body
  if (!username) {
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
  const token = req.body.token;
  if (!token) {
    return res.status(400).json({ message: "Missing parameters" });
  }
  const user = res.user;
  if (!verifyAuthSecret(user.authenticatorSecret, token)) {
    return res.status(401).json({ message: "Invalid token" });
  }
  next();
}


// Routes

// Create a new user
router.post("/create", async (req, res) => {
  const {username, alpha, recoveryHelpers} = req.body;
  try {
    if (!username || !alpha) {
      return res.status(400).json({ message: "Missing parameters" });
    }
    // Check if a record with the same username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    // Check if a record with email in recoveryHelpers array already exists
    const existingHelpers = await User.find({ username: { $in: recoveryHelpers } });
    if (existingHelpers.length !== recoveryHelpers.length) {
      return res.status(400).json({ error: "One or more recovery helper usernames do not match" });
    }
    // Get the public key values of usernames in recoveryHelpers array
    const helperKeys = existingHelpers.map(helper => helper.publicKey);
    // If no existing record with the same username is found, create a new record
    const randomValue = await random32();
    const beta = ecPointExponentiation(alpha, randomValue);
    const authSecret = generateAuthenticatorSecret();
    const authSecretBase32 = authSecret.base32;
    const user = new User({
      username: username,
      random: randomValue,
      authenticatorSecret: authSecret.ascii
    });
    await user.save();
    // Save to redis for caching
    redisClient.set(username, JSON.stringify(user));
    return res
      .status(200)
      .json({ beta: { beta }, authenticatorSecret: { authSecretBase32 } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/init", async (req, res) => {
  const { username, encryptedSecrets, token, publicKey, publicAddress } = req.body;
  try {
    if (!username || !token || !publicKey || !publicAddress) {
      return res.status(400).json({ message: "Missing parameters" });
    }
    // Find the user with the specified username
    const user = await User.findOne({ username });
    if (user == null) {
      return res.status(404).json({ message: "Cannot find user" });
    }
    // Find the authenticator secret of the user with the specified username
    const authenticatorSecret = user.authenticatorSecret;
    // Verify the token
    const verified = verifyAuthSecret(authenticatorSecret, token);
    // Add the encrypted secrets to socialRecoveryHelpers array in mongoDB
    // Loop through the recoveryHelpers array and update the user record for each one
    for (const helper of encryptedSecrets) {
      // Check if the helper's username already exists in the database
      const existingHelper = await User.findOne({ username: helper.username });
      if (!existingHelper) {
        return res.status(409).json({ error: "One or more recovery helper usernames do not match" });
      }
      // Add the helper's username and secretShare to the user's socialRecoveryHelpers array
      user.socialRecoveryHelpers.push({
        username: helper.username,
        secretShare: helper.secretShare
      });
    }
    // Add the public key and public address to the user record
    user.publicKey = publicKey;
    user.publicAddress = publicAddress;
    // Save the updated user record to the database
    await user.save();
    // Save to redis for caching
    redisClient.set(username, JSON.stringify(user));
    if (verified) {
      return res.status(200).json({ message: "Token verified" });
    } else {
      return res.status(401).json({ message: "Token not verified" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});
 
// Get user
router.get("/:username", isCached, getUser, (req, res) => {
  res.json(res.user.publicAddress);
});

// Rekey beta
router.patch("/rekey/:username", getUser, verifyToken, async (req, res) => {
  const randomValue = await random32();
  const beta = ecPointExponentiation(req.body.alpha, randomValue);
  res.user.random = randomValue;
  try {
    const updatedUser = await res.user.save();
    // Save to redis for caching
    redisClient.set(req.params.username, JSON.stringify(updatedUser));
    res.json({ beta: { beta } });
    sendNotification("Your MetaWallet Rekeyed", "MetaWallet Rekeyed", `Your MetaWallet has been rekeyed on ${currentDate()}. Your username is ${res.user.username} and new publicAddress is ${res.user.publicAddress}. Please dont forget your MetaWallet passwords, incase you do you can recover your MetaWallet using your social recovery helpers.`, res.user.publicAddress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete user
router.delete("/delete/:username", getUser, verifyToken, async (req, res) => {
  // const username = req.params.username;
  // res.user.username = username;
  try {
    const deletedUser = await User.deleteOne({ username: res.user.username });
    if (deletedUser.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(204).end(); // 204 No Content response indicates success
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
