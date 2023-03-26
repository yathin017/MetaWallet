const crypto = require("crypto");
const bcrypt = require("bcrypt");
const BigInteger = require("bigi");
const ecurve = require("ecurve");
const ecparams = ecurve.getCurveByName("secp256k1"); //ecurve library constructor
const secrets = require("secrets.js-grempe");
const kyber = require("crystals-kyber");
const ethers = require('ethers');

// Functions
function hash(message) {
  const rounds = 12;
  const salt = `$2b$${rounds}$`.concat(
    crypto.createHash("sha512").update(message).digest("hex")
  );
  const hashBcrypt = bcrypt.hashSync(message, salt);
  return crypto.createHash("sha256").update(hashBcrypt).digest("hex");
}

function hexTOdec(hex) {
  return String(parseInt(hex, 16).toString(10));
}

function random256() {
  return crypto.randomBytes(32).toString("hex");
}

function ecModExponent(sp, exp) {
  const startPoint = BigInteger(String(sp));
  const exponent = BigInteger(String(exp));
  const ecPoint = ecparams.pointFromX(true, startPoint);
  const resultPoint = ecPoint.multiply(exponent);
  return String(resultPoint.affineX);
}

function ecInverse(Cr) {
  const key = BigInteger(String(Cr));
  const keyInv = key.modInverse(ecparams.n);
  return keyInv.toString();
}

function hashToEllipticCurvePoint(hv) {
  const hashValue = BigInteger(String(hv));
  const bufferHashValue = Buffer.from(hash(String(hv)), "hex");
  const ecPoint = ecparams.pointFromX(true, hashValue);
  while (ecparams.isOnCurve(ecPoint) == false) {
    bufferHashValue = Buffer.from(hash(Buffer.toString()), "hex");
    ecPoint = ecparams.pointFromX(true, BigInteger.fromBuffer(bufferHashValue));
  }
  return String(ecPoint.affineX);
}

function secretToUint8Array(secret) {
  const secretUint8Array = new Uint8Array(Math.ceil(secret.length / 2));
  for (let i = 0; i < secret.length; i++) {
    secretUint8Array[i] = parseInt(secret.substr(i * 2, 2), 16);
  }
  return secretUint8Array;
}

function uint8ArrayToHex(uint8Array) {
  const hex = Buffer.from(uint8Array).toString("hex");
  return hex;
}

// Make changes to the original function (dir: node_modules\crystals-kyber\kyber1024.js)
// https://www.diffchecker.com/eG5d9gLb/
function kyberKeyGeneration(secretUint8Array) {
  const pk_sk = kyber.KeyGen1024(secretUint8Array);
  return [uint8ArrayToHex(pk_sk[0]), uint8ArrayToHex(pk_sk[1])];
}

// Client side
const username = "yathin017";
const pwd1 = "Password1";
const pwd2 = "Password2";

const hashUsername = hash(username);
console.log("USERNAME: ",hashUsername);

const Cr = random256();
const CrInv = ecInverse(Cr);
const alpha = ecModExponent(
  hashToEllipticCurvePoint(hexTOdec(username.concat(pwd1))),
  Cr
);

console.log("ALPHA: ",alpha);

// Server side
const Sr = "cb1161f9dbae25cc4dc3eb85a722c3a2cc8ead1ce9a6ab711b5a0ca6ae474127"; // random256()
const beta = ecModExponent(alpha, Sr);

// Client side
const gamma = ecModExponent(beta, CrInv);
const hashPwd2 = hash(pwd2);

// (n>=2, m>=5) Shamir's Secret Sharing
const shares = [
  String("801").concat(String(hashPwd2)),
  String("802").concat(String(gamma)),
];

const mainshare = secrets.newShare("4", shares);
console.log("NEW SHARE: " + mainshare);

const secret = secrets.combine(shares);
console.log("SECRET: " + secret);

const keyPair = kyberKeyGeneration(secretToUint8Array(secret));
// console.log("PUBLIC KEY: " + keyPair[0]);
// console.log("PRIVATE KEY: " + keyPair[1]);

const wallet = new ethers.Wallet(hash(keyPair[1]));
console.log("ADDRESS: ",wallet.address);
