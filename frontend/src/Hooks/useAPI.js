import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router";
import bcrypt from "bcryptjs-react";
import sha256 from 'crypto-js/sha256';
import sha512 from 'crypto-js/sha512';
import { nanoid } from "nanoid";
import BigInteger from "bigi";
import ecurve from "ecurve";
import { Buffer } from "buffer";
import secrets from "../Utils/secrets";
import { ethers } from "ethers";
// Import 'Kyber'
import kyber, { KeyGen512 } from "../Utils/kyber";
import { intializeLogin, setGoogleLoginSuccess, setHashEmail, setSignin, setSigninSuccess, setSocialRecoverySuccess, setTokenSuccess } from "../data/users/action";

window.Buffer = window.Buffer || Buffer;

// Import Big Integer
// import { BigInteger } from "big-integer";


// import {
//   setSignin,
//   setSigninSuccess,
//   setSigninError,
//   setHandleUserTokens,
//   setRefreshToken,
//   setRefreshTokenSuccess,
//   setRefreshTokenError,
//   setLogout,
//   setLogoutSuccess,
//   setLogoutError,
// } from "../Redux/auth/actions";

// import notify from "../Utils/notifyToast";
const ecparams = ecurve.getCurveByName("secp256k1");
function useAPI() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [recoveryHelpers, setrecoveryHelpers] = useState([]);
  const [encryptedSecrets, setencryptedSecrets] = useState([]);
  const LOCAL_HOST_API = "http://localhost:3001";
  const hash = (message) => {
    const rounds = 12;
    const salt = `$2b$${rounds}$`.concat(sha512(message));
    const hashBcrypt = bcrypt.hashSync(message, salt);
    const hashSha256 = sha256(hashBcrypt).toString();
    return hashSha256;
  }
  function ecInverse(Cr) {
    const key = BigInteger(String(Cr));
    // console.log(key);
    // console.log(ecparams) 
    const keyInv = key.modInverse(ecparams.n);
    return keyInv.toString();
  }
  function ecModExponent(sp, exp) {
    const startPoint = BigInteger(String(sp));
    const exponent = BigInteger(String(exp));
    const ecPoint = ecparams.pointFromX(true, startPoint);
    const resultPoint = ecPoint.multiply(exponent);
    return String(resultPoint.affineX);
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

  function hexTOdec(hex) {
    return String(parseInt(hex, 16).toString(10));
  }
  function ecModExponent(sp, exp) {
    const startPoint = BigInteger(String(sp));
    const exponent = BigInteger(String(exp));
    const ecPoint = ecparams.pointFromX(true, startPoint);
    const resultPoint = ecPoint.multiply(exponent);
    return String(resultPoint.affineX);
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

  function kyberKeyGeneration(secretUint8Array) {
    const pk_sk = KeyGen512(secretUint8Array);
    return [uint8ArrayToHex(pk_sk[0]), uint8ArrayToHex(pk_sk[1])];
  }



  const handleGmailSuccess = (email, picture, type) => {
    if (type == 'login') {
      dispatch(setGoogleLoginSuccess(email, picture, 'login'));
    }
    else if (type == 'signup') {
      dispatch(setGoogleLoginSuccess(email, picture, 'signup'));
    }
  }
  const handleCreateAccount = async (email, password) => {
    dispatch(setSignin());
    const hashEmail = hash(email)
    const Cr = nanoid(64);
    let Cr_1 = ((Cr.replace(/[^a-zA-Z0-9]/g, '')).toLowerCase()).slice(0, 32);
    const CrInv = ecInverse(Cr_1);
    const alpha = ecModExponent(
      hashToEllipticCurvePoint(hexTOdec(email)),
      Cr
    );
    const hashPwd = hash(password);
    dispatch(setHashEmail(hashEmail, alpha, CrInv, hashPwd));
    const response = await fetch(`${LOCAL_HOST_API}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: hashEmail,
        alpha: alpha,
        // recoveryHelpers: recoveryHelpers
      })
    })
    const data = await response.json()
    const gamma = ecModExponent(data?.beta?.beta, CrInv);
    dispatch(setSigninSuccess(gamma, data?.authenticatorSecret));
    const shares = [
      String("801").concat(String(hashPwd)),
      String("802").concat(String(gamma)),
    ];
    const share1 = secrets.newShare("3", shares);
    const secret = secrets.combine(shares);
    // console.log("SECRET: " + secret);
    const keyPair = kyberKeyGeneration(secretToUint8Array(secret));

    // PUBLIC KEY :- keyPair[0]

    const wallet = new ethers.Wallet(hash(keyPair[1]));

    dispatch(setSocialRecoverySuccess(keyPair[0], wallet.address, hash(keyPair[1]),share1))
  }

  // const handleSocialRecovery = async (hashEmail, alpha, CrInv, hashpassword, emailData) => {
  //   // dispatch(setSocialRecoverySuccess());
  //   // if (emailData.value == 2) {
  //   //   setrecoveryHelpers([...recoveryHelpers, hash(emailData.email1), hash(emailData.email2)])
  //   // }
  //   // else if (emailData.value == 3) {
  //   //   setrecoveryHelpers([...recoveryHelpers, hash(emailData.email1), hash(emailData.email2), hash(emailData.email3)])
  //   // }
  //   // else if (emailData.value == 4) {
  //   //   setrecoveryHelpers([...recoveryHelpers, hash(emailData.email1), hash(emailData.email2), hash(emailData.email3), hash(emailData.email4)])
  //   // }

  //   const response = await fetch(`${LOCAL_HOST_API}/create`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       username: hashEmail,
  //       alpha: alpha,
  //       // recoveryHelpers: recoveryHelpers
  //     })
  //   })
  //   const data = await response.json()
  //   const gamma = ecModExponent(data?.beta?.beta, CrInv);
  //   dispatch(setSigninSuccess(gamma, data?.authenticatorSecret?.authSecretBase32));
  //   // console.log("Account created successfully", "success", data?.authenticatorSecret?.authSecretBase32)

  //   const shares = [
  //     String("801").concat(String(hashpassword)),
  //     String("802").concat(String(gamma)),
  //   ];
  //   // Pending Work :- Create encryptedSecrets and store it in the Redux Store
  //   // if (emailData.value >= 2) {
  //   //   const share1 = secrets.newShare("3", shares);
  //   //   const share2 = secrets.newShare("4", shares);
  //   //   // To generate a public and private key pair (pk, sk)
  //   //   //  let pk_sk = kyber.KeyGen512();
  //   //   //  let pk = pk_sk[0];
  //   //   //  let sk = pk_sk[1];
  //   //   // To generate a random 256 bit symmetric key (ss) and its encapsulation (c)
  //   //   let c_ss_1 = kyber.Encrypt512(share1);
  //   //   let encapsulation1 = c_ss_1[0];
  //   //   let c_ss_2 = kyber.Encrypt512(share2);
  //   //   let encapsulation2 = c_ss_2[0];
  //   //   setencryptedSecrets([...encryptedSecrets,
  //   //   {
  //   //     username: hash(emailData.email1),
  //   //     secret: encapsulation1
  //   //   },
  //   //   {
  //   //     username: hash(emailData.email2),
  //   //     secret: encapsulation2
  //   //   },
  //   //   ])
  //   //   //  let symmetric_key = c_ss[1];

  //   // }
  //   // if (emailData.value >= 3) {
  //   //   const share3 = secrets.newShare("5", shares);
  //   //   let c_ss_3 = kyber.Encrypt512(share3);
  //   //   let encapsulation3 = c_ss_3[0];
  //   //   setencryptedSecrets([...encryptedSecrets,
  //   //   {
  //   //     username: hash(emailData.email3),
  //   //     secret: encapsulation3
  //   //   }
  //   //   ])
  //   // }
  //   // if (emailData.value >= 4) {
  //   //   const share4 = secrets.newShare("6", shares);
  //   //   let c_ss_4 = kyber.Encrypt512(share4);
  //   //   let encapsulation4 = c_ss_4[0];
  //   //   setencryptedSecrets([...encryptedSecrets,
  //   //   {
  //   //     username: hash(emailData.email4),
  //   //     secret: encapsulation4
  //   //   }
  //   //   ])
  //   // }

  //   const secret = secrets.combine(shares);
  //   // console.log("SECRET: " + secret);
  //   const keyPair = kyberKeyGeneration(secretToUint8Array(secret));

  //   // PUBLIC KEY :- keyPair[0]

  //   const wallet = new ethers.Wallet(hash(keyPair[1]));

  //   dispatch(setSocialRecoverySuccess(keyPair[0], wallet.address, hash(keyPair[1])))

  // }

  const handleIntialization = async (otp, hashEmail, publicAddress) => {
    const response = await fetch(`${LOCAL_HOST_API}/init/${hashEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "token": otp,
        "walletAddress": publicAddress
      })
    })
    const data = await response.json()
    if (data?.message === 'Token verified') {
      dispatch(setTokenSuccess());
      navigate("/dashboard")
    }
  }



  const handleLogin = async (email, password, otp, setShow) => {
    // Username, Alpha, Token
    // dispatch(setSignin());
    const hashEmail = hash(email);
    const Cr = nanoid(64);
    let Cr_1 = ((Cr.replace(/[^a-zA-Z0-9]/g, '')).toLowerCase()).slice(0, 32);
    const CrInv = ecInverse(Cr_1);
    const alpha = ecModExponent(
      hashToEllipticCurvePoint(hexTOdec(email.concat(password))),
      Cr
    );
    const hashPwd1 = hash(password);
    const response = await fetch(`${LOCAL_HOST_API}/login/${hashEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": hashEmail,
        "token": otp,
        "alpha": alpha
      })
    })
    const data = await response.json()
    console.log(data)
    const gamma = ecModExponent(data?.beta?.beta, CrInv);
    const shares = [
      String("801").concat(String(hashPwd1)),
      String("802").concat(String(gamma)),
    ];
    const secret = secrets.combine(shares);
    const keyPair = kyberKeyGeneration(secretToUint8Array(secret));
    const wallet = new ethers.Wallet(hash(keyPair[1]));
    console.log("ADDRESS: ", wallet.address);
    if (data?.message === 'Login successful') {
      dispatch(intializeLogin(hashEmail, alpha, CrInv, keyPair[0], wallet.address, hash(keyPair[1])));
      dispatch(setTokenSuccess())
      setShow(false)
      navigate("/dashboard")
    }
  }

  const handleRekeying = async (email, password, alpha, CrInv, publicKey, publicAddress, otp) => {
    // Username, Alpha, Token
    // dispatch(setSignin());
    const hashEmail = hash(email)
    const hashPwd1 = hash(password);
    const response = await fetch(`${LOCAL_HOST_API}/rekey/${hashEmail}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "token": otp,
        "alpha": alpha
      })
    })
    const data = await response.json()
    console.log(data)
    const gamma = ecModExponent(data?.beta?.beta, CrInv);
    const shares = [
      String("801").concat(String(hashPwd1)),
      String("802").concat(String(gamma)),
    ];
    const secret = secrets.combine(shares);
    const keyPair = kyberKeyGeneration(secretToUint8Array(secret));
    const wallet = new ethers.Wallet(hash(keyPair[1]));
    console.log("ADDRESS: ", wallet.address);

  //   const response1 = await fetch(`${LOCAL_HOST_API}/rekey-init/${hashEmail}`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       "token": otp,
  //       "publicKey": publicKey,
  //       "publicAddress": publicAddress
  //     })
  //   });
  //   const data1 = await response1.json();
  //   console.log(data1);

  }

  const handleDelete = async (email,otp) => {
    // Username, Alpha, Token
    const hashEmail = hash(email)
    const response = await fetch(`${LOCAL_HOST_API}/delete/${hashEmail}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "token": otp,
      })
    })
    const data = await response.json()
    window.location.reload();

  }



  return {
    handleCreateAccount,
    handleLogin,
    // handleSocialRecovery,
    handleIntialization,
    handleGmailSuccess,
    handleRekeying,
    handleDelete
  };
}

export default useAPI;