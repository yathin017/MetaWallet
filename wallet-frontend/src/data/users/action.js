import {
    SIGN_IN,
    SIGN_IN_ERROR,
    SIGN_IN_SUCCESS,
    HANDLE_TOKENS,
    REFRESH_TOKEN,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_ERROR,
    LOGOUT,
    LOGOUT_SUCCESS,
    LOGOUT_ERROR,
  } from "./types";
  
  export function setSignin() {
    return {
      type: SIGN_IN,
    };
  }
  
  export function setSigninSuccess(message, contact) {
    return {
      type: SIGN_IN_SUCCESS,
      payload: message,
      contact: contact,
    };
  }
  
  export function setSigninError(error) {
    return {
      type: SIGN_IN_ERROR,
      payload: error,
    };
  }
  
  export const setHandleUserTokens = (accessToken) => {
    return {
      type: HANDLE_TOKENS,
      accessToken: accessToken,
    };
  };
  
  export function setRefreshToken() {
    return {
      type: REFRESH_TOKEN,
    };
  }
  
  export function setRefreshTokenSuccess(message) {
    return {
      type: REFRESH_TOKEN_SUCCESS,
      payload: message,
    };
  }
  
  export function setRefreshTokenError(error) {
    return {
      type: REFRESH_TOKEN_ERROR,
      payload: error,
    };
  }
  
  export function setLogout() {
    return {
      type: LOGOUT,
    };
  }
  
  export function setLogoutSuccess(message) {
    return {
      type: LOGOUT_SUCCESS,
      payload: message,
    };
  }
  
  export function setLogoutError(error) {
    return {
      type: LOGOUT_ERROR,
      payload: error,
    };
  }