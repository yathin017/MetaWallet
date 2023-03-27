import {
    SIGN_IN,
    SIGN_IN_ERROR,
    SIGN_IN_SUCCESS,
    REFRESH_TOKEN,
    REFRESH_TOKEN_SUCCESS,
    REFRESH_TOKEN_ERROR,
    LOGOUT,
    LOGOUT_SUCCESS,
    LOGOUT_ERROR,
    HANDLE_TOKENS,
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
  };
  
  const useReducer = (state = initialState, action) => {
    switch (action.type) {
      case SIGN_IN:
      case LOGOUT: {
        return {
          ...state,
          loading: true,
        };
      }
      case REFRESH_TOKEN: {
        return {
          ...state,
          isTokenLoading: true,
        };
      }
      case SIGN_IN_SUCCESS: {
        return {
          ...state,
          loading: false,
          message: action.message,
          contact: action.contact,
        };
      }
      case LOGOUT_SUCCESS: {
        return {
          ...state,
          loading: false,
          message: action.payload,
        };
      }
      case REFRESH_TOKEN_SUCCESS:
      case REFRESH_TOKEN_ERROR: {
        return {
          ...state,
          isTokenLoading: false,
        };
      }
      case LOGOUT_ERROR:
      case SIGN_IN_ERROR: {
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      }
      case HANDLE_TOKENS: {
        return {
          ...state,
          accessToken: action.accessToken,
        };
      }
      default:
        return state;
    }
  };
  
  export { useReducer };