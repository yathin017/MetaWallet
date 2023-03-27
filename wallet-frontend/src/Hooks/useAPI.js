import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router";
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

function useAPI() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const handleCreateAccount = async (email, password1, password2) => {
      // dispatch(setSignin());
      console.log(email, password1, password2)
      const response = await fetch("https://api.quotable.io/random",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password1: password1,
            password2: password2
        })
      })
      const data = await response.json()
      if(data){
        navigate("/dashboard")
      }
    }
  const handleLogin = async (email, password1, password2) => {
      // dispatch(setSignin());
      console.log(email, password1, password2)
      const response = await fetch("https://api.quotable.io/random",{
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password1: password1,
            password2: password2
        })
      })
      const data = await response.json()
      if(data){
        navigate("/dashboard")
      }
    }

  // const handleRefreshToken = useCallback(() => {
  //   dispatch(setRefreshToken());
  //   refreshToken()
  //     .then((response) => {
  //       dispatch(setRefreshTokenSuccess(response.data.message));
  //       dispatch(setHandleUserTokens(response.data.accessToken));
  //     })
  //     .catch((error) => {
  //       dispatch(
  //         setRefreshTokenError(
  //           error?.response?.data?.errors?.[0]
  //             ? error?.response?.data?.errors?.[0]
  //             : "Some server error occured, please try again later!"
  //         )
  //       );
  //       navigate("/");
  //     });
  // }, [dispatch, navigate, location]);

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
    handleLogin
  };
}

export default useAPI;