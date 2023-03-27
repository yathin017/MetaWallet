import {
    SIGN_IN, SIGN_IN_SUCCESS,
    TOKEN_SUCCESS,SOCIAL_RECOVERY_SUCCESS,HASH_EMAIL,INTIALIZE_LOGIN
  } from "./types";
  
  const initialState = {
    accessToken: null,
    userData: {
      hashemail: null,
      alpha: null,
      CrInv: null,
      hashpassword: null,
      publicKey: null,
      walletAddress: null,
      privateKey:null
    },
    loading: false,
    isTokenLoading: false,
    error: null,
    message: null,
    qrLoading: 0,
    userAuthenticatonSecret: null,
    gamma:null,
    
    
  };
  
  const useReducer = (state = initialState, action) => {
    switch (action.type) {
      case SIGN_IN:
        return{
          ...state,
          loading: true,
          qrLoading: 1,
        }
      case HASH_EMAIL:
        return {
          ...state,
          userData: {
            ...state.userData,
            hashemail: action.payload.hashemail,
            alpha: action.payload.alpha,
            CrInv: action.payload.CrInv,
            hashpassword: action.payload.hashpassword,
          },
        };
      case SIGN_IN_SUCCESS:
        return {
          ...state,
          loading: false,
          gamma: action.payload.gamma,
          userAuthenticatonSecret: action.payload.authSecretBase32,
        };
      case SOCIAL_RECOVERY_SUCCESS:
        return {
          ...state,
          qrLoading: 2,
          userData: {
            ...state.userData,
            publicKey: action.payload.publicKey,
            walletAddress: action.payload.publicAddress,
            privateKey:action.payload.privateKey
          },
        };
      case TOKEN_SUCCESS:
        return {
          ...state,
          qrLoading: 3,
        };

      case INTIALIZE_LOGIN:
        return {
          ...state,
          userData: {
            ...state.userData,
            hashemail: action.payload.hashemail,
            alpha: action.payload.alpha,
            CrInv: action.payload.CrInv,
            hashpassword: action.payload.hashpassword,
            publicKey: action.payload.publicKey,
            walletAddress: action.payload.publicAddress,
            privateKey:action.payload.privateKey
          },
        };

      default:
        return state;
    }
  };
  
  export { useReducer };