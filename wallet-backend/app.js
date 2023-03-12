const { Polybase } = require("@polybase/client");
const speakeasy = require("speakeasy");

const db = new Polybase({
  defaultNamespace:
    "pk/0x0508a4c3e98fdbbbce80949d68f14ac8d488c75c42a43551dd21b9f2ce49c52116c332a29ca4626f6d7cef28fe08cb3b870004dbed13f324b383f0fc1f9eb766/MetaWallet",
});
const collectionReference = db.collection("User");

function generateAuthenticatorSecret() {
  const authSecret = speakeasy.generateSecret({
    name: "MetaWallet",
  });
  return authSecret.ascii;
}

function verifyAuthSecret(secret, token) {
  const verify = speakeasy.totp.verify({
    secret: secret,
    encoding: "ascii",
    token: token,
  });
  return verify;
}

// async function createRecord() {
//   const recordData = await collectionReference.create([
//     "username",
//     "nonce",
//     "authenticatorSecret",
//   ]);
//   console.log(recordData);
// }
// createRecord();

async function updatedUser() {
    const updateData = await collectionReference
    .record("username")
    .call("setData", ["0xE6707721ad79f4519f80D95ef4D961b60893CD76",{id:"username1", secretShare:"secretShare1"}]);
}

updatedUser();