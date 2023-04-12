import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { BottomFooter } from "./components/BottomFooter";
import { Nav } from "./components/Nav";
import Settings from "./components/Settings";
import Trade from "./components/Trade";
import env from "react-dotenv";
import Landingpage from "./components/LandingPage/Landingpage";
import Alert from "./components/Alert";
import { useSelector } from "react-redux";


function App() {
  const [show, setShow] = React.useState(false)
  const onClose = () => {
    setShow(false)
  }
  const { searchedUser } = useSelector(state => state.users);
  return (
    <GoogleOAuthProvider clientId={env.GOOGLE_LOGIN_CREDENTIAL}>
      <Routes>
        <Route path="/" element={<div className="z-0 bg-[#192134]">
          {
            searchedUser.showAlert ? <div className="w-1/3 fixed top-10 left-[33%] z-10" data-aos="fade-top" data-aos-delay="300">
              <Alert />
            </div> : null
          }
          <Nav setShow={setShow} show={show} onClose={onClose} />
          <Landingpage />
          <BottomFooter />
        </div>} />
        <Route path="/dashboard" element={<div className="z-0 bg-[#192134]">
          <Nav setShow={setShow} show={show} onClose={onClose} />
          <Trade setShow={setShow} />
          <BottomFooter />
        </div>} />
        <Route path="/settings" element={<div className="z-0 bg-[#192134]">
          <Nav setShow={setShow} show={show} onClose={onClose} />
          <Settings setShow={setShow} show={show} onClose={onClose} />
          <BottomFooter />
        </div>} />
      </Routes>
    </GoogleOAuthProvider>
  );
}

export default App;