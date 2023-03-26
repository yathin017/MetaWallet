import {
    SIGN_IN, SIGN_IN_SUCCESS,
    TOKEN_SUCCESS,SOCIAL_RECOVERY_SUCCESS
  } from "./types";
  
  const initialState = {
    accessToken: null,
    userdata: {
        id: null,
        name: null,
        email: null,
        phone: null,
        walletAddress: null,
    },
    loading: false,
    isTokenLoading: false,
    error: null,
    message: null,
    qrLoading: 0,
    userAuthenticatonSecret: null,
    gamma:null,
    hashpassword:null,
    
  };
  
  const useReducer = (state = initialState, action) => {
    switch (action.type) {
      case SIGN_IN:
        return{
          ...state,
          loading: true,
          qrLoading: 1,
        }
      case SIGN_IN_SUCCESS:
        return {
          ...state,
          loading: false,
          gamma: action.payload.gamma,
          hashpassword: action.payload.hashpassword,
          userAuthenticatonSecret: action.payload.authSecretBase32,
        };
      case SOCIAL_RECOVERY_SUCCESS:
        return {
          ...state,
          qrLoading: 2,
        };
      default:
        return state;
    }
  };
  
  export { useReducer };