const crypto = require("crypto");
const bcrypt = require("bcrypt");
const BigInteger = require("bigi");
const ecurve = require("ecurve");
const ecparams = ecurve.getCurveByName("secp256k1"); //ecurve library constructor
const secrets = require("secrets.js-grempe");
const kyber = require("crystals-kyber");
const ethers = require('ethers');
const https = require('https');

// Functions
function hash(message) {
  const rounds = 12;
  const salt = `$2b$${rounds}$`.concat(
    crypto.createHash("sha512").update(message).digest("hex")
  );
  const hashBcrypt = bcrypt.hashSync(message, salt);
  return crypto.createHash("sha256").update(hashBcrypt).digest("hex");
}

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
  let bufferHashValue = Buffer.from(hash(String(hv)), "hex");
  let ecPoint = ecparams.pointFromX(true, hashValue);
  while (ecparams.isOnCurve(ecPoint) == false) {
    bufferHashValue = Buffer.from(hash(Buffer.toString()), "hex");
    ecPoint = ecparams.pointFromX(true, BigInteger.fromBuffer(bufferHashValue));
  }
  return String(ecPoint.affineX);
}

function hexTOdec(hex) {
  return String(parseInt(hex, 16).toString(10));
}

function hexToUint8Array(secret) {
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

// Make changes to the original function (dir: node_modules\crystals-kyber\kyber512.js)
// https://www.diffchecker.com/eG5d9gLb/
function kyberKeyGeneration(secretUint8Array) {
  const pk_sk = kyber.KeyGen512(secretUint8Array);
  return [uint8ArrayToHex(pk_sk[0]), uint8ArrayToHex(pk_sk[1])];
}

// Client side
const username = "yathin017";
const pwd = "password";

const hashUsername = hash(username);
const hashpwd = hash(pwd);
console.log("USERNAME: ",hashUsername);
console.log("PASSWORD: ",hashpwd);

const Cr = random32();
const CrInv = ecInverse(Cr);
const alpha = ecPointExponentiation(hashToEllipticCurvePoint(hexTOdec(hashUsername)), Cr);

console.log("Cr: ",Cr);
console.log("CrInv: ",CrInv);
console.log("ALPHA: ",alpha);

// Server side
const Sr = "cb1161f9dbae25cc4dc3eb85a722c3a2cc8ead1ce9a6ab711b5a0ca6ae474127"; // await random32()
const beta = ecPointExponentiation(alpha, Sr);

// Client side
const gamma = ecPointExponentiation(beta, CrInv);

// PQC Secret Sharing
const shares = [
  String("801").concat(String(hashpwd)),
  String("802").concat(String(gamma)),
];

const mainshare = secrets.newShare("3", shares);
console.log("NEW SHARE: " + mainshare);

const secret = secrets.combine(shares);
console.log("SECRET: " + secret);

const keyPair = kyberKeyGeneration(hexToUint8Array(secret));
// console.log("PUBLIC KEY: " + keyPair[0]);
// console.log("PRIVATE KEY: " + keyPair[1]);

const wallet = new ethers.Wallet(hash(keyPair[1]));
console.log("ADDRESS: ",wallet.address);
