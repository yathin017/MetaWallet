const express = require("express");
const crypto = require("crypto");
const BigInteger = require("bigi");
const speakeasy = require("speakeasy");
const ecurve = require("ecurve");
const ecparams = ecurve.getCurveByName("secp256k1"); //ecurve library constructor

// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();

// This will help us connect to the database
const dbo = require("../db/connection");

// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

function random256() {
  return crypto.randomBytes(32).toString("hex");
}

function ECModExponent(gx, expo) {
  const exponent = BigInteger(String(expo));
  const xpt = BigInteger(String(gx));
  const pt = ecparams.pointFromX(true, xpt);
  const curvePt = pt.multiply(exponent);
  return [String(curvePt.affineX), String(curvePt.affineY)];
}

function generateAuthenticatorSecret() {
  const secret = speakeasy.generateSecret({
    name: "MetaWallet",
  });
  return secret;
}

function verify(secret, token) {
  const verify = speakeasy.totp.verify({
    secret: `${secret}`,
    encoding: "ascii",
    token: `${token}`,
  });
  return verify;
}

// This section will help you get a single record by id
recordRoutes.route("/login/:id").get(function (req, res) {
  const db_connect = dbo.getDb();
  const query = { username: JSON.stringify(req.params.username) };
  const token = req.params.authenticatorToken
    db_connect.collection("records").findOne(query, function (err, result) {
      if (err) throw err;
      if (verify(result.authenticatorSecret, token)){
        res.json(result.ks);
      }
    });
});

// This section will help you create a new record.
recordRoutes.route("/register").post(function (req, response) {
  const db_connect = dbo.getDb();
  const ks = random256();
  const Beta = ECModExponent(req.body.AlphaX, ks)[0];
  const authenticatorSecret = generateAuthenticatorSecret();
  const rec = {
    username: req.body.username,
    ks: ks,
    authenticatorSecret: authenticatorSecret,
  };
  let query = { username: JSON.stringify(req.params.username) };
  db_connect.collection("records").findOne(query, function (err, result) {
    assert.equal(err, null);
    let response = { sucess: true, msg: "Account created successfully", Beta: {Beta}, authenticatorSecret: {authenticatorSecret} };
    if (!result) {
      db_connect.collection("records").insertOne(rec, function (err, res) {
        if (err) {
          response.sucess = false;
          response.status = 500;
          response.msg = "There was a problem registering the account.";
        }
        callback(response);
        client.close();
      });
    } else {
      response.msg = "The account already exists";
      callback(response);
      client.close();
    }
  });
});

// // This section will help you update a record by id.
// recordRoutes.route("/update/:id").post(function (req, response) {
//   let db_connect = dbo.getDb();
//   let myquery = { _id: ObjectId(req.params.id) };
//   let newvalues = {
//     $set: {
//       name: req.body.name,
//       position: req.body.position,
//       level: req.body.level,
//     },
//   };
//   db_connect
//     .collection("records")
//     .updateOne(myquery, newvalues, function (err, res) {
//       if (err) throw err;
//       console.log("1 document updated");
//       response.json(res);
//     });
// });

// // This section will help you delete a record
// recordRoutes.route("/:id").delete((req, response) => {
//   let db_connect = dbo.getDb();
//   let myquery = { _id: ObjectId(req.params.id) };
//   db_connect.collection("records").deleteOne(myquery, function (err, obj) {
//     if (err) throw err;
//     console.log("1 document deleted");
//     response.json(obj);
//   });
// });

module.exports = recordRoutes;
