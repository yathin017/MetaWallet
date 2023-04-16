import {
  SIGN_IN, SIGN_IN_SUCCESS, TOKEN_SUCCESS, SOCIAL_RECOVERY_SUCCESS, HASH_EMAIL, INTIALIZE_LOGIN,GOOGLE_LOGIN_SUCCESS, FETCH_BALANCE, SEARCH_USER, REMOVE_ALERT, TRANSACTION_SUCCESS
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

export function fetchUserBalance(balance) {
  return {
    type: FETCH_BALANCE,
    payload: {
      balance: balance,
    },
  };
}

export function searchUser(email,userFound,showAlert) {
  return {
    type: SEARCH_USER,
    payload: {
      email: email,
      userFound:userFound,
      showAlert:showAlert
    },
  };
}

export function removeAlert() {
  return {
    type: REMOVE_ALERT,
  };
}

export function transactionSuccess(txnHash,txnStatus) {
  return {
    type: TRANSACTION_SUCCESS,
    payload: {
      txnHash: txnHash,
      txnStatus:txnStatus,
      txnAlert:true
    },
  };
}
