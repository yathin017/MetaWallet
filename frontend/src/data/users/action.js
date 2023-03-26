import {
    SIGN_IN, SIGN_IN_SUCCESS,TOKEN_SUCCESS,SOCIAL_RECOVERY_SUCCESS
  } from "./types";
  
  export function setSignin() {
    return {
      type: SIGN_IN,
    };
  }

  export function setSigninSuccess(gamma,hashpassword,authSecretBase32) {
    return {
      type: SIGN_IN_SUCCESS,
      payload:{
        gamma:gamma,
        hashpassword: hashpassword,
        authSecretBase32: authSecretBase32,
      },
    };
  }

  export function setSocialRecoverySuccess() {
    return {
      type: SOCIAL_RECOVERY_SUCCESS,
    };
  }
  