import {
  SIGN_IN, SIGN_IN_SUCCESS, TOKEN_SUCCESS, SOCIAL_RECOVERY_SUCCESS, HASH_EMAIL, INTIALIZE_LOGIN,GOOGLE_LOGIN_SUCCESS
} from "./types";

export function setGoogleLoginSuccess(email,picture) {
  return {
    type: GOOGLE_LOGIN_SUCCESS,
    payload: {
      email: email,
      picture: picture,
    },
  };
}

export function setSignin() {
  return {
    type: SIGN_IN,
  };
}

export function setHashEmail(hashemail, alpha, CrInv, hashpassword) {
  return {
    type: HASH_EMAIL,
    payload: { hashemail: hashemail, alpha: alpha, CrInv: CrInv, hashpassword: hashpassword },
  };
}

export function setSigninSuccess(gamma, authSecretBase32) {
  return {
    type: SIGN_IN_SUCCESS,
    payload: {
      gamma: gamma,
      authSecretBase32: authSecretBase32,
    },
  };
}

export function setSocialRecoverySuccess(publicKey, publicAddress, privateKey,secretShare) {
  return {
    type: SOCIAL_RECOVERY_SUCCESS,
    payload: {
      publicKey: publicKey,
      publicAddress: publicAddress,
      privateKey: privateKey,
      secretShare:secretShare
    },

  };
}

export function setTokenSuccess() {
  return {
    type: TOKEN_SUCCESS,
  };
}

export function intializeLogin(hashemail, alpha, CrInv, publicKey, publicAddress, privateKey) {
  return {
    type: INTIALIZE_LOGIN,
    payload: {
      hashemail: hashemail, alpha: alpha, CrInv: CrInv, publicKey: publicKey,
      publicAddress: publicAddress,
      privateKey: privateKey
    },
  };
}