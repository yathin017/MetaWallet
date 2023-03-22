const https = require("https");
const crypto = require("crypto-js");
const bcrypt = require("bcrypt");
const BigInteger = require("bigi");
const ecurve = require("ecurve");
const ecparams = ecurve.getCurveByName("secp256k1"); //ecurve library constructor
const secrets = require("secrets.js-grempe");
const kyber = require("crystals-kyber");
const ethers = require("ethers");
const user = require("../wallet-backend/models/user");

async function fetchRandomBytes() {
  return new Promise((resolve, reject) => {
    https
      .get(
        "https://www.random.org/cgi-bin/randbyte?nbytes=32&format=h",
        (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            resolve(data.trim());
          });
        }
      )
      .on("error", (err) => {
        reject(err);
      });
  });
}

async function random32() {
  const response = await fetchRandomBytes();
  return response;
}

function hash(message) {
  const rounds = 12;
  const salt = `$2b$${rounds}$`.concat(
    crypto.SHA512(message).toString(crypto.enc.Hex)
  );
  const hashBcrypt = bcrypt.hashSync(message, salt);
  return crypto.SHA256(hashBcrypt).toString(crypto.enc.Hex);
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
  const bufferHashValue = Buffer.from(hash(String(hv)), "hex");
  const ecPoint = ecparams.pointFromX(true, hashValue);
  while (ecparams.isOnCurve(ecPoint) == false) {
    bufferHashValue = Buffer.from(hash(Buffer.toString()), "hex");
    ecPoint = ecparams.pointFromX(true, BigInteger.fromBuffer(bufferHashValue));
  }
  return String(ecPoint.affineX);
}

const usr = "username";
console.log(usr);

const hashUsr = hash(usr);
console.log(hashUsr);

const P = hashToEllipticCurvePoint(hashUsr);
console.log(P);

const Cr = "50 54 3a b2 47 47 33 8a bb 59 4b f8 53 25 7d f8 e4 18 00 a8 e0 58 11 56 73 6b 0d 4f e7 f5 a1 79"
console.log(Cr);

const alpha = ecPointExponentiation(P, Cr);
console.log(alpha);

const Sr = "43 ea cb f0 16 07 f2 2e f3 c5 60 47 f9 68 59 c3 e8 51 6f 18 9a 75 d1 c5 d1 ee 85 73 66 29 3c d2"
console.log(Sr);

const beta = ecPointExponentiation(alpha, Sr);
console.log(beta);

const CrInv = ecInverse(Cr);
console.log(CrInv);

const gamma = ecPointExponentiation(beta, CrInv);
console.log(gamma);

const gamma2 = ecPointExponentiation(P, Sr);
console.log(gamma2);
