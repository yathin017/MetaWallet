import {
  SIGN_IN, SIGN_IN_SUCCESS,
  TOKEN_SUCCESS, SOCIAL_RECOVERY_SUCCESS, HASH_EMAIL, INTIALIZE_LOGIN, GOOGLE_LOGIN_SUCCESS, FETCH_BALANCE, SEARCH_USER, REMOVE_ALERT, TRANSACTION_SUCCESS
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
    privateKey: null,
    email: null,
    picture: null,
    secretShare: null,
    balance: null
  },
  loading: false,
  isUserLoggedin: false,
  error: null,
  message: null,
  qrLoading: -1,
  userAuthenticatonSecret: null,
  gamma: null,
  loginLoading: 0,
  searchedUser: {
    email: null,
    userFound: false,
    showAlert: false
  },
  transactionData: {
    txnHash: null,
    txnStatus: null,
    txnAlert: false
  }



};

const useReducer = (state = initialState, action) => {
  switch (action.type) {
    case GOOGLE_LOGIN_SUCCESS:
      return {
        ...state,
        userData: {
          ...state.userData,
          email: action.payload.email,
          picture: action.payload.picture,
        },
        qrLoading: 0,
        loginLoading: 1,
      };
    case SIGN_IN:
      return {
        ...state,
        loading: true,
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
        qrLoading: 2,
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
          privateKey: action.payload.privateKey,
          secretShare: action.payload.secretShare
        },

      };
    case TOKEN_SUCCESS:
      return {
        ...state,
        qrLoading: 3,
        isUserLoggedin: true,
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
          privateKey: action.payload.privateKey
        },
      };
    case FETCH_BALANCE:
      return {
        ...state,
        userData: {
          ...state.userData,
          balance: action.payload.balance,
        },
      };
    case SEARCH_USER:
      return {
        ...state,
        searchedUser: {
          email: action.payload.email,
          userFound: action.payload.userFound,
          showAlert: action.payload.showAlert
        }
      }
    case REMOVE_ALERT:
      return {
        ...state,
        searchedUser: {
          email: null,
          userFound: false,
          showAlert: false
        },
        transactionData: {
          txnHash: null,
          txnStatus: null,
          txnAlert: false
        }
      }
    case TRANSACTION_SUCCESS:
      return {
        ...state,
        transactionData: {
          txnHash: action.payload.txnHash,
          txnStatus: action.payload.txnStatus,
        }

      }



    default:
      return state;
  }
};

export { useReducer };