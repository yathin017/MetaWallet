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
import { KeyGen512 } from "../Utils/kyber";
import { intializeLogin, setHashEmail, setSignin, setSigninSuccess, setSocialRecoverySuccess, setTokenSuccess } from "../data/users/action";

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


  const handleCreateAccount = async (email, password1) => {
    dispatch(setSignin());
    const hashEmail = hash(email)
    const Cr = nanoid(64);
    let Cr_1 = ((Cr.replace(/[^a-zA-Z0-9]/g, '')).toLowerCase()).slice(0, 32);
    const CrInv = ecInverse(Cr_1);
    const alpha = ecModExponent(
      hashToEllipticCurvePoint(hexTOdec(email.concat(password1))),
      Cr
    );
    const hashPwd1 = hash(password1);

    dispatch(setHashEmail(hashEmail, alpha, CrInv, hashPwd1));

    // const mainshare = secrets.newShare("4", shares);
    // console.log("NEW SHARE: " + mainshare);

    // const secret = secrets.combine(shares);
    // console.log("SECRET: " + secret);

    // const keyPair = kyberKeyGeneration(secretToUint8Array(secret));
    // // console.log("PUBLIC KEY: " + keyPair[0]);
    // // console.log("PRIVATE KEY: " + keyPair[1]);

    // const wallet = new ethers.Wallet(hash(keyPair[1]));
    // console.log("ADDRESS: ", wallet.address);
    // if (data) {
    //   navigate("/dashboard")
    // }
  }

  const handleSocialRecovery = async (hashEmail, alpha, CrInv, hashpassword, emailData) => {
    // dispatch(setSocialRecoverySuccess());
    if (emailData.value == 2) {
      setrecoveryHelpers([...recoveryHelpers, hash(emailData.email1), hash(emailData.email2)])
    }
    else if (emailData.value == 3) {
      setrecoveryHelpers([...recoveryHelpers, hash(emailData.email1), hash(emailData.email2), hash(emailData.email3)])
    }
    else if (emailData.value == 4) {
      setrecoveryHelpers([...recoveryHelpers, hash(emailData.email1), hash(emailData.email2), hash(emailData.email3), hash(emailData.email4)])
    }
    console.log(recoveryHelpers)

    const response = await fetch(`${LOCAL_HOST_API}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: hashEmail,
        alpha: alpha,
        recoveryHelpers: recoveryHelpers
      })
    })
    const data = await response.json()
    const gamma = ecModExponent(data?.beta?.beta, CrInv);
    dispatch(setSigninSuccess(gamma, data?.authenticatorSecret?.authSecretBase32));
    console.log("Account created successfully", "success", data?.authenticatorSecret?.authSecretBase32)

    const shares = [
      String("801").concat(String(hashpassword)),
      String("802").concat(String(gamma)),
    ];
    console.log(shares);
    // Pending Work :- Create encryptedSecrets and store it in the Redux Store
    if (emailData.value >= 2) {
      const share1 = secrets.newShare("3", shares);
      // console.log("SHARE 1: " + share1);
      const share2 = secrets.newShare("4", shares);
      // console.log("SHARE 2: " + share2);

    }
    if (emailData.value >= 3) {
      const share3 = secrets.newShare("5", shares);
      // console.log("SHARE 3: " + share3);
    }
    if (emailData.value >= 4) {
      const share4 = secrets.newShare("6", shares);
      // console.log("SHARE 4: " + share4);
    }

    const secret = secrets.combine(shares);
    // console.log("SECRET: " + secret);
    const keyPair = kyberKeyGeneration(secretToUint8Array(secret));
    console.log("KEY PAIR: ", keyPair);

    // PUBLIC KEY :- keyPair[0]

    const wallet = new ethers.Wallet(hash(keyPair[1]));
    console.log("PRIVATE KEY: ", wallet.privateKey);
    console.log("ADDRESS: ", wallet.address);

    dispatch(setSocialRecoverySuccess(keyPair[0], wallet.address, hash(keyPair[1])))

  }

  const handleIntialization = async (otp, hashEmail, publicKey, publicAddress) => {
    console.log(otp, hashEmail, publicKey, publicAddress)
    const response = await fetch(`${LOCAL_HOST_API}/init`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "username": hashEmail,
        "encryptedSecrets": [],
        "token": otp,
        "publicKey": publicKey,
        "publicAddress": publicAddress
      })
    })
    const data = await response.json()
    console.log("OTP Response", data);
    if (data?.message === 'Token verified') {
      dispatch(setTokenSuccess());
      navigate("/dashboard")
    }
  }



  const handleLogin = async (email, password, otp) => {
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
      navigate("/dashboard")
    }
  }



  // const handleUserLogout = useCallback(() => {
  //   dispatch(setLogout());
  //   logout()
  //     .then((response) => {
  //       dispatch(setLogoutSuccess(response.data.message));
  //       dispatch(setHandleUserTokens(null));
  //       notify("Logout successfull", "success");
  //       navigate(0);
  //     })
  //     .catch((error) => {
  //       dispatch(
  //         setLogoutError(
  //           error?.response?.data?.errors?.[0]
  //             ? error?.response?.data?.errors?.[0]
  //             : "Some server error occured, please try again later!"
  //         )
  //       );
  //       notify(
  //         error?.response?.data?.errors?.[0]?.message
  //           ? error?.response?.data?.errors?.[0]?.message
  //           : "Some server error occured, please try again later!",
  //         "error"
  //       );
  //     });
  // }, [dispatch, navigate]);

  return {
    handleCreateAccount,
    handleLogin,
    handleSocialRecovery,
    handleIntialization
  };
}

export default useAPI;