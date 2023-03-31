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
const Redis = require("redis");

const redisClient = Redis.createClient({
  url: `redis://default:${process.env.REDIS_PASSWORD}@redis-16977.c1.asia-northeast1-1.gce.cloud.redislabs.com:16977`
});

// const redisClient = Redis.createClient({
//   password: process.env.REDIS_PASSWORD,
//   host: "redis-16977.c1.asia-northeast1-1.gce.cloud.redislabs.com",
//   port: 16977,
// });

// Log any Redis connection errors
redisClient.on("error", (error) => {
  console.error(error);
});

redisClient.on("connect", () => {
  console.log("Redis connected");
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

// Middleware for checking if the user is cached in Redis
const isCached = (req, res, next) => {
  const username = req.params.username;
  if (username == null) {
    return res.status(400).json({ message: "Missing parameters in cache" });
  }
  // Check if the user is cached in Redis and pass object to next middleware
  redisClient.get(username, (err, data) => {
    if (err) {
      throw err;
    }
    if (data != null) {
      res.user = JSON.parse(data);
      next();
    } else {
      next();
    }
  });
};

async function getUser(req, res, next) {
  const username = req.params.username;
  // Validate the request body
  if (!username) {
    return res.status(400).json({ message: "Missing parameters in get user" });
  }
  // Check if the user is cached in Redis and pass object to next middleware
  try {
    isCached(req, res, next);
    // If cached, pass the user object to the next middleware
    if (res.user) {
      return next();
    }
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
    return res.status(400).json({ message: "Missing parameters in verify token" });
  }
  try {
    const user = res.user;
    const verify = verifyAuthSecret(user.authenticatorSecret, token);
    if (!verify) {
      return res.status(401).json({ message: "Invalid token" });
    }
    // Pass the user, verify object to the next middleware
    res.user = user;
    res.verify = verify;
    next();
  } catch (err) {
    next(err);
  }
}



// Routes

// Create a new user
router.post("/create", async (req, res) => {
  const {username, alpha, recoveryHelpers} = req.body;
  if (!username || !alpha) {
    return res.status(400).json({ message: "Missing parameters" });
  }
  try {
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
    const user = new User({
      username: username,
      random: randomValue,
      authenticatorSecret: authSecret.ascii
    });
    await user.save();
    return res
      .status(200)
      .json({ beta: { beta }, authenticatorSecret: authSecret.base32, helperKeys: { helperKeys } });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/init/:username", getUser, verifyToken, async (req, res) => {
  const { encryptedSecrets, publicKey, walletAddress } = req.body;
  if (!publicKey || !walletAddress) {
    return res.status(400).json({ message: "Missing parameters in post req" });
  }
  try {
    const user = res.user;
    const verified = res.verify;
    // Check if the user has already been initialized
    if (user.publicKey && user.walletAddress) {
      return res.status(409).json({ message: "User already initialized" });
    }
    if (!verified) {
      return res.status(401).json({ message: "Token not verified" });
    }
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
    user.walletAddress = walletAddress;
    // Save the updated user record to mongoDB
    await user.save();
    // Save to redis for caching
    redisClient.set(user.username, JSON.stringify(user));
    if (verified) {
      return res.status(200).json({ message: "Token verified" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


// Login
router.post("/login/:username", isCached, getUser, verifyToken, async (req, res) => {
  const { alpha } = req.body;
  if (!alpha) {
    return res.status(400).json({ message: "Missing parameters" });
  }
  try{
    const user = res.user;
    // Check if the user has a public key and public address
    if (!user.walletAddress) {
      return res.status(400).json({ message: "User has not been initialized" });
    }
    const beta = ecPointExponentiation(alpha, user.random);
    res.json({ beta: { beta }, message: "Login successful" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Get user
router.get("/:username", isCached, getUser, (req, res) => {
  try {
    const user = res.user;
    res.json(user.walletAddress);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Rekey
router.post("/rekey/:username", verifyToken, async (req, res) => {
  const { alpha } = req.body;
  if (!alpha) {
    return res.status(400).json({ message: "Missing parameters" });
  }
  try {
    const user = res.user;
    // Fetch the user's recovery helper's public key from mongoDB
    const recoveryHelpers = user.socialRecoveryHelpers.map(helper => helper.username);
    const existingHelpers = await User.find({ username: { $in: recoveryHelpers } });
    // Get the public key values of usernames in recoveryHelpers array
    const helperKeys = existingHelpers.map(helper => helper.publicKey);
    const randomValue = await random32();
    const beta = ecPointExponentiation(alpha, randomValue);
    user.random = randomValue;
    await user.save();
    res.json({ beta: { beta }, helperKeys: { helperKeys } });
    sendNotification("Your MetaWallet Rekeyed", "MetaWallet Rekeyed", `Your MetaWallet has been rekeyed on ${currentDate()}. Your username is ${user.username} and new walletAddress is ${user.walletAddress}. Please dont forget your MetaWallet passwords, incase you do you can recover your MetaWallet using your social recovery helpers.`, user.walletAddress);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/rekey-init/:username", verifyToken, async (req, res) => {
  const { encryptedSecrets, publicKey, walletAddress } = req.body;
  if (!publicKey || !walletAddress) {
    return res.status(400).json({ message: "Missing parameters" });
  }
  try {
    const user = res.user;
    const verified = res.verify;
    // Clear the user's socialRecoveryHelpers array
    user.socialRecoveryHelpers = [];
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
    user.walletAddress = walletAddress;
    // Save the updated user record to the database
    await user.save();
    // Save to redis for caching
    redisClient.set(user.username, JSON.stringify(user));
    if (verified) {
      return res.status(200).json({ message: "Token verified" });
    } else {
      return res.status(401).json({ message: "Token not verified" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// Change Password

// Delete user
router.delete("/delete/:username", getUser, verifyToken, async (req, res) => {
  try {
    const user = res.user;
    const deletedUser = await User.deleteOne({ username: user.username });
    if (deletedUser.deletedCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(204).end(); // 204 No Content response indicates success
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
